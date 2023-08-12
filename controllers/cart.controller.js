const UserModel = require("../models/User");
const ProductModel = require("../models/Product");
const CartModel = require("../models/Cart");

class CartController {
  //   create a cart
  async addProductToCart(req, res) {
    const user = req.session.user;
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

      const cart = await CartModel.findOne({
        user: currUser._id,
      });

      if (!cart) {
        res.status(403).json({ success: false, message: "Cart not exist " });
      }

      const indexProduct = cart?.products?.findIndex(
        (product) => product.product_id.toString() === addProduct._id.toString()
      );

      if (indexProduct === -1) {
        cart.products.push({
          product_id: addProduct._id,
          quantity: quantity,
        });
      } else {
        cart.products[indexProduct].quantity += quantity;
      }

      await cart.save();

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
          productId: product.product_id._id,
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
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //   get cart
  async getCartByUser(req, res) {
    try {
      const userCart = await CartModel.findOne({
        user: req.session.user._id,
      }).populate("products.product_id");

      if (!userCart)
        return res.status(403).json({
          success: false,
          message: "User have no item in cart!",
        });

      const formartProduct = userCart.products.map((product) => {
        return {
          productId: product.product_id._id,
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
      const userCart = await CartModel.findOne({ user: req.session.user._id });

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
          product.product_id.toString() === deleteProduct._id.toString()
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
            productId: product.product_id._id,
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
  async updateChangeCart(req, res) {
    const cart = req.body;
    cart.user = req.session.user._id;

    try {
      cart.products.filter((product) => product.quantity !== 0);

      const productsFormat = cart.products.map((product) => {
        return {
          product_id: product.productId,
          quantity: product.quantity,
        };
      });

      cart.products = productsFormat;

      const userCart = await CartModel.findOne({ user: req.session.user._id });
      if (!userCart)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const updatedCart = await CartModel.findOneAndUpdate(
        { _id: userCart._id },
        cart,
        { new: true }
      ).populate("products.product_id");

      if (updatedCart) {
        const formartProduct = updatedCart.products.map((product) => {
          return {
            productId: product.product_id._id,
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
          total: updatedCart.total,
        };

        return res.status(200).json({
          success: true,
          message: "Update cart successfully",
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
