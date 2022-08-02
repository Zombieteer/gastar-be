module.exports = (iocContainer) => {
  const { express, middlewares, validators, services } = iocContainer;
  const router = express.Router();

  const { sessionService } = services;

  router.post("/get-otp", async (req, res) => {
    const isValidated = validators.validateGetOtp(req.body);
    if (isValidated !== true) {
      return res.status(400).json({
        message: "Phone number is not valid",
      });
    }

    try {
      const resp = await sessionService.sendOtp(req.body.phone_number);
      res.json(resp);
    } catch (e) {
      return res.status(400).json({
        message: "Please try again",
      });
    }
  });

  router.post("/verify-otp", async (req, res) => {
    const isValidated = validators.validateVerifyOtp(req.body);

    if (isValidated !== true) {
      return res.status(400).json({
        message: "Phone number or OTP is invalid",
      });
    }

    try {
      const user = await sessionService.verifyOtp(
        req.body.phone_number,
        req.body.otp,
        req.body.device_id,
        req.headers["user-agent"]
      );

      res.json(user);
    } catch (e) {
      if (e.message === "INVALID_OTP") {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }

      throw e;
    }
  });

  router.get(
    "/me",
    middlewares.requiresUser(iocContainer),
    async (req, res) => {
      res.json(req.user);
    }
  );

  router.post(
    "/logout",
    middlewares.requiresUser(iocContainer),
    async (req, res) => {
      try {
        await sessionService.logoutSessionById(req.user.session_id);
      } catch (e) {
        console.debug(e);
      }

      res.end();
    }
  );

  return router;
};
