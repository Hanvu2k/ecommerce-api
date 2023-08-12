const { Router } = require("express");
const router = Router();
const ProductController = require("../controllers/product.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/getAllProducts", ProductController.getAllProducts);
router.get("/getProductsByCategory", ProductController.getProductsByCategory);
router.get("/getProductsTrending", ProductController.getTrendingProducts);
router.get(
  "/getRelatedProduct/:productId",
  ProductController.getRelatedProducts
);
router.get("/getProductById/:productId", ProductController.getProductById);
router.get(
  "/getProductByIdAdmin/:productId",
  verifyToken,
  verifyAdmin,
  ProductController.getProductByIdAdmin
);
router.get("/searchProduct", ProductController.searchProducts);
router.post(
  "/createProduct",
  verifyToken,
  verifyAdmin,
  ProductController.createProduct
);

router.delete(
  "/deleteProduct",
  verifyToken,
  verifyAdmin,
  ProductController.deleteProduct
);

router.patch(
  "/updateProduct",
  verifyToken,
  verifyAdmin,
  ProductController.updateProduct
);

module.exports = router;
