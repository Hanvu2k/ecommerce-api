const UserModel = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const CartModel = require("../models/Cart");
const MessageModel = require("../models/Session");
const jwt = require("jsonwebtoken");

class UserController {
  // register user
  async registerUser(req, res) {
    const { fullName, email, password, phoneNumber } = req.body;

    try {
      const fullNameUserCheck = await UserModel.findOne({ fullName: fullName });
      if (fullNameUserCheck)
        return res.status(403).json({
          success: false,
          message: "Fullname is already in used",
        });

      const emailUserCheck = await UserModel.findOne({ email: email });
      if (emailUserCheck)
        return res.status(403).json({
          success: false,
          message: "Email is already registered",
        });

      if (!validator.isByteLength(password, [{ min: 8 }]))
        return res.status(403).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });

      const newUser = await UserModel.create({
        fullName: fullName,
        email: email,
        password: await bcrypt.hash(password, 10),
        phoneNumber: phoneNumber,
      });

      await CartModel.create({
        user: newUser._id,
        products: [],
        total: 0,
      });

      await MessageModel.create({
        user: newUser._id,
        messages: [],
      });

      const userJson = newUser.toAuthJSON();
      req.session.user = userJson;

      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        user: userJson,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // login
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email: email });

      const emailUser = await UserModel.findOne({ email: email });
      if (!emailUser)
        return res.status(403).json({
          success: false,
          message: "Email is not registered!!!",
        });

      const isMatchPw = await bcrypt.compare(password, user.password);
      if (!isMatchPw)
        return res.status(403).json({
          success: false,
          message: "Wrong password!!!",
        });

      const userJson = user.toAuthJSON();
      req.session.user = userJson;

      return res
        .status(200)
        .json({ success: true, message: "Login success!", user: userJson });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get user infor
  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.session.user._id);
      if (!user)
        return res
          .status(403)
          .json({ success: false, message: "Can not get user" });

      const userJson = user.toAuthJSON();
      req.session.user = userJson;

      if (req.session.user)
        return res.status(200).json({ success: true, user: req.session.user });

      return res.status(200).json({ success: false, message: "Has no user" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // admin login
  async loginAdmin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email: email });

      const emailUser = await UserModel.findOne({ email: email });
      if (!emailUser)
        return res.status(403).json({
          success: false,
          message: "Email is not registered!!!",
        });

      const isMatchPw = await bcrypt.compare(password, user.password);
      if (!isMatchPw)
        return res.status(403).json({
          success: false,
          message: "Wrong password!!!",
        });

      if (user.role === 0)
        return res.status(403).json({
          success: false,
          message: "You is not allowed to use this website!",
        });

      const userJson = user.toAuthJSON();
      req.session.user = userJson;

      return res
        .status(200)
        .json({ success: true, message: "Login success!", user: userJson });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // getAllUsers
  async getAllUsers(_req, res) {
    try {
      const users = await UserModel.find();

      if (users.length === 0)
        return res
          .status(403)
          .json({ success: false, message: "Can't get all user!" });

      return res
        .status(200)
        .json({ success: true, message: "All users", users: users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get user by id
  async getUserById(req, res) {
    const { userId } = req.query;
    try {
      const user = await UserModel.findOne({ _id: userId });

      if (user)
        return res
          .status(200)
          .json({ success: true, message: "get user success", user: user });

      return res
        .status(403)
        .json({ success: false, message: "can't get user!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // get user by id
  async updateRole(req, res) {
    const { userId, role } = req.body;
    try {
      const user = await UserModel.findOne({ _id: req.session.user._id });

      if (!user)
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });

      const userEdit = await UserModel.findOneAndUpdate(
        { _id: userId },
        { role: role }
      );

      if (userEdit)
        return res
          .status(200)
          .json({ success: true, message: "Updated user's role successfully" });

      return res.status(403).json({ success: false, message: "Update faild" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // logout
  async logout(req, res) {
    try {
      req.session.destroy();
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
