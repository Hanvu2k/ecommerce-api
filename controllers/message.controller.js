const UserModel = require("../models/User");
const MessageModel = require("../models/Session");

class MessageController {
  async sendMessage(req, res) {
    const { message } = req.body;

    try {
      const user = await UserModel.findById(req.session.user._id);

      if (!user)
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });

      const messages = await MessageModel.findOne({ user: user._id });

      messages.message = message;

      await messages.save();
      // // Emit the new message to the room
      // io.getIO().to(room).emit("receive_message", newMessage);

      return res.status(201).json({
        success: true,
        message: "Message save successfully.",
        messages: messages,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getMessagesByRoom(req, res) {
    try {
      const user = await UserModel.findById(req.session.user);

      if (!user)
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });

      const messages = await MessageModel.findOne({ user: user._id });

      return res.status(200).json({ success: true, messages });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new MessageController();
