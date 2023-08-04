const { Router } = require("express");
const router = Router();
const ProductController = require("../controllers/product.controller");

router.get("/getAllProducts", ProductController.getAllProducts);
router.get("/getProductsByCategory", ProductController.getProductsByCategory);
router.get("/getProductsTrending", ProductController.getTrendingProducts);
router.get(
  "/getRelatedProduct/:productId",
  ProductController.getRelatedProducts
);
router.get("/getProductById/:productId", ProductController.getProductById);
router.get("/searchProduct", ProductController.searchProducts);

module.exports = router;
