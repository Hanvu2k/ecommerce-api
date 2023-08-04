const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema({
  level: { type: Number, require: true, unique: true, alias: "_id" },
  name: { type: String },
});

module.exports = mongoose.model("Role", RoleSchema);
