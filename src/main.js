// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

// sass ++++++++++++++++++++++++++++++++++++++++++
import './assets/sass/style.sass'

// sass ------------------------------------------


// setup +++++++++++++++++++++++++++++++++++++++++
document.addEventListener('contextmenu', event => event.preventDefault());

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

$('.stockpile').hover((event) => {
    $('.tooltip').show()
      .text(capitalizeFirstLetter(event.target.getAttribute('dcr')))
  },
  (event) => {
    $('.tooltip').hide()
      .text('Marshal')
  })
  
// setup -----------------------------------------

// Ui ++++++++++++++++++++++++++++++++++++++
import './assets/js/ui/setup'
import './assets/js/ui/Interactions'

// Ui -------------------------------------------