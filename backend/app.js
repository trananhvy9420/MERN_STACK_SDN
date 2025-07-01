var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

// --- Routers ---
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRouter = require("./routes/auth.route");
const memberRouter = require("./routes/member.route");
const playerRouter = require("./routes/player.route");
const teamRouter = require("./routes/team.route");
const commentRouter = require("./routes/comment.route");

// --- Database ---
const connect = require("./src/db/connect");

// --- Auth ---
const session = require("express-session");
const passport = require("passport");
require("./config/passport-setup");

const port = process.env.PORT || 3000;

// --- Kết nối Database với xử lý lỗi đúng cách ---
connect
  .then((db) => {
    console.log("Connected to DB successfully!");
  })
  .catch((err) => {
    // THÊM: Bắt lỗi nếu kết nối thất bại
    console.error("Failed to connect to DB", err);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  });

var app = express();

// --- View Engine Setup ---
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const corsOptions = {
  origin: "http://localhost:5173", // Chấp nhận yêu cầu từ port 5173
  credentials: true, // Cho phép gửi cookie và thông tin xác thực
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // BỎ: Dòng bị lặp

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// --- Khởi tạo Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/member", memberRouter);
app.use("/api/player", playerRouter);
app.use("/api/team", teamRouter);
app.use("/api/comment", commentRouter);

// --- Xử lý lỗi 404 ---
app.use(function (req, res, next) {
  next(createError(404));
});

// --- Xử lý lỗi chung ---
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

/*
 * XÓA: Khối app.listen()
 * Thông thường, file này sẽ được export để file bin/www khởi chạy server.
 * Nếu bạn không có file đó và muốn chạy trực tiếp từ file này, thì có thể giữ lại.
 * Nhưng theo cấu trúc chuẩn của Express Generator, nó nên bị xóa.
 */
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

module.exports = app;
