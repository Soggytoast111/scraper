var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

var htmlArray = []

router.get("/", function(req, res) {
  res.render("index");
});

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {

  var user = "derangedwinchester";
  
  // First, we grab the body of the html with axios
  axios.get("https://old.reddit.com/user/" + user + "?limit=100").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".thing").each(function(i, element) {
      // Save an empty result object
      var htmlObj = {};

      // Add the text and href of every link, and save them as properties of the result object
      htmlObj.title = $(this).children(".entry").children(".top-matter").children(".title").children("a").text() || $(this).children(".parent").children(".title").text()
      htmlObj.link = $(this).attr("data-permalink");
      htmlObj.time = $(this).children(".entry").children(".tagline").children("time").attr("datetime") || $(this).children(".entry").children(".top-matter").children(".tagline").children("time").attr("datetime")
      htmlObj.type = $(this).attr("data-type")
      htmlObj.content = $(this).children(".entry").children("form").children(".usertext-body").children(".md").children("p").text() || "N/A (Link/Text Submission)"
      htmlObj.redditId = $(this).attr("id")
      console.log(htmlObj)
        htmlArray.push(htmlObj)
      // Create a new Article using the `result` object built from scraping
      //db.Article.create(result)
       // .then(function(dbArticle) {
          // View the added result in the console
         // console.log(dbArticle);
      //  })
      //  .catch(function(err) {
          // If an error occurred, log it
       //   console.log(err);
      //  });
      
    })
    var nextButton = $(".next-button").children("a").attr("href")
    
    console.log("Here is the next button link:  " + (nextButton || "END OF RESULTS"))
    
    // Send a message to the client
    res.json(htmlArray)
  });
});


router.get("/api/eatBurger/:id", function(req,res){

})

//Clicking the burger button in the eaten column will delete row in databse (destroy burger) and refresh the page
router.get("/api/destroyBurger/:id", function(req,res){

})

//Clicking Add Burger button takes data from form and updates database (create burger) and then refreshes the page
router.get("/api/createBurger/", function(req,res){

})

  module.exports = router;