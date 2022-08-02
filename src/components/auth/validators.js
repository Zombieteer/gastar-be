const Validator = require("fastest-validator");

const v = new Validator();

const validateGetOtp = v.compile({
  phone_number: {
    type: 'string',
    length: 10,
    pattern: "^[6-9][0-9]{9}$"
  },
  $$strict: true
});

const validateVerifyOtp = v.compile({
  phone_number: {
    type: 'string',
    length: 10,
    pattern: "^[6-9][0-9]{9}$"
  },
  otp: {
    type: 'string',
    length: 4,
    pattern: new RegExp("^[1-9][0-9]{3}$")
  },
  device_id: {
    type: 'string',
    optional: true
  },
  $$strict: true
});

module.exports = {
  validateGetOtp,
  validateVerifyOtp
};
