const { Router } = require("express");
const router = Router();
const CategoryController = require("../controllers/category.controller");

router.post("/create", CategoryController.createCategory);

module.exports = router;
