const { Router } = require("express");
const router = Router();
const OrderController = require("../controllers/order.controller");
const { verifyToken, verifyAdminOrCounselor } = require("../middleware/auth");

router.post("/create", verifyToken, OrderController.createOrder);
router.get("/getOrder", verifyToken, OrderController.getOrder);
router.get(
  "/getAllOrder",
  verifyToken,
  verifyAdminOrCounselor,
  OrderController.getAllOrders
);
router.get("/getOrderDetail", verifyToken, OrderController.getOrderDetailsById);

module.exports = router;
