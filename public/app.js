// JSON articles
$(document).on("click", ".scrape-new", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
    console.log(data);
    window.location.href = "/articles";
  });
});

$(document).on("click", "#savedArt", function() {
  $.ajax({
    method: "GET",
    url: "/savedarticles"
  }).then(function(data) {
    console.log(data);
    window.location.href = "/savedarticles";
  });
});

$(document).on("click", "#Art", function() {
  $.ajax({
    method: "GET",
    url: "/articles"
  }).then(function(data) {
    console.log(data);
    window.location.href = "/articles";
  });
});

// Add a note button event
$(document).on("click", ".addNote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#savedNotes").empty();
  $(".modal-footer").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Article ajax call
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // note information added to page
    .then(data => {
      // article title
      $("#notes").append(
        '<h2 class="ml-2 text-left font-weight-bold">' + data.title + "</h2>"
      );
      // An input to enter a new title
      $("#notes").append(
        "<input id='titleinput' name='Enter your note' placeholder='Add a note'>"
      );
      // A button to submit a new note, with the id of the article saved to it
      $(".modal-footer").append(
        "<button class='btn info-color btn-small' data-dismiss='modal' data-id='" +
          data._id +
          "' id='savenote'>Save Note</button>"
      );

      if (data.note) {
        let noteTitles = data.note;
        noteTitles.forEach(element => {
          console.log(noteTitles);
          $("#savedNotes").append(`
          <div class='mt-2 font-weight-bold'>${element.title} <div data-id="${
            element._id
          }" class="deleteNote">remove</div></div>
          `);
        });
      }
    });
});

// specific note deleted, "DELETE" request sent to server at route deletenote/:id
$(document).on("click", ".deleteNote", function() {
  var thisId = $(this).attr("data-id");
  $(this)
    .parent()
    .text("");
  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId
  }).then(function(data) {
    console.log(data);
  });
});

// savenote button clicked
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    // Log the response
    console.log(data);
    // notes section emptied
    $("#notes").empty();
  });

  // values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// Save article clicked
$(document).on("click", ".saveArt", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/savedarticles/" + thisId
  }).then(function(data) {
    console.log(data);
    window.location.reload();
  });
});

// Delete article when clicked
$(document).on("click", ".saveArtDel", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId
  }).then(function(data) {
    console.log(data);
    window.location.reload();
  });
});
