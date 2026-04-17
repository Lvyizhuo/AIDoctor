const { get, post, put, del } = require('../utils/request.js');

function getReminders() {
  return get('/reminders');
}

function getReminder(reminderId) {
  return get(`/reminders/${reminderId}`);
}

function createReminder(data) {
  return post('/reminders', data);
}

function updateReminder(reminderId, data) {
  return put(`/reminders/${reminderId}`, data);
}

function deleteReminder(reminderId) {
  return del(`/reminders/${reminderId}`);
}

function completeReminder(reminderId, data) {
  return post(`/reminders/${reminderId}/complete`, data);
}

module.exports = {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder
};
