const CategoryModel = require("../models/Category");

class CategoryController {
  //   create a new category
  async createCategory(req, res) {
    const { name: category } = req.body;

    try {
      const isExistCategory = await CategoryModel.findOne({ name: category });

      if (isExistCategory) {
        return res.status(403).json({ error: "Category already exist!!" });
      }

      const newCategory = await CategoryModel.create({ name: category });

      return res.status(201).json({
        success: true,
        message: "Category created successfully!",
        category: newCategory,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get all categories
  async getCategories(_req, res) {
    try {
      const categories = await CategoryModel.find();

      if (categories.length === 0)
        return res
          .status(403)
          .json({ success: false, message: "Can't get categories" });

      return res.status(200).json({
        success: true,
        message: "Get categories successfully!",
        category: categories,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
