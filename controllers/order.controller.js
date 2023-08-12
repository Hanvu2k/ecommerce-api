const UserModel = require("../models/User");
const OrderModel = require("../models/Order");
const CartModel = require("../models/Cart");
const validator = require("validator");
const { mailOptions, transporter } = require("../utils/mailOption");

class OrderController {
  // create a new order
  async createOrder(req, res) {
    const { name, email, phoneNumber, address } = req.body;

    try {
      if (!validator.isEmail(email))
        return res
          .status(403)
          .json({ success: false, message: "Invalid email address" });

      if (!validator.isMobilePhone(phoneNumber, ["vi-VN"]))
        return res
          .status(403)
          .json({ success: false, message: "Invalid phone number" });

      const userOrder = await UserModel.findOne({ _id: req.session.user._id });

      if (!userOrder)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const userCart = await CartModel.findOne({
        user: userOrder._id,
      });

      if (!userCart)
        return res
          .status(403)
          .json({ success: false, message: "You don't have any products" });

      const newOrder = await OrderModel.create({
        user: userOrder._id,
        name: name,
        products: userCart.products,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        total: userCart.total,
      });

      if (!newOrder)
        return res
          .status(403)
          .json({ success: false, message: "Create order failed" });

      await CartModel.findOneAndUpdate(
        { user: req.session.user._id },
        { products: [], total: 0 },
        { new: true }
      );

      const orderDetail = await OrderModel.findOne({
        _id: newOrder._id,
      }).populate("products.product_id");

      const mail = mailOptions(orderDetail);

      await transporter.sendMail(mail);

      return res.status(201).json({
        success: true,
        message: "Create order successfully",
        order: newOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // get order
  async getOrder(req, res) {
    try {
      const order = await OrderModel.find({
        user: req.session.user._id,
      }).populate("products.product_id");

      if (!order)
        return res
          .status(403)
          .json({ success: false, message: "Order's not exist" });

      const formarOrder = order.map((order) => {
        return {
          id: order._id,
          user: order.user,
          email: order.email,
          name: order.name,
          phoneNumber: order.phoneNumber,
          total: order.total,
          address: order.address,
          delivery: order.delivery,
          status: order.status,
          createdAt: order.createdAt.toLocaleString("en-US", {
            timeZone: "Asia/Ho_Chi_Minh", // Set the appropriate time zone
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get order successfully",
        order: formarOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOrderDetailsById(req, res) {
    const { orderId } = req.query;
    try {
      const userOrder = await UserModel.findById(req.session.user._id);

      if (!userOrder)
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });

      const orderDetail = await OrderModel.findOne({ _id: orderId }).populate(
        "products.product_id"
      );

      if (!orderDetail)
        return res
          .status(403)
          .json({ success: false, message: "Order not exist!" });

      return res.status(200).json({
        success: true,
        message: "Get order details successfully",
        orderDetail: orderDetail,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // getAllorders
  async getAllOrders(_req, res) {
    try {
      const order = await OrderModel.find();

      if (order.length === 0)
        return res
          .status(403)
          .json({ success: false, message: "Cannot get all orders" });

      const formarOrder = order.map((order) => {
        return {
          id: order._id,
          user: order.user,
          email: order.email,
          name: order.name,
          phoneNumber: order.phoneNumber,
          total: order.total,
          address: order.address,
          delivery: order.delivery,
          status: order.status,
          createdAt: order.createdAt.toLocaleString("en-US", {
            timeZone: "Asia/Ho_Chi_Minh", // Set the appropriate time zone
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get all orders successfully",
        order: formarOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
