//Dep Require
var express = require("express")
var app = express()
var logger = require("morgan");
var mongoose = require("mongoose");



//Set Up Models
var db = require("./models");

//Set Up Express
var PORT = process.env.PORT || 8080;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
});

//Set up Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraperapp", { useNewUrlParser: true });

//Routes Require
var routes = require("./routes/scraperRoutes.js");
app.use(routes);
