const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 50,
      unique: true,
    },
    price: {
      type: Number,
      require: true,
    },
    photos: [{ type: String, require: true, max: 255 }],
    short_desc: {
      type: String,
      require: true,
      min: 3,
      max: 50,
    },
    long_desc: {
      type: String,
      require: true,
      min: 3,
      max: 255,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
