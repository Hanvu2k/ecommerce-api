const { Router } = require("express");
const router = Router();
const UserController = require("../controllers/user.controller");
const {
  verifyToken,
  verifyAdmin,
  verifyAdminOrCounselor,
} = require("../middleware/auth");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post("/loginAdmin", UserController.loginAdmin);
router.get("/me", verifyToken, UserController.getMe);
router.get(
  "/getUserById",
  verifyToken,
  verifyAdmin,
  UserController.getUserById
);
router.patch(
  "/updateRole",
  verifyToken,
  verifyAdmin,
  UserController.updateRole
);
router.get(
  "/allUser",
  verifyToken,
  verifyAdminOrCounselor,
  UserController.getAllUsers
);
router.post("/logout", UserController.logout);

module.exports = router;
