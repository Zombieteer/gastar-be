const validationMw = iocContainer => (validators) => (req, res, next) => {
  const errors = [];
  if (Array.isArray(validators)) {
    validators.forEach(validator => {
      const result = validator(req.body, req.query);
      if (!!result.error) {
        errors.push(result.error);
      }
    });
  } else if (typeof validators === 'object') { /// permissions based check only first matched permission
    Object.keys(validators).every(PERM_NAME => {
      if (req.user.permissions.find(perm => perm.permission_name === PERM_NAME)) {
        const validator = validators[PERM_NAME];
        const result = validator(req.body, req.query);
        if (!!result.error) {
          errors.push(result.error);
        }
        return false;
      }
    });
  }

  if (errors.length > 0) {
    next(new iocContainer.errors.ValidationError(errors));
  } else {
    next();
  }
};

module.exports = validationMw;
