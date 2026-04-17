// pages/consult/consult.js
const { getSessions } = require('../../api/index.js');

Page({
  data: {
    sessions: []
  },

  onLoad() {
    this.checkAuth();
  },

  onShow() {
    this.checkAuth();
    this.loadSessions();
  },

  checkAuth() {
    const app = getApp();
    if (!app.globalData.isAuthenticated) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  },

  async loadSessions() {
    try {
      const response = await getSessions();
      if (response.code === 0 && response.data) {
        this.setData({ sessions: response.data });
      }
    } catch (error) {
      console.error('加载会话失败:', error);
    }
  },

  startConsult() {
    wx.navigateTo({
      url: '/pages/ai-consult/ai-consult'
    });
  }
})
