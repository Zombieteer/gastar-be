module.exports = (db) => {
  const getActiveUserByPhone = (phone_number, t) =>
    t.oneOrNone(
      `
    select * from users where phone_number = $1 and is_active = true for update
  `,
      phone_number
    );

  // const getActiveUserByUserId = (user_id, t) =>
  //   t.oneOrNone(
  //     `
  //   select * from sellers.users where user_id = $1 and is_active = true for update
  // `,
  //     [user_id]
  //   );

  // const getRoleIdByRoleName = (role_name, t) =>
  //   t.oneOrNone(
  //     `
  //   select * from sellers.roles where lower(role_name) = lower($1)
  // `,
  //     [role_name]
  //   );

  // const getAllPermissions = (t) =>
  //   t.any(`
  //   select permission_name from sellers.permissions
  // `);

  // const getSellerDetails = (seller_id) =>
  //   db.oneOrNone(
  //     `
  //   select * from suppliers where supplier_id=$1 limit 1;
  // `,
  //     [seller_id]
  //   );

  // const getSellerAccounts = (seller_id) =>
  //   db.any(
  //     `
  //   select * from seller_bank_accounts where seller_id = $1;
  // `,
  //     [seller_id]
  //   );

  // const getSellerBillingAddresses = (seller_id) =>
  //   db.oneOrNone(
  //     `
  //   select * from supplier_addresses where supplier_id=$1 and type='billing' and is_active = true limit 1;
  // `,
  //     [seller_id]
  //   );

  // const getSellerShippingAddresses = (seller_id) =>
  //   db.oneOrNone(
  //     `
  //   select * from supplier_addresses where supplier_id=$1 and type='shipping' and is_active = true limit 1;
  // `,
  //     [seller_id]
  //   );

  // const getSellerUserDetails = (user_id) =>
  //   db.oneOrNone(
  //     `
  //   select * from sellers.users where user_id = $1 limit 1;
  // `,
  //     [user_id]
  //   );

  // const getSellerSettings = (seller_id) =>
  //   db.oneOrNone(
  //     `
  //   select * from sellers.seller_setting where seller_id = $1 limit 1;
  // `,
  //     [seller_id]
  //   );

  const insertUser = (phone_number, is_active = true, t) =>
    t.oneOrNone(
      `
    insert into users
    (phone_number, is_active)
    values
    ($1, $2)
    on conflict (phone_number)
    do update set
      is_active = excluded.is_active
    returning *
  `,
      [phone_number, is_active]
    );

  // const insertUserRole = (user_id, role_id, t) =>
  //   t.none(
  //     `insert into sellers.user_roles (user_id, role_id) values($1, $2) on conflict(user_id, role_id) do nothing`,
  //     [user_id, role_id]
  //   );

  const createUser = (phone_number, is_active) =>
    db.tx(async (t) => {
      const userExists = await getActiveUserByPhone(phone_number, t);

      if (userExists) return userExists;

      const user = await insertUser(phone_number, is_active, t);

      return user;
    });

  // const updateUser = (
  //   seller_id,
  //   user_id,
  //   name_input,
  //   email_id_input,
  //   is_email_subscribed_input,
  //   is_primary_input,
  //   is_active_input
  // ) =>
  //   db.tx(async (t) => {
  //     const activeUser = await getActiveUserByUserId(user_id, t);

  //     if (!activeUser || activeUser.seller_id !== seller_id) {
  //       throw new Error("USER_NOT_FOUND");
  //     }

  //     const name = name_input ? name_input : activeUser.name;
  //     const email_id = email_id_input ? email_id_input : activeUser.email_id;
  //     const is_email_subscribed = is_email_subscribed_input
  //       ? is_email_subscribed_input
  //       : activeUser.is_email_subscribed;
  //     const is_primary =
  //       typeof is_primary_input === "boolean"
  //         ? is_primary_input
  //         : activeUser.is_primary;
  //     const is_active =
  //       typeof is_active_input === "boolean"
  //         ? is_active_input
  //         : activeUser.is_active;

  //     const user = await t.none(
  //       `
  //     update sellers.users set
  //     name = $1, email_id = $2, is_email_subscribed = $3, is_primary = $4, is_active = $5
  //     where user_id = $6 and seller_id = $7 and is_active = true
  //   `,
  //       [
  //         name,
  //         email_id,
  //         is_email_subscribed,
  //         is_primary,
  //         is_active,
  //         user_id,
  //         seller_id,
  //       ]
  //     );

  //     // if (is_primary)
  //     //   await insertUserRole(user_id, 1, t);

  //     return user;
  //   });

  // const deleteUser = async (user_id, seller_id) => {
  //   await db.none(
  //     `
  //   update sellers.users set is_active = false where seller_id = $1 and user_id = $2
  // `,
  //     [seller_id, user_id]
  //   );
  //   await db.none(`delete from sellers.user_roles where user_id = $1`, [
  //     user_id,
  //   ]);
  // };

  // const addRoleToUser = async (user_id, seller_id, role_name) => {
  //   await db.tx(async (t) => {
  //     const user = await getActiveUserByUserId(user_id, t);
  //     const role = await getRoleIdByRoleName(role_name, t);

  //     if (!user || user.seller_id !== seller_id) {
  //       throw new Error("USER_NOT_FOUND");
  //     }

  //     if (!role) {
  //       throw new Error("ROLE_NOT_FOUND");
  //     }

  //     await t.none(
  //       `
  //       insert into sellers.user_roles(user_id, role_id) values ($2, $1)
  //     `,
  //       [role.role_id, user_id]
  //     );
  //   });
  // };

  // const removeRoleFromUser = async (user_id, seller_id, role_name) => {
  //   await db.tx(async (t) => {
  //     const user = await getActiveUserByUserId(user_id, t);
  //     const role = await getRoleIdByRoleName(role_name, t);

  //     if (!user || user.seller_id !== seller_id) {
  //       throw new Error("USER_NOT_FOUND");
  //     }

  //     if (!role) {
  //       throw new Error("ROLE_NOT_FOUND");
  //     }

  //     await t.none(
  //       `
  //       delete from sellers.user_roles where user_id = $2 and role_id = $1
  //     `,
  //       [role.role_id, user_id]
  //     );
  //   });
  // };

  // const sellerProfileDetails = async (user_id, seller_id) => {
  //   const [
  //     seller_details,
  //     seller_accounts,
  //     billing_details,
  //     shipping_details,
  //     seller_user_details,
  //     seller_setting,
  //   ] = await Promise.all([
  //     getSellerDetails(seller_id),
  //     getSellerAccounts(seller_id),
  //     getSellerBillingAddresses(seller_id),
  //     getSellerShippingAddresses(seller_id),
  //     getSellerUserDetails(user_id),
  //     getSellerSettings(seller_id),
  //   ]);
  //   return {
  //     seller_details,
  //     seller_accounts,
  //     billing_details,
  //     shipping_details,
  //     seller_user_details,
  //     seller_setting,
  //   };
  // };

  return {
    // deleteUser,
    createUser,
    // updateUser,
    // addRoleToUser,
    // removeRoleFromUser,
    // sellerProfileDetails,
  };
};
