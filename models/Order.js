const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, require: true },
    products: [
      {
        _id: 0,
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    address: { type: String, maxlength: 100, required: true },
    email: { type: String, maxlength: 100, required: true },
    phoneNumber: { type: Number, maxlength: 11, required: true },
    status: {
      type: String,
      enum: ["wfp", "pd"],
      default: "wfp",
      required: true,
    },
    delivery: {
      type: String,
      enum: ["wfprg"],
      default: "wfprg",
      required: true,
    },
    total: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
