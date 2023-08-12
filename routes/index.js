const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const roleRouter = require("./role");
const messageRouter = require("./message");

const route = (app) => {
  app.use("/api/v1/auth", userRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/role", roleRouter);
  app.use("/api/v1/message", messageRouter);
};

module.exports = route;
