const Validator = require("fastest-validator");

const v = new Validator();

const validateAddCategory = v.compile({
  title: {
    type: "string",
    max: 15,
  },
  color: {
    type: "string",
  },
  avatar: {
    type: "string",
  },
  type: {
    type: "string",
  },
  $$strict: true,
});

const validateUpdateCategory = v.compile({
  id: {
    type: "number",
  },
  title: {
    type: "string",
    max: 15,
  },
  color: {
    type: "string",
  },
  avatar: {
    type: "string",
  },
  type: {
    type: "string",
  },
  $$strict: true,
});

const validateDeleteCategory = v.compile({
  id: {
    type: "number",
  },
});

// const validateVerifyOtp = v.compile({
//   phone_number: {
//     type: 'string',
//     length: 10,
//     pattern: "^[6-9][0-9]{9}$"
//   },
//   otp: {
//     type: 'string',
//     length: 4,
//     pattern: new RegExp("^[1-9][0-9]{3}$")
//   },
//   device_id: {
//     type: 'string',
//     optional: true
//   },
//   $$strict: true
// });

module.exports = {
  validateAddCategory,
  validateUpdateCategory,
  validateDeleteCategory,
  // validateVerifyOtp
};
