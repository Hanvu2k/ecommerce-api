require("dotenv").config();

const express = require("express");
const route = require("./routes");
const cors = require("cors");
const http = require("http");

const { connect } = require("./config/db");

const methods = ["GET", "POST", "PATCH", "DELETE"];
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: methods,
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors(corsOptions));

route(app);
connect().then((_res) => {
  server.listen(port, () => console.log(`Run: http://localhost:${port}`));
});
