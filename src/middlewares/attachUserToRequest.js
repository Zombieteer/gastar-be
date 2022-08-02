// TODO: do this in db.task

module.exports = (ioc) => async (req, _res, next) => {
  const { config } = ioc;
  let bearerToken = req.headers['authorization'];
  if (bearerToken) bearerToken = bearerToken.replace("Bearer ", "");
  const sessionId = req.cookies.wms_admin_sess || bearerToken;
  if (sessionId) {
    const { db } = ioc;
    const user = await db.oneOrNone(`
      select u.*, '${sessionId}' as session_id from
        users u
      where u.user_id = (select us.user_id from active_sessions us where us.id = $(token) and us.expires_at > now() and us.logged_out_at is null)
    `, { token: sessionId });
    req.user = user || {};
  } else if (req.headers['x-auth-token'] === config.get('SERVER_SECRET')) {
    const { db } = ioc;
    let user_id = 0;
    if (req.headers['x-user'] && typeof req.headers['x-user'] === 'string') {
      const xuser = JSON.parse(req.headers['x-user']);
      const { user_id: xuserid } = xuser;
      if (xuserid) {
        user_id = xuserid;
      }
    }
    const user = await db.one(`
      select * from users where user_id = $(user_id)
    `, { user_id });
    req.user = user;
  } else {
    req.user = {};
  }
  next();
};
