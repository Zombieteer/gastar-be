module.exports = (db) => {
  const getUserCategories = async (user_id) =>
    db.any(
      `select * from user_categories where user_id = $1::bigint and is_active = true`,
      [user_id]
    );

  const getInactiveCat = (user_id) =>
    db.oneOrNone(
      `select * from user_categories where user_id = $1::bigint and is_active = false limit 1`,
      [user_id]
    );

  const getUserCategory = async (user_id, type, title) =>
    db.any(
      `select * from user_categories where user_id = $1::bigint and type = $2 and title ilike $3`,
      [user_id, type, title]
    );

  const addUserCategory = async (user_id, type, title, color, avatar) =>
    db.any(
      `insert into user_categories (user_id, type, title, color, avatar, created_at)
      values ($1::bigint, $2, $3, $4, $5, now()) returning *`,
      [user_id, type, title, color, avatar]
    );

  const updateCategory = async (id, type, title, color, avatar) =>
    db.any(
      `update user_categories set type = $1, title = $2, color = $3, avatar = $4, is_active = true
      where id = $5 returning *`,
      [type, title, color, avatar, id]
    );

  const deleteCategory = (id) =>
    db.none(`update user_categories set is_active = false where id = $1`, [id]);

  return {
    getUserCategories,
    getInactiveCat,
    getUserCategory,
    addUserCategory,
    updateCategory,
    deleteCategory,
  };
};
