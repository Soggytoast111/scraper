var cheerio = require("cheerio");
var axios = require("axios");

var mongoose = require("mongoose");
var db = require("../models");
mongoose.connect("mongodb://localhost/scraperApp", { useNewUrlParser: true });


var scraperApp = {
    scrape: function(link, user) {
      db.Results.findOne({user: user}).sort({time: -1}).then(function(dbResult1){
          if(dbResult1){
            var newestItem = dbResult1.redditId
          }
          var scraperBreak = false
          htmlArray = []
          axios.get(link).catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          }).then(function(response) {
            if (response){
          var $ = cheerio.load(response.data);
          $(".thing").each(function(i, element) {
              if ($(this).attr("id") == newestItem) {
                scraperBreak = true
                console.log("Update Short Circuit!")
                return false
              } else {
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
              console.log("created DB Entry:  ")
              console.log(htmlObj)
              }
          })}
          if (response){
          if (scraperBreak == false) {
        var nextButton = $(".next-button").children("a").attr("href")
        if (nextButton){
          scraperApp.scrape(nextButton, user)
        }
        else {
          console.log("finished scrape!")
          console.log("user checked was:  " + user)
          console.log("newestItemwas:  " + newestItem)
          return htmlArray
        }} else {
          console.log("Update Short Circuit2! on   " + newestItem)
          console.log("user was:  " + user)
          return false
        }}
        });
        })
    }
}

module.exports = scraperApp