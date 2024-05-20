const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Check if there's an email in DB that matches this email
      User.findOne({
        email: email.toLowerCase(),
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: "The entered email is not registered",
          });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => {
        if (!user) {
          return done(null, false); // User not found
        }
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
