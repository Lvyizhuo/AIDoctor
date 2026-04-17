const { get, post, put, del } = require('../utils/request.js');

function getMembers() {
  return get('/members');
}

function getMember(memberId) {
  return get(`/members/${memberId}`);
}

function createMember(data) {
  return post('/members', data);
}

function updateMember(memberId, data) {
  return put(`/members/${memberId}`, data);
}

function deleteMember(memberId) {
  return del(`/members/${memberId}`);
}

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
};
