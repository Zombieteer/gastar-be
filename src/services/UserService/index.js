class UserService {
  constructor(db) {
    this.db = db;
    this.dao = require("./dao")(db);
  }

  async createUser(phone_number, is_active) {
    return await this.dao.createUser(phone_number, is_active || true);
  }

  // updateUser(
  //   seller_id,
  //   user_id,
  //   name_input,
  //   email_id_input,
  //   is_email_subscribed_input,
  //   is_primary_input,
  //   is_active_input
  // ) {
  //   return this.dao.updateUser(
  //     seller_id,
  //     user_id,
  //     name_input,
  //     email_id_input,
  //     is_email_subscribed_input,
  //     is_primary_input,
  //     is_active_input
  //   );
  // }

  // async deleteUser(user_id, seller_id) {
  //   await this.dao.deleteUser(user_id, seller_id);
  // }

  // async addRole(user_id, seller_id, role_name) {
  //   await this.dao.addRoleToUser(user_id, seller_id, role_name);
  // }

  // async removeRole(user_id, seller_id, role_name) {
  //   await this.dao.removeRoleFromUser(user_id, seller_id, role_name);
  // }

  // sellerProfileDetails(user_id, seller_id) {
  //   return this.dao.sellerProfileDetails(user_id, seller_id);
  // }
}

module.exports = UserService;
