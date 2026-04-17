// pages/login/login.js
const { wechatLogin } = require('../../api/index.js');
const config = require('../../utils/config.js');

Page({
  data: {
    isLoggingIn: false
  },

  onLoad(options) {
    const app = getApp();
    if (app.globalData.isAuthenticated) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  onShow() {
    const app = getApp();
    if (app.globalData.isAuthenticated) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  handleLogin() {
    const app = getApp();

    wx.login({
      success: async (res) => {
        if (res.code) {
          this.setData({ isLoggingIn: true });

          try {
            const code = `mock_code_${Date.now()}`;
            const response = await wechatLogin(code);

            if (response.code === 0 && response.data) {
              const { token, user } = response.data;

              app.setAuth(token, user);

              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1500
              });

              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }, 1500);
            }
          } catch (error) {
            console.error('登录失败:', error);
            wx.showToast({
              title: error.message || '登录失败，请重试',
              icon: 'none'
            });
          } finally {
            this.setData({ isLoggingIn: false });
          }
        } else {
          wx.showToast({
            title: '获取微信登录凭证失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        });
      }
    });
  }
})
