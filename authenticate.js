const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

// exports.verifyAdmin = () => {
//   User.findOne({ _id: req.user._id }, (err, user) => {
//     if (req.user.admin) {
//       next();
//     } else {
//       res.statusCode = 403;
//       res.setHeader('Content-Type', 'text/plain');
//       res.end('You are not authorized to perform this operation!')

//       return next(err);
//     }
//   });
// };

exports.verifyUser = passport.authenticate('jwt', { session: false });
