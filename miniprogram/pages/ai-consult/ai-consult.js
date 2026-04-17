// pages/ai-consult/ai-consult.js
const { chatCompletions, uploadReport, getMembers } = require('../../api/index.js');

Page({
  data: {
    messages: [
      {
        role: 'assistant',
        content: '您好！我是基于医助大模型打造的智能导诊助手。为了帮您推荐最合适的科室，我需要了解一些基本信息，这样我可以更准确地为您提供帮助。',
        isWelcome: true
      },
      {
        role: 'assistant',
        content: '请问，您主要有哪些不适？'
      }
    ],
    inputText: '',
    isLoading: false,
    scrollToView: '',
    sessionId: '',
    currentMemberId: null,
    userAvatar: '/assets/icons/default-avatar.png'
  },

  onLoad(options) {
    this.checkAuth();
    this.loadMemberInfo();
  },

  onShow() {
    this.checkAuth();
  },

  checkAuth() {
    const app = getApp();
    if (!app.globalData.isAuthenticated) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    } else {
      const userInfo = app.globalData.userInfo;
      if (userInfo && userInfo.avatar_url) {
        this.setData({ userAvatar: userInfo.avatar_url });
      }
    }
  },

  async loadMemberInfo() {
    try {
      const response = await getMembers();
      if (response.code === 0 && response.data && response.data.length > 0) {
        this.setData({ currentMemberId: response.data[0].id.toString() });
      }
    } catch (error) {
      console.error('加载成员信息失败:', error);
    }
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  async sendMessage() {
    const { inputText, isLoading, sessionId, currentMemberId } = this.data;

    if (!inputText.trim() || isLoading) {
      return;
    }

    const userMessage = inputText.trim();
    this.setData({
      inputText: '',
      isLoading: true,
      messages: [
        ...this.data.messages,
        { role: 'user', content: userMessage }
      ]
    });

    this.scrollToBottom(this.data.messages.length);

    try {
      const requestData = {
        message: userMessage,
        member_id: currentMemberId || '1'
      };

      if (sessionId) {
        requestData.session_id = sessionId;
      }

      const response = await chatCompletions(requestData);

      if (response.code === 0 && response.data) {
        this.setData({
          sessionId: response.data.session_id,
          messages: [
            ...this.data.messages,
            { role: 'assistant', content: response.data.content }
          ],
          isLoading: false
        });
        this.scrollToBottom(this.data.messages.length + 1);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      this.setData({ isLoading: false });
      wx.showToast({
        title: error.message || '发送失败',
        icon: 'none'
      });
    }
  },

  scrollToBottom(index) {
    setTimeout(() => {
      this.setData({
        scrollToView: `msg-${index}`
      });
    }, 100);
  },

  goBack() {
    wx.navigateBack();
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const filePath = res.tempFilePaths[0];
        await this.uploadImage(filePath);
      }
    });
  },

  async uploadImage(filePath) {
    wx.showLoading({ title: '上传中...' });

    try {
      const response = await uploadReport(filePath, this.data.currentMemberId);
      wx.hideLoading();

      if (response.code === 0) {
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
    }
  },

  uploadReport() {
    this.chooseImage();
  }
})
