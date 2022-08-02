class SessionService {
  constructor(db, smsService, userService) {
    this.db = db;
    this.smsService = smsService;
    this.userService = userService;
    this.dao = require("./dao")(db);
  }

  async sendOtp(phone_number) {
    const otp = await this.dao.getOtp(phone_number);
    const resp = await this.smsService.sendOtp(phone_number, otp);
    return resp;
  }

  async verifyOtp(phone_number, otp, device_id, user_agent) {
    const isOtpVerified = await this.dao.verifyOtp(phone_number, otp);

    console.log({ isOtpVerified });

    if (!isOtpVerified) {
      throw new Error("INVALID_OTP");
    }

    await this.userService.createUser(phone_number, is_active);

    const session_id = await this.dao.createSession(
      phone_number,
      otp,
      device_id,
      user_agent
    );

    const user = await this.getUserFromSession(session_id);

    if (!user || !user.user_id) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  async getUserFromSession(session_id) {
    const user = await this.dao.getUserFromSession(session_id);

    if (!user) {
      return {};
    }

    return user;
  }

  async logoutSessionById(session_id) {
    await this.dao.logoutSessionById(session_id);
  }
}

module.exports = SessionService;
