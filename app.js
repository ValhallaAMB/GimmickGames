require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const passport = require("passport");
const url = require("url");

//  Connect to DB
const connectDB = require("./config/db");
connectDB();

//  Setting and Listening on Port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on PORT : ${PORT}`));

//  Middleware Imports
const expressSessionMiddleware = require("./Middlewares/expressSession");
const globalVariablesMiddleware = require("./Middlewares/globalVariables");
// const userMiddleware = require("./Middlewares/userMiddleware"); // (Mohaimin added this)

// Passport Config
require("./config/passport")(passport);

//  EJS
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// EJS Static Files
app.use(express.static(path.join(__dirname, "public")));

//  Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(expressSessionMiddleware);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(globalVariablesMiddleware);

// User middleware (Mohaimin added this)
// app.use(userMiddleware);

//  JSON Body Parser
app.use(express.json());

//  Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/games", require("./routes/games"));
app.use("/scores", require("./routes/scores"));
