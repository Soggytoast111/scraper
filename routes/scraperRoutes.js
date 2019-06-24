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

var testObject = [{
  title: "TestTitle1",
  link: "www.test.test/htmltest1",
  time: Date.now(),
  type: "TestOnlyNoType1",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  user: "TestUserSupreme!1",
  redditId: "TestIDABCDEFG1",
  note: "noNotesHere!1"
},
{
  title: "TestTitle2",
  link: "www.test.test/htmltest2",
  time: Date.now(),
  type: "TestOnlyNoType2",
  content: "Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.",
  user: "TestUserSupreme!2",
  redditId: "TestIDABCDEFG2",
  note: "noNotesHere!2"
}]


router.get("/fetch/:user", function(req,res){
  var user = req.params.user;
  db.Results.find({user: user})
  .then(function(dbResult) {
    res.render("index", dbResult)  
  })
  .catch(function(err) {
      res.json(err);
  })
})

//Clicking the burger button in the eaten column will delete row in databse (destroy burger) and refresh the page
router.get("/testtable", function(req,res){
  res.render("index", testObject)
})

//Clicking Add Burger button takes data from form and updates database (create burger) and then refreshes the page
router.get("/api/createBurger/", function(req,res){

})

module.exports = router;