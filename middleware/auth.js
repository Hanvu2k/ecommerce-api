const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token!",
    });
  }

  try {
    const decoded = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);

    req.session.user = decoded;
    return next();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.verifyCounselor = (req, res, next) => {
  try {
    const user = req.session.user;
    if (user.role === 1) next();
    else
      return res
        .status(401)
        .json({ message: "You don't have permission to do it!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  try {
    const user = req.session.user;
    if (user.role === 2) next();
    else
      return res
        .status(401)
        .json({ message: "You don't have permission to do it!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.verifyAdminOrCounselor = (req, res, next) => {
  try {
    const user = req.session.user;
    if (user.role === 1 || user.role === 2) {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "You don't have permission to do it!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
