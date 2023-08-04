const mongoose = require("mongoose");
const UserModel = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  // register user
  async registerUser(req, res) {
    const { fullName, email, password, phoneNumber } = req.body;

    try {
      if (!validator.isByteLength(password, [{ min: 8 }]))
        return res.status(403).json({
          message: "Password must be at least 8 characters long",
        });

      const emailUserCheck = await UserModel.findOne({ email: email });
      if (emailUserCheck)
        return res.status(403).json({
          message: "Email is already registered",
        });

      const fullNameUserCheck = await UserModel.findOne({ email: email });
      if (fullNameUserCheck)
        return res.status(403).json({
          message: "Fullname is already registered",
        });

      const newUser = await UserModel.create({
        fullName: fullName,
        email: email,
        password: await bcrypt.hash(password, 10),
        phoneNumber: phoneNumber,
      });

      const userJson = newUser.toAuthJSON();
      return res.status(201).json({
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
        return res.status(403).json({ message: "Email is not registered!!!" });

      const isMatchPw = await bcrypt.compare(password, user.password);
      if (!isMatchPw)
        return res.status(403).json({ message: "Wrong password!!!" });

      req.user = user;
      const userJson = user.toAuthJSON();

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
      const user = await UserModel.findById(req.user._id);
      const userJson = user.toAuthJSON();
      req.user = userJson;
      return res.status(200).json({ user: userJson });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
