const { Router } = require("express");
const router = Router();
const CategoryController = require("../controllers/category.controller");
const { verifyToken, verifyAdminOrCounselor } = require("../middleware/auth");

router.post(
  "/create",
  verifyAdminOrCounselor,
  CategoryController.createCategory
);
router.get(
  "/getCategory",
  verifyToken,
  verifyAdminOrCounselor,
  CategoryController.getCategories
);

module.exports = router;
