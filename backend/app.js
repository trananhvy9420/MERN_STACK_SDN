var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cors = require("cors");
var app = express();
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const mongoose = require("mongoose");
const connect = require("./src/db/connect");
const port = process.env.PORT || 3000;
const Member = require("./src/models/member");
const Comment = require("./src/models/comment");
const Player = require("./src/models/player");
const Team = require("./src/models/team");
const commentRouter = require("./routes/comment.route");
const authRouter = require("./routes/auth.route");
const memberRouter = require("./routes/member.route");
const playerRouter = require("./routes/player.route");
const teamRouter = require("./routes/team.route");
const session = require("express-session");
const passport = require("passport");
require("./config/passport-setup");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Chỉ lưu session khi có thay đổi
    cookie: {
      secure: true, // true nếu dùng HTTPS
      maxAge: 1000 * 60 * 60 * 24, // ví dụ: 1 ngày
    }, // Đặt là true nếu dùng HTTPS
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
connect.then((db) => {
  console.log("Connected to DB successfully!");
  console.log("PORT" + port);
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/member", memberRouter);
app.use("/api/player", playerRouter);
app.use("/api/team", teamRouter);
app.use("/api/comment", commentRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
