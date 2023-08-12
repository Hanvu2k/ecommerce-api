const { Router } = require("express");
const router = Router();
const CartController = require("../controllers/cart.controller");
const { verifyToken } = require("../middleware/auth");

router.post("/add", verifyToken, CartController.addProductToCart);
router.get("/getCart", verifyToken, CartController.getCartByUser);
router.delete("/delete", verifyToken, CartController.deleteProductInCart);
router.patch("/updateCart", verifyToken, CartController.updateChangeCart);

module.exports = router;
