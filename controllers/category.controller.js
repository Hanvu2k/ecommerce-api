const mongoose = require("mongoose");
const UserModel = require("../models/User");
const ProductModel = require("../models/Product");
const CategoryModel = require("../models/Category");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
}

module.exports = new CategoryController();
