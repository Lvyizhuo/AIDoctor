const config = require('./config.js');
const app = getApp();

function getToken() {
  return wx.getStorageSync(config.tokenKey);
}

function setToken(token) {
  wx.setStorageSync(config.tokenKey, token);
}

function removeToken() {
  wx.removeStorageSync(config.tokenKey);
}

function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options;

    const token = getToken();
    const requestHeader = {
      'Content-Type': 'application/json',
      ...header
    };

    if (token) {
      requestHeader['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: `${config.apiBaseUrl}${url}`,
      method: method,
      data: data,
      header: requestHeader,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(new Error(res.data.message));
          }
        } else if (res.statusCode === 401) {
          removeToken();
          wx.removeStorageSync(config.userKey);
          if (app && app.globalData) {
            app.globalData.isAuthenticated = false;
            app.globalData.userInfo = null;
            app.globalData.token = null;
          }
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            });
          }, 1500);
          reject(new Error('未授权'));
        } else {
          wx.showToast({
            title: `网络错误 ${res.statusCode}`,
            icon: 'none'
          });
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
}

function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
}

function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  getToken,
  setToken,
  removeToken
};
