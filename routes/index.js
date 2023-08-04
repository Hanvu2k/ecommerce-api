const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const cartRouter = require("./cart");

const route = (app) => {
  app.use("/api/v1/auth", userRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/cart", cartRouter);
};

module.exports = route;
