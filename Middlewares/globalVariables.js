const globalVariablesMiddleware = function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.danger_msg = req.flash("danger_msg");
  res.locals.user = req.user;
  next();
};

module.exports = globalVariablesMiddleware;
