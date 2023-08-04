const mongoose = require("mongoose");
const UserModel = require("../models/User");
const ProductModel = require("../models/Product");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

class ProductController {
  // get all products
  async getAllProducts(_req, res) {
    try {
      const products = await ProductModel.find().populate("category", "name");

      if (!products)
        return res
          .status(422)
          .json({ success: false, message: "Products not found!!" });

      const formatedProducts = products.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get products success!",
        products: formatedProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get product buy category
  async getProductsByCategory(req, res) {
    const { category } = req.query;

    try {
      const products = await ProductModel.find().populate("category", "name");

      if (!products)
        return res
          .status(422)
          .json({ success: false, message: "Products not found!!" });

      if (category === "All") {
        const formatedProducts = products.map((product) => {
          return {
            _id: product._id,
            category: product.category.name,
            long_desc: product.long_desc,
            img: product.photos[0],
            name: product.name,
            short_desc: product.short_desc,
            price: product.price,
          };
        });

        return res.status(200).json({
          success: true,
          message: "Get products success!",
          products: formatedProducts,
        });
      }

      const suitableProduct = products.filter(
        (product) => product.category.name === category
      );
      const formatedProducts = suitableProduct.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          img: product.photos[0],
          name: product.name,
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get products success!",
        products: formatedProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //   get product by id
  async getProductById(req, res) {
    const { productId } = req.params;

    try {
      const product = await ProductModel.findOne({ _id: productId }).populate(
        "category",
        "name"
      );

      if (!product)
        return res
          .status(422)
          .json({ success: false, message: "Product not found!!" });

      const formatedProduct = {
        _id: product._id,
        category: product.category.name,
        long_desc: product.long_desc,
        name: product.name,
        short_desc: product.short_desc,
        price: product.price,
        photos: product.photos,
      };

      return res.status(200).json({ success: true, product: formatedProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get top trending products
  async getTrendingProducts(_req, res) {
    try {
      const products = await ProductModel.find()
        .populate("category", "name")
        .limit(8);

      if (!products)
        return res
          .status(422)
          .json({ success: false, message: "Products not found!!" });

      const formatedProducts = products.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get products success!",
        products: formatedProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get related products
  async getRelatedProducts(req, res) {
    const { productId } = req.params;
    try {
      const product = await ProductModel.findOne({ _id: productId });
      if (!product)
        return res.status(403).json({ message: "Product not found" });

      const products = await ProductModel.find({
        category: product.category,
      }).populate("category", "name");

      if (!products)
        return res.status(404).json({ message: "Product not found" });

      const suitableProduct = products.filter((product) => {
        return product._id.toString() !== productId.toString();
      });

      const formatedProduct = suitableProduct.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get related products success",
        products: formatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // search products
  async searchProducts(req, res) {
    const { searchTerm } = req.query;
    try {
      const regex = new RegExp(searchTerm, "i");

      const foundProducts = await ProductModel.find({ name: regex });

      if (foundProducts.length === 0) {
        return res
          .status(422)
          .json({ success: false, message: "No product were found!" });
      }

      const formatedProduct = foundProducts.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Search products success",
        products: formatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
