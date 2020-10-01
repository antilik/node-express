const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
var authenticate = require("../authenticate");
const cors = require("./cors");

const commentController = require("./commentController");

const {
  commentGet,
  commentPost,
  commentPut,
  commentDelete,
  commentIdGet,
  commentIdPost,
  commentIdPut,
  commentIdDelete,
} = commentController;

const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

commentRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => commentGet(req, res, next))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentPost(req, res, next))
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentPut(req, res, next))
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
    (req, res, next) => commentDelete(req, res, next));

commentRouter
  .route("/:commentId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => commentIdGet(req, res, next))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentIdPost(req, res, next))
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentIdPut(req, res, next))
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => commentIdDelete(req, res, next));

module.exports = commentRouter;
