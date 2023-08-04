const mongoose = require("mongoose");
const UserModel = require("../models/User");
const ProductModel = require("../models/Product");
const CategoryModel = require("../models/Category");
const CartModel = require("../models/Cart");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class CartController {
  //   create a cart
  async addProductToCart(req, res) {
    const user = req.user;
    const { productId, quantity } = req.body;

    try {
      const currUser = await UserModel.findOne({ _id: user._id });

      if (!currUser)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized " });

      const addProduct = await ProductModel.findOne({ _id: productId });

      if (!addProduct)
        return res
          .status(403)
          .json({ success: false, message: "Product not found " });

      const existCart = await CartModel.findOne({
        user: currUser._id,
      });

      //   exist cart
      if (existCart) {
        const indexProduct = existCart?.products?.findIndex(
          (product) =>
            product.product_id.toString() === addProduct._id.toString()
        );

        if (indexProduct === -1) {
          existCart.products.push({
            product_id: addProduct._id,
            quantity: quantity,
          });
        } else {
          existCart.products[indexProduct].quantity += quantity;
        }

        await existCart.save();

        const userCart = await CartModel.findOne({
          user: currUser._id,
        }).populate("products.product_id");

        const totalPrice = userCart.products.reduce(
          (sum, pro) => sum + pro.quantity * pro.product_id.price,
          0
        );

        userCart.total = totalPrice;

        await userCart.save();

        const formartProduct = userCart.products.map((product) => {
          return {
            product_id: product.product_id._id,
            name: product.product_id.name,
            img: product.product_id.photos[0],
            price: product.product_id.price,
            quantity: product.quantity,
            total: product.product_id.price * product.quantity,
          };
        });

        const formartCart = {
          _id: userCart._id,
          products: formartProduct,
          total: userCart.total,
        };

        return res.status(201).json({
          success: true,
          message: "Add to cart success",
          cart: formartCart,
        });
      }

      //   new cart
      const newCart = await CartModel.create({
        user: currUser._id,
        products: [
          {
            product_id: addProduct._id,
            quantity: quantity,
          },
        ],
      });

      const crrCart = await CartModel.findOne({ _id: newCart._id }).populate(
        "products.product_id"
      );

      const totalPrice = crrCart.products.reduce(
        (sum, pro) => sum + pro.quantity * pro.product_id.price,
        0
      );

      crrCart.total = totalPrice;
      await crrCart.save();

      const formartProduct = crrCart.products.map((product) => {
        return {
          product_id: product.product_id._id,
          name: product.product_id.name,
          img: product.product_id.photos[0],
          price: product.product_id.price,
          quantity: product.quantity,
          total: product.product_id.price * product.quantity,
        };
      });

      const formartCart = {
        _id: currUser._id,
        products: formartProduct,
        total: crrCart.total,
      };

      return res.status(201).json({
        success: true,
        message: "Cart created successfully",
        cart: formartCart,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //   get cart
  async getCartByUser(req, res) {
    try {
      const userCart = await CartModel.findOne({ user: req.user }).populate(
        "products.product_id"
      );
      if (!userCart)
        return res.status(404).json({
          success: false,
          message: "User have no cart!",
        });

      const formartProduct = userCart.products.map((product) => {
        return {
          product_id: product.product_id._id,
          name: product.product_id.name,
          img: product.product_id.photos[0],
          price: product.product_id.price,
          quantity: product.quantity,
          total: product.product_id.price * product.quantity,
        };
      });

      const formartCart = {
        _id: userCart._id,
        products: formartProduct,
        total: userCart.total,
      };

      return res.status(200).json({
        success: true,
        message: "Get cart successfully!",
        cart: formartCart,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // delete product
  async deleteProductInCart(req, res) {
    const { productId } = req.query;
    try {
      const userCart = await CartModel.findOne({ user: req.user._id });

      if (!userCart)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const deleteProduct = await ProductModel.findOne({ _id: productId });
      if (!deleteProduct)
        return res
          .status(403)
          .json({ success: false, message: "Product not found" });

      const indexProduct = userCart.products.findIndex(
        (product) =>
          product.product_id.toString() === updateProduct._id.toString()
      );

      if (indexProduct === -1)
        return res
          .status(403)
          .json({ success: false, message: "Car don't have this product" });

      const updateCart = await CartModel.findByIdAndUpdate(
        userCart._id,
        {
          $pull: { products: { product_id: deleteProduct._id } },
        },
        { new: true }
      )
        .populate("products.product_id")
        .exec();

      if (updateCart) {
        const totalPrice = updateCart.products.reduce(
          (sum, pro) => sum + pro.quantity * pro.product_id.price,
          0
        );

        updateCart.total = totalPrice;
        await updateCart.save();

        const formartProduct = updateCart.products.map((product) => {
          return {
            product_id: product.product_id._id,
            name: product.product_id.name,
            img: product.product_id.photos[0],
            price: product.product_id.price,
            quantity: product.quantity,
            total: product.product_id.price * product.quantity,
          };
        });

        const formartCart = {
          _id: userCart._id,
          products: formartProduct,
          total: totalPrice,
        };

        return res.status(200).json({
          success: true,
          message: "Delete product successfully",
          cart: formartCart,
        });
      }

      return res
        .status(403)
        .json({ success: false, message: "Cart not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //   update quantity product in cart
  async updateQuantityProductCart(req, res) {
    const { productId, incre } = req.query;

    const updateQuantity = incre === true ? 1 : -1;
    try {
      const userCart = await CartModel.findOne({ user: req.user._id });
      if (!userCart)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const updateProduct = await ProductModel.findOne({ _id: productId });
      if (!updateProduct)
        return res
          .status(403)
          .json({ success: false, message: "Product not found" });

      const indexProduct = userCart.products.findIndex(
        (product) =>
          product.product_id.toString() === updateProduct._id.toString()
      );

      if (indexProduct === -1)
        return res
          .status(403)
          .json({ success: false, message: "Cart don't have this product" });

      const updatedCart = await CartModel.findByIdAndUpdate(
        userCart._id,
        {
          $inc: { "products.$[product].quantity": updateQuantity },
          $set: {
            "products.$[product].total": {
              $multiply: [
                "$products.$[product].price",
                "$products.$[product].quantity",
              ],
            },
          },
        },
        {
          arrayFilters: [{ "product.product_id": updateProduct._id }],
          new: true,
        }
      )
        .populate("products.product_id")
        .exec();

      if (updatedCart) {
        if (updatedCart.products[indexProduct].quantity === 0) {
          updatedCart.products.splice(indexProduct, 1);
        }

        const totalPrice = updatedCart.products.reduce(
          (sum, pro) => sum + pro.quantity * pro.product_id.price,
          0
        );

        updatedCart.total = totalPrice;
        await updatedCart.save();

        const formartProduct = updatedCart.products.map((product) => {
          return {
            product_id: product.product_id._id,
            name: product.product_id.name,
            img: product.product_id.photos[0],
            price: product.product_id.price,
            quantity: product.quantity,
            total: product.product_id.price * product.quantity,
          };
        });

        const formartCart = {
          _id: userCart._id,
          products: formartProduct,
          total: totalPrice,
        };

        return res.status(200).json({
          success: true,
          message: "Update quantity successfully",
          cart: formartCart,
        });
      }

      return res
        .status(403)
        .json({ success: false, message: "Cart not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
