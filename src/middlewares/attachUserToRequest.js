// TODO: do this in db.task

module.exports = (ioc) => async (req, _res, next) => {
  const { config } = ioc;
  let bearerToken = req.headers['authorization'];
  if (bearerToken) bearerToken = bearerToken.replace("Bearer ", "");
  const sessionId = req.cookies.wms_admin_sess || bearerToken;
  if (sessionId) {
    const { db } = ioc;
    const user = await db.oneOrNone(`
      select u.* from
        users u
      where u.user_id = (select us.user_id from user_sessions us where us.id = $(token) and us.expires_at > now() and us.logged_out_at is null)
    `, { token: sessionId });
    if (user && user.user_id) {
      const permissions = await db.manyOrNone(`
        select
          distinct p.permission_name
        from
          permissions p
        inner join role_permissions rp
          on rp.permission_id = p.permission_id
        inner join user_roles ur on
          rp.role_id = ur.role_id and
        ur.user_id = $(user_id)
      `, user);
      const userWarehouses = await db.any(`
      select
        w.warehouse_name from warehouses w
        INNER JOIN admin_warehouses aw
        on w.warehouse_name = aw.warehouse_name
      where user_id = $(user_id) and
      is_deleted = false
      `, user);

      if (user.default_warehouse) {
        const { gst_number: default_warehouse_gst_number } = await db.one(`select gst_number from warehouses where warehouse_name = $1`, [user.default_warehouse]);
        user.default_warehouse_gst_number = default_warehouse_gst_number;
      }

      user.warehouses = userWarehouses.reduce((whs, c) => [...whs, c.warehouse_name], []);
      user.permissions = permissions;
    }
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
    const xUser = await db.one(`
      select * from users where user_id = $(user_id)
    `, { user_id });
    const permissions = await db.manyOrNone(`
        select
          distinct p.permission_name
        from
          permissions p
        inner join role_permissions rp
          on rp.permission_id = p.permission_id
        inner join user_roles ur on
          rp.role_id = ur.role_id and
        ur.user_id = $(user_id)
      `, { user_id });
    const userWarehouses = await db.any(`
      select
        w.warehouse_name from warehouses w
        INNER JOIN admin_warehouses aw
        on w.warehouse_name = aw.warehouse_name
      where user_id = $(user_id) and
      is_deleted = false
    `, { user_id });
    const user = {
      ...xUser,
      permissions,
    };

    if (user.default_warehouse) {
      const { gst_number: default_warehouse_gst_number } = await db.one(`select gst_number from warehouses where warehouse_name = $1`, [user.default_warehouse]);
      user.default_warehouse_gst_number = default_warehouse_gst_number;
    }

    user.warehouses = userWarehouses.reduce((whs, c) => [...whs, c.warehouse_name], []);
    req.user = user;
  } else {
    req.user = {};
  }
  next();
};
