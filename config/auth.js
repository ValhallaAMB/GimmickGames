module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // req.flash("error_msg", "");
    res.redirect("/");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
};

// --------> NOTE : This is where authentication for whether the user is a reg user or not while saving a score will be handled as well
