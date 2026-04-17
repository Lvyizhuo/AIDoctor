const { post, get, removeToken } = require('../utils/request.js');
const config = require('../utils/config.js');

function wechatLogin(code) {
  return post('/auth/login', { code });
}

function logout() {
  return post('/auth/logout').then(() => {
    removeToken();
    wx.removeStorageSync(config.userKey);
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.isAuthenticated = false;
      app.globalData.userInfo = null;
      app.globalData.token = null;
    }
  });
}

function getProfile() {
  return get('/auth/profile');
}

module.exports = {
  wechatLogin,
  logout,
  getProfile
};
