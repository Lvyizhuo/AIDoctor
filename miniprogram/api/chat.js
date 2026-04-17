const { get, post } = require('../utils/request.js');

function createSession(memberId) {
  return post('/chat/sessions', { member_id: memberId });
}

function getSessions() {
  return get('/chat/sessions');
}

function getSessionDetail(sessionId) {
  return get(`/chat/sessions/${sessionId}`);
}

function chatCompletions(data) {
  return post('/chat/completions', data);
}

function uploadReport(filePath, memberId) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('aidoc_token');
    wx.uploadFile({
      url: 'http://localhost:8000/api/chat/upload-report',
      filePath: filePath,
      name: 'file',
      formData: {
        member_id: memberId || ''
      },
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = {
  createSession,
  getSessions,
  getSessionDetail,
  chatCompletions,
  uploadReport
};
