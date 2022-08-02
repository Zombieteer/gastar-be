const db = require("../utils/db");
const SessionService = require("./SessionService");
const SmsService = require("./SmsService");
const UserService = require("./UserService");
const CategoryService = require("./CategoryService");

const smsService = new SmsService();
const userService = new UserService(db);
const sessionService = new SessionService(db, smsService, userService);
const categoryService = new CategoryService(db);

module.exports = {
  smsService,
  sessionService,
  userService,
  categoryService,
};
