const { Router } = require("express");
const router = Router();
const MessageController = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/auth");

router.post("/send", verifyToken, MessageController.sendMessage);
router.get("/getMessage", verifyToken, MessageController.getMessagesByRoom);

module.exports = router;
