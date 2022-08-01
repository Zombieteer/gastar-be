const errorHandler = require('./errorHandler');
const validationMw = require('./validationMw');
const attachUserToRequest = require('./attachUserToRequest');
const requiresUser = require('./requiresUser');
const wrapExpressMiddleWare = require('./wrapExpressMiddleWare');
const logger = require('./logger');
const config = require('config');

module.exports = {
  errorHandler,
  validationMw,
  attachUserToRequest,
  requiresUser,
  wrapExpressMiddleWare,
  logger,
  requireAnyPermission: perm_name => (req, res, next) => {
    if (req.user && req.user.permissions.find(perm => perm.permission_name === perm_name)) {
      next();
    } else {
      res.status(400).json({ error: 'ACCESS_DENIED' });
    }
  },
  requireWorkflowSecret: (req, res, next) => {
    if (req.headers && req.headers['x-secret'] && req.headers['x-secret'] === config.get("WORKFLOW_SERVER_SECRET")) {
      next();
    } else {
      res.status(400).json({ error: 'ACCESS_DENIED' });
    }
  },
};
