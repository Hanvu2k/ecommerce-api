const UserModel = require("../models/User");
const RoleModel = require("../models/Role");

class RoleController {
  //   create a new category
  async createRole(req, res) {
    const { level, name } = req.body;

    try {
      const newRole = await RoleModel.create({ name, level });

      return res.status(201).json({
        success: true,
        message: "Role created successfully!",
        category: newRole,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get role
  async getRole(req, res) {
    try {
      const user = await UserModel.findOne({ _id: req.session.user._id });

      if (!user)
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });

      const role = await RoleModel.find();

      return res
        .status(200)
        .json({ success: true, message: "Get role successfully!", role: role });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

module.exports = new RoleController();
