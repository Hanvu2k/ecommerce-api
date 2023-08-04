require("dotenv").config();
const mongoose = require("mongoose");

async function connect() {
  try {
    const options = {
      dbName: "ecommerce-db",
      minPoolSize: 10,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    };

    const res = await mongoose.connect(process.env.MONGO_URL, options);
    return res;
  } catch (error) {
    console.log("Error connecting to db");
    process.exit(1);
  }
}

module.exports = { connect };
