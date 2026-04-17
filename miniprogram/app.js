// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    isAuthenticated: false,
    apiBaseUrl: 'http://localhost:8000/api'
  },

  onLaunch() {
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('aidoc_token');
    const userInfo = wx.getStorageSync('aidoc_user');

    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.isAuthenticated = true;
    }
  },

  setAuth(token, userInfo) {
    this.globalData.token = token;
    this.globalData.userInfo = userInfo;
    this.globalData.isAuthenticated = true;
    wx.setStorageSync('aidoc_token', token);
    wx.setStorageSync('aidoc_user', userInfo);
  },

  clearAuth() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    this.globalData.isAuthenticated = false;
    wx.removeStorageSync('aidoc_token');
    wx.removeStorageSync('aidoc_user');
  }
})
