// pages/records/records.js
Page({
  data: {

  },

  onLoad() {
    this.checkAuth();
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
    }
  }
})
