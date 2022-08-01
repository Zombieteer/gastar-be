module.exports = function (iocContainer) {
  const {
    express,
  } = iocContainer;

  const router = express.Router();

  // Unauthenticated Routes
  // router.use('/api/auth', require('../components/auth')(iocContainer));

  return router;
};
