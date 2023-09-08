require("dotenv").config();
const express = require("express");
const route = require("./routes");
const cors = require("cors");
const http = require("http");
const { init } = require("./socket");
const helmet = require("helmet");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { connect } = require("./config/db");

const methods = ["GET", "POST", "PATCH", "DELETE"];
const corsOptions = {
  origin:["https://apple.learn-it.site", "http://localhost:3001", "http://localhost:3000", "https://frolicking-bavarois-b40d71.netlify.app"],
  methods: methods,
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
init(server);

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "jwt",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors(corsOptions));

route(app);
connect().then((_res) => {
  server.listen(port, () => console.log(`Run: http://localhost:${port}`));
});
