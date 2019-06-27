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

router.get("/fetch/:user/:from/:to", function(req,res){
  var user = req.params.user;
  
  function calcFrom(from) {
    if (from == "null") {
      console.log("null?!")
      console.log(from)
      return "1970-05-06T04:00:00.000Z"
    } else {
      console.log("here is to!")
      console.log(from)
      return from
    }
  }
  function calcTo(to) {
    if (to === "null") {
      console.log("null?!")
      console.log(to)
      return "2057-02-03T05:00:00.000Z"
    } else {
      console.log("here is from!")
      console.log(to)
      return to
    }
  }

  var fromDate = calcFrom(req.params.from)
  var toDate = calcTo(req.params.to)

  db.Results.find({user: user, time: {"$gte": fromDate, "$lte": toDate}})
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
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Results.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Debug route - loads test object into table
router.get("/testtable", function(req,res){
  res.render("index-fetch", testObject)
})

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

module.exports = router;