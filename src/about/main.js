// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

// style and util +++++++++++++++++++++++++
import "./assets/sass/about.sass"
// ----------------------------------------

// Ui ++++++++++++++++++++++++++++++++++++++
import './assets/js/ui/setup'
import './assets/js/ui/Interactions'
// ----------------------------------------

$(document).bind("contextmenu", function (e) {
  return false;
});
