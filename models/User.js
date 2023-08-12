require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
      min: 3,
      max: 50,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 8,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    role: {
      type: Number,
      ref: "Role",
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    role: this.role,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model("User", UserSchema);
