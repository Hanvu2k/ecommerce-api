const { Router } = require("express");
const router = Router();
const UserController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/me", verifyToken, UserController.getMe);

module.exports = router;
