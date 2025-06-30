const express = require("express");
const commentRoute = express.Router();
const comment = require("../src/models/comment");
const { query, body, param } = require("express-validator");
const {
  protectedRoute,
  isAdmin,
} = require("../src/middlewares/validation.middleware");
const CommentController = require("../src/controllers/comment.Controller");
commentRoute.get("/").get(protectedRoute, CommentController.fetchAllComment);
module.exports = commentRoute;
