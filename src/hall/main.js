// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

// style and util +++++++++++++++++++++++++
import "./assets/sass/about.sass"
// ----------------------------------------

$(document).bind("contextmenu", function (_) {
  return false;
});

$('.massage input').keypress(function(event) {
  if(event.which == 13) {
    console.log(`${$('.status').text()}: ${event.target.value}`);
  }
});