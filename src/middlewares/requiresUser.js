module.exports = iocContainer => (req, res, next) => {
  if(req.user && req.user.user_id ==  0) {
    return next();
  }
  if (!req.user || (!req.user.user_id)) return next(new iocContainer.errors.Unauthorised("UNAUTHORISED"));
  next();
};
