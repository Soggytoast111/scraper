var testObject = {
    title: "TestTitle",
    link: "www.test.test/htmltest",
    time: Date.now(),
    type: "TestOnlyNoType",
    user: "TestUserSupreme!",
    redditId: "TestIDABCDEFG",
    note: "noNotesHere!"
  }

  //Filter for Table Results
  $("#textFilter").on("keyup", filterTable)

  function filterTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("textFilter");
  filter = input.value.toUpperCase();
  table = document.getElementById("results");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i<tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (i % 2 == 0){
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          tr[i-1].style.display = "";
        }
        else {
          tr[i].style.display = "none";
        }             
      } else{
          if (txtValue.toUpperCase().indexOf(filter) == -1) {
            tr[i].style.display = "none";   
          } else {
            tr[i].style.display = "";
            tr[i+1].style.display = "";
            i++
          }
      }
      }
    }
  }
  
  //Button Event to fetch user data from db
  $("#fetch").click(function(){
    if ($("#username").val() == "") {
      alert("Enter a username!")
    } else {
    window.location = "/fetch/"+ $("#username").val().toLowerCase().trim() + "/" + moment($("#fromDate").val()).toISOString() + "/" + moment($("#toDate").val()).toISOString()
    }
  })

  //Button event to have backend scrape reddit for user info
  $("#scrape").click(function(){
    $("#scrape").attr("disabled", "")
    setTimeout(function(){
      $("#fetch").removeAttr("disabled")
    }, 5000)
    setTimeout(function(){
      alert("Scraping Complete!")
    }, 4750)
    $.post("/scrape", 
      {
        user: $("#username").val().toLowerCase().trim()
      }
    )
  })


$(document).on("click", ".pinNote", function() {
  // Empty the notes from the note section
  $("#mynotebox").remove();
  // Save the id from the p tag
  var thisId = $(this).attr("redditId");

   // Now make an ajax call for the Article
   $.ajax({
    method: "GET",
    url: "/result/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      $("body").append("<div id='mynotebox'></div>");
      // The title of the article
      $("#mynotebox").append("<h5>" + data.title + "</h5>");
      // An input to enter a new title
      $("#mynotebox").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#mynotebox").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#mynotebox").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // A button to close the box
      $("#mynotebox").append("<button data-id='" + data._id + "' id='closebox'>Close</button>");
      console.log("Here is data_id!  " + data._id)
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//Close box function
$(document).on("click", "#closebox", function() {
  $("#mynotebox").remove();
})

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/note/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#mynotebox").remove();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Float the table headaer
$(document).ready(function(){
  $("table").floatThead()
})

//Datepicker Script
$('#fromDate').datepicker();
$('#toDate').datepicker();

$("#results").click(function(){
  console.log($("#fromDate").val())
  console.log("from Date:  " + moment($("#fromDate").val()).toISOString())
  console.log("to Date:  " + moment($("#toDate").val()).toISOString())
})