const router = require('./router');
const validators = require('./validators');

const getRouter = iocContainer => {
  return router({
    ...iocContainer,
    validators,
  });
};

module.exports = getRouter;
