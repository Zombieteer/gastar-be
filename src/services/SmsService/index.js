const axios = require("axios");
class SmsService {
  async sendOtp(phone_number, otp) {
    console.log(phone_number, otp);
    // const smsBaseUrl = process.env.SMS_BASE_URL
    // const otpMessage = `Gastar OTP ${otp} wpsWLdLt9nscn2jbTD3uxe, do not share it with anyone`;
    // const url = `${smsBaseUrl}/v4/index.php?api_key=A996400c9f1e38223d55b79ff79c4408e&method=sms&unicode=auto&sender=CMUNTY&to=${phone_number}&message=${otpMessage}`;
    // const resp = await axios.get(encodeURI(url));
    // if (resp.status == 200)
    return { success: true };
  }
}

module.exports = SmsService;
