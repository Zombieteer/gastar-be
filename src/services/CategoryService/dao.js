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

  const getUserCategory = async (user_id, title) =>
    db.any(
      `select * from user_categories where user_id = $1::bigint and title ilike $2`,
      [user_id, title]
    );

  const addUserCategory = async (user_id, title, color, avatar) =>
    db.any(
      `insert into user_categories (user_id, title, color, avatar, created_at)
      values ($1::bigint, $2, $3, $4, now()) returning *`,
      [user_id, title, color, avatar]
    );

  const updateCategory = async (id, title, color, avatar) =>
    db.any(
      `update user_categories set title = $1, color = $2, avatar = $3, is_active = true
      where id = $4 returning *`,
      [title, color, avatar, id]
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
