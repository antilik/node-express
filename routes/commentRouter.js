const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
var authenticate = require("../authenticate");
const cors = require("./cors");

const commentController = require("./commentController");

const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

commentRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => commentController.commentGet(req, res, next))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentController.commentPost(req, res, next))
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentController.commentPut(req, res, next))
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => commentController.commentDelete(req, res, next));

commentRouter
  .route("/:commentId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => commentController.commentIdGet(req, res, next))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentController.commentIdPost(req, res, next))
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentController.commentIdPut(req, res, next))
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentController.commentIdDelete(req, res, next));

module.exports = commentRouter;
