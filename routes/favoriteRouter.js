const express = require("express");
const bodyParser = require("body-parser");

const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        favorites => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        favorites => {
          if (!favorites) {
            Favorites.create({})
              .then(favorites => {
                favorites.user = req.user._id;
                favorites.dishes = req.body;
                favorites
                  .save()
                  .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  })
                  .catch(err => next(err));
              })
              .catch(err => next(err));
          } else {
            Favorites.create({}).then(favorites => {
              req.body.forEach(element => {
                if (!favorites.dishes.includes(element._id)) {
                  favorites.dishes.push(element._id);
                }
                favorites.user = req.user._id;
                favorites.save().catch(err => next(err));
              });
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            });
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.deleteMany({ user: req.user._id })
      .then(
        resp => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "GET operation is not supported on /favorites/" + req.params.dishId
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        favorite => {
          if (!favorite) {
            favorite = {};
            favorite.user = req.user._id;
            favorite.dishes = [];
            favorite.dishes.push(req.params.dishId);

            Favorites.create(favorite)
              .then(
                favorite => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                },
                err => next(err)
              )
              .catch(err => next(err));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            if (!favorite.dishes.includes(req.params.dishId)) {
              favorite.dishes.push(req.params.dishId);
              favorite
                .save()
                .then(
                  favorite => {
                    res.json(favorite);
                  },
                  err => next(err)
                )
                .catch(err => next(err));
            } else {
              res.json(favorite);
            }
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      "PUT operation is not supported on /favorites/" + req.params.dishId
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        favorite => {
          const index = favorite.dishes.indexOf(req.params.dishId);
          if (index != -1) {
            favorite.dishes.splice(index, 1);
            favorite
              .save()
              .then(
                favorite => {
                  Favorites.findById(favorite._id)
                    .populate("user")
                    .populate("dishes")
                    .then(favorite => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    });
                },
                err => next(err)
              )
              .catch(err => next(err));
          } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end(`This dish ${req.params.dishId} wasn't found!`);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = favoriteRouter;
