const express = require("express");
const teamRoute = express.Router();
const team = require("../src/models/team");
const teamController = require("../src/controllers/team.controller");
const { query, param, body, validationResult } = require("express-validator");
const {
  registerRules,
  validate,
  loginRules,
  protectedRoute,
  isAdmin,
} = require("../src/middlewares/validation.middleware");

teamRoute
  .route("/")
  .get(
    [
      query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive number"),
      query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive number"),
    ],
    validate,
    teamController.findAllTeam
  );

teamRoute
  .route("/activeteam")
  .get(validate, protectedRoute, isAdmin, teamController.findAllActiveTeam);
teamRoute.route("/nopaging").get(teamController.findAllTeamNoPaging);
teamRoute
  .route("/")
  .post(
    [
      body("teamName")
        .trim()
        .notEmpty()
        .withMessage("Team Name must be required"),
    ],
    protectedRoute,
    isAdmin,
    validate,
    teamController.createTeam
  );
teamRoute
  .route("/:id")
  .get(
    [
      param("id")
        .notEmpty()
        .withMessage("ID must be required")
        .isMongoId()
        .withMessage("Invalid ID format."),
    ],
    protectedRoute,
    isAdmin,
    validate,
    teamController.findByID
  );
//update
teamRoute.route("/:id").put(
  [
    param("id").notEmpty().withMessage("ID must be required"),
    body("teamName")
      .trim()
      .notEmpty()
      .withMessage("Team Name must be required"),
  ],

  protectedRoute,
  isAdmin,
  validate,
  teamController.updateTeam
);
teamRoute
  .route("/delete/:id")
  .delete(
    [param("id").notEmpty().withMessage("ID must be required")],
    protectedRoute,
    isAdmin,
    validate,
    teamController.deleteTeam
  );
teamRoute.route("/:teamId/active").post(
  [param("teamId").isMongoId().withMessage("Invalid Player ID format.")],
  validate,
  protectedRoute,
  isAdmin,

  teamController.activeTeam
);
module.exports = teamRoute;
