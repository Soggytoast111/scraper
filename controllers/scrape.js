var cheerio = require("cheerio");
var axios = require("axios");

var mongoose = require("mongoose");
var db = require("../models");
mongoose.connect("mongodb://localhost/scraperApp", { useNewUrlParser: true });


var scraperApp = {
    scrape: function(user) {
      // TO DO!!!  
      //  FIX THIS!!

      //PUT LINK BACK IN ROUTES.JS, CALLBACK FUNCTION MUST TAKE LINK AS AN ARGUMENT!
      //MUST CONCAT USERNAME FROM LINK PASSED IN
      var link = "https://old.reddit.com/user/" + user + "?limit=100"
        db.Results.findOne({user: user}).then(function(dbResult1){
          if(dbResult1){
            var newestItem = dbResult1.redditId
          }
          htmlArray = []
          axios.get(link).then(function(response) {

          var $ = cheerio.load(response.data);
          $(".thing").each(function(i, element) {
              if ($(this).attr("id") == newestItem) {
                console.log("Update Short Circuit!")
                return false
              }
              var htmlObj = {};
              htmlObj.title = $(this).children(".entry").children(".top-matter").children(".title").children("a").text() || $(this).children(".parent").children(".title").text()
              htmlObj.link = $(this).attr("data-permalink");
              htmlObj.time = $(this).children(".entry").children(".tagline").children("time").attr("datetime") || $(this).children(".entry").children(".top-matter").children(".tagline").children("time").attr("datetime")
              htmlObj.type = $(this).attr("data-type")
              htmlObj.content = $(this).children(".entry").children("form").children(".usertext-body").children(".md").children("p").text() || "N/A (Link/Text Submission)"
              htmlObj.user = $(this).children(".entry").children(".tagline").children(".author").text().toLowerCase() || $(this).children(".entry").children(".top-matter").children(".tagline").children(".author").text().toLowerCase()
              htmlObj.redditId = $(this).attr("id")
              console.log(htmlObj)
              htmlArray.push(htmlObj)
              db.Results.create(htmlObj)
          })
        var nextButton = $(".next-button").children("a").attr("href")
        if (nextButton){
          scraperApp.scrape(nextButton)
        }
        else {
          return htmlArray
        }
        });
        })
    }
}

module.exports = scraperApp