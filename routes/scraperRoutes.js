var express = require("express");
var router = express.Router();
var scraperApp = require("../controllers/scrape.js")

var mongoose = require("mongoose");
var db = require("../models");
mongoose.connect("mongodb://localhost/scraperApp", { useNewUrlParser: true });

router.get("/", function(req, res) {
  res.render("index");
});

// A GET route for scrape by user
router.get("/scrape/:user", async function(req, res) {
  var user = req.params.user;
  var userLink = "https://old.reddit.com/user/" + user + "?limit=100"

  scraperApp.scrape(userLink)
  res.send("done")
});

var testObject = {
  here: "is",
  a: "test",
  object: "to",
  play: "with"
}


router.get("/fetch/:user", function(req,res){
  var user = req.params.user;
  db.Results.find({user: user})
  .then(function(dbResult) {
      res.json(dbResult)
  })
  .catch(function(err) {
      res.json(err);
  })
})

//Clicking the burger button in the eaten column will delete row in databse (destroy burger) and refresh the page
router.get("/api/destroyBurger/:id", function(req,res){

})

//Clicking Add Burger button takes data from form and updates database (create burger) and then refreshes the page
router.get("/api/createBurger/", function(req,res){

})

module.exports = router;