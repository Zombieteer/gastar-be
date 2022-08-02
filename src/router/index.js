module.exports = function (iocContainer) {
  const {
    express,
  } = iocContainer;

  const router = express.Router();

  // Unauthenticated Routes
  router.use('/api/auth', require('../components/auth')(iocContainer));
  router.use('/api/categories', require('../components/categories')(iocContainer));

  return router;
};
