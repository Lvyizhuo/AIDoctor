const auth = require('./auth.js');
const chat = require('./chat.js');
const members = require('./members.js');
const reminders = require('./reminders.js');

module.exports = {
  ...auth,
  ...chat,
  ...members,
  ...reminders
};
