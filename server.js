// node server and include routes
// Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var axios = require("axios");
var controller = require("./controllers/controller");

// Set up port to be either the host's designated port or 3000
var PORT = process.env.PORT || 3000;

// Instantiate Express App
var app = express();

// Use bodyParser in app for handling form submissions
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// Designate express.static to server public folder as a static directory
app.use(express.static("public"));
// app to use routes
controller(app);

var exphbs = require("express-handlebars");
// Connect Handlebars to express app
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// mongodb connection
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Listen on the port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
