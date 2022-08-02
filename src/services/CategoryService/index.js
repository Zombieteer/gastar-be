class CategoryService {
  constructor(db) {
    this.db = db;
    this.dao = require("./dao")(db);
  }

  async getUserCategories(user_id) {
    const categories = await this.dao.getUserCategories(user_id);
    return categories || [];
  }

  async addCategory(user_id, title, color, avatar) {
    const resp = await this.dao.getUserCategory(user_id, title);

    if (resp.length) {
      throw new Error("CATEGORY_ALREADY_EXISTS");
    }

    const inactivCat = await this.dao.getInactiveCat(user_id);

    if (!inactivCat) {
      const category = await this.dao.addUserCategory(
        user_id,
        title,
        color,
        avatar
      );
      return category;
    }

    const category = await this.dao.updateCategory(
      inactivCat.id,
      title,
      color,
      avatar
    );
    return category;
  }

  async updateCategory(id, user_id, title, color, avatar) {
    const resp = await this.dao.getUserCategory(user_id, title);

    if (resp.length) {
      throw new Error("CATEGORY_ALREADY_EXISTS");
    }

    const category = await this.dao.updateCategory(id, title, color, avatar);
    return category;
  }

  async deleteCategory(id) {
    await this.dao.deleteCategory(id);
    return;
  }
}

module.exports = CategoryService;
