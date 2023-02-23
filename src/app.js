const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

const config = require("./config");
const errorHandle = require("./middleware/errorHandle");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const shopRouter = require("./routes/shop");

const app = express();

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/shop", shopRouter);

app.use(errorHandle);

module.exports = app;
