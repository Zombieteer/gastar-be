module.exports = (iocContainer) => {
  const { express, middlewares, validators, services } = iocContainer;
  const router = express.Router();

  const { categoryService } = services;

  router.get(
    "/get-all-categories",
    middlewares.requiresUser(iocContainer),
    async (req, res) => {
      try {
        const resp = await categoryService.getUserCategories(req.user.user_id);
        res.json(resp);
      } catch (e) {
        return res.status(400).json({
          message: "Please try again",
        });
      }
    }
  );

  router.post(
    "/add-category",
    middlewares.requiresUser(iocContainer),
    async (req, res) => {
      const isValidated = validators.validateAddCategory(req.body);

      if (isValidated !== true) {
        return res.status(400).json({
          message: "Check all fields",
        });
      }

      try {
        const { type, title, color, avatar_name } = req.body;
        const { user_id } = req.user;
        const resp = await categoryService.addCategory(
          user_id,
          type,
          title,
          color,
          avatar_name
        );
        res.json(resp);
      } catch (e) {
        if (e.message == "CATEGORY_ALREADY_EXISTS")
          return res.status(400).json({
            message: "Name Already Exists",
          });
        return res.status(400).json({
          message: "Please try again",
        });
      }
    }
  );

  router.post(
    "/update-category",
    middlewares.requiresUser(iocContainer),
    async (req, res) => {
      const isValidated = validators.validateUpdateCategory(req.body);

      if (isValidated !== true) {
        return res.status(400).json({
          message: "Check all fields",
        });
      }

      try {
        const { id, type, title, color, avatar_name } = req.body;
        const { user_id } = req.user;
        const resp = await categoryService.updateCategory(
          id,
          type,
          user_id,
          title,
          color,
          avatar_name
        );
        res.json(resp);
      } catch (e) {
        if (e.message == "CATEGORY_ALREADY_EXISTS")
          return res.status(400).json({
            message: "Name Already Exists",
          });
        return res.status(400).json({
          message: "Please try again",
        });
      }
    }
  );

  router.post(
    "/delete-category",
    middlewares.requiresUser(iocContainer),
    async (req, res) => {
      const isValidated = validators.validateDeleteCategory(req.body);

      if (isValidated !== true) {
        return res.status(400).json({
          message: "Check all fields",
        });
      }

      try {
        await categoryService.deleteCategory(req.body.id);
      } catch (e) {
        console.debug(e);
        return res.status(400).json({
          message: "Please try again",
        });
      }

      res.end();
    }
  );

  return router;
};
