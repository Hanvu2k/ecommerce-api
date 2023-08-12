const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  message: [
    {
      room: { type: String, required: true },
      author: { type: String, required: true },
      message: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Message", messageSchema);
