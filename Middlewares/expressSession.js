const session = require("express-session");

const expressSessionMiddleware = session({
  secret: "secret key",
  resave: true,
  saveUninitialized: false,
});

module.exports = expressSessionMiddleware;
