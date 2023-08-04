const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
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
  total: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", CartSchema);
