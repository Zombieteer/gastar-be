const db = require("../utils/db");
const SessionService = require("./SessionService");
const SmsService = require("./SmsService");
const UserService = require("./UserService");

const smsService = new SmsService();
const userService = new UserService(db);
const sessionService = new SessionService(db, smsService, userService);

module.exports = {
  smsService,
  sessionService,
  userService,
};
