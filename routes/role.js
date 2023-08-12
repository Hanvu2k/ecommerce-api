const { Router } = require("express");
const router = Router();
const RoleController = require("../controllers/role.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/create", verifyToken, verifyAdmin, RoleController.createRole);
router.get("/getRole", verifyToken, verifyAdmin, RoleController.getRole);

module.exports = router;
