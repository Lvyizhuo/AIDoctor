// pages/index/index.js
const { getReminders, getMembers } = require('../../api/index.js');

Page({
  data: {
    reminders: [
      {
        id: 1,
        title: '服用降压药',
        time: '上午9:00',
        icon: '/assets/icons/pill.png',
        done: false
      },
      {
        id: 2,
        title: '晨间运动',
        time: '步行30分钟',
        icon: '/assets/icons/person-standing.png',
        done: false
      }
    ],
    members: [
      {
        id: 1,
        name: '张伟',
        relation: '父亲 | 58岁',
        avatar: 'https://images.unsplash.com/photo-1774821171205-4e4b5352666d?w=150&h=150&fit=crop'
      },
      {
        id: 2,
        name: '李芳',
        relation: '母亲 | 55岁',
        avatar: 'https://images.unsplash.com/photo-1765248149073-69113caaa253?w=150&h=150&fit=crop'
      }
    ]
  },

  onLoad() {
    this.checkAuth();
  },

  onShow() {
    this.checkAuth();
    this.loadData();
  },

  checkAuth() {
    const app = getApp();
    if (!app.globalData.isAuthenticated) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  },

  async loadData() {
    try {
      await Promise.all([
        this.loadReminders(),
        this.loadMembers()
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  },

  async loadReminders() {
    try {
      const response = await getReminders();
      if (response.code === 0 && response.data) {
        this.setData({
          reminders: response.data.map(r => ({
            ...r,
            icon: r.type === 'medicine' ? '/assets/icons/pill.png' : '/assets/icons/person-standing.png',
            done: false
          }))
        });
      }
    } catch (error) {
      console.error('加载提醒失败:', error);
    }
  },

  async loadMembers() {
    try {
      const response = await getMembers();
      if (response.code === 0 && response.data) {
        this.setData({
          members: response.data.map(m => ({
            id: m.id,
            name: m.name,
            relation: `${m.relationship} | ${m.age || '未知年龄'}岁`,
            avatar: m.avatar_url || '/assets/icons/default-avatar.png'
          }))
        });
      }
    } catch (error) {
      console.error('加载成员失败:', error);
    }
  },

  handleReminderTap(e) {
    const id = e.currentTarget.dataset.id;
    const reminders = this.data.reminders.map(r => {
      if (r.id === id) {
        return { ...r, done: true };
      }
      return r;
    });

    this.setData({ reminders });

    setTimeout(() => {
      this.setData({
        reminders: this.data.reminders.filter(r => !r.done)
      });
    }, 500);
  },

  goToAIConsult() {
    wx.navigateTo({
      url: '/pages/ai-consult/ai-consult'
    });
  },

  goToRecords() {
    wx.switchTab({
      url: '/pages/records/records'
    });
  }
})
