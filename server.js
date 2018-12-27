// node server and include routes
// Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var axios = require("axios");

// Set up port to be either the host's designated port or 3000
var PORT = process.env.PORT || 3000;

// Instantiate Express App
var app = express();

// Set up an Express Router
var router = express.Router();

// Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to express app
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Use bodyParser in app
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Have every request go through router middleware
app.use(router);

// If deployed, use the deployment database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose to database
mongoose.connect(
  db,
  function(error) {
    // log any errors connecting with mongoose
    if (error) {
      console.log(error);
      // Or log a success message
    } else {
      console.log("mongoose connection is successful");
    }
  }
);

// Listen on the port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
