// pages/profile/profile.js
const { logout } = require('../../api/index.js');

Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    this.checkAuth();
    this.loadUserInfo();
  },

  onShow() {
    this.checkAuth();
    this.loadUserInfo();
  },

  checkAuth() {
    const app = getApp();
    if (!app.globalData.isAuthenticated) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  },

  loadUserInfo() {
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    }
  },

  goToMembers() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToReminders() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await logout();
            wx.reLaunch({
              url: '/pages/login/login'
            });
          } catch (error) {
            console.error('退出登录失败:', error);
            const app = getApp();
            app.clearAuth();
            wx.reLaunch({
              url: '/pages/login/login'
            });
          }
        }
      }
    });
  }
})
