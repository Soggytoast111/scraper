var express = require("express");
var router = express.Router();
var scraperApp = require("../controllers/scrape.js")

var mongoose = require("mongoose");
var db = require("../models");
mongoose.connect("mongodb://localhost/scraperApp", { useNewUrlParser: true });

router.get("/", function(req, res) {
  res.render("index");
});

// A POST route for scrape
router.post("/scrape", async function(req, res) {
  var user = req.body.user;
  var link = "https://old.reddit.com/user/" + user + "?limit=100"

  scraperApp.scrape(link, user)
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
    res.render("index-fetch", dbResult)  
  })
  .catch(function(err) {
      res.json(err);
  })
})

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/result/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Results.findOne({ redditId: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for saving/updating an Article's associated Note
router.post("/note/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Results.findOneAndUpdate({ redditId: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Clicking the burger button in the eaten column will delete row in databse (destroy burger) and refresh the page
router.get("/testtable", function(req,res){
  res.render("index-fetch", testObject)
})

//Clicking Add Burger button takes data from form and updates database (create burger) and then refreshes the page
router.post("/buttontest", function(req,res){
  console.log(req.body)
})

module.exports = router;