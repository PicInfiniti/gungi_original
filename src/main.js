// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

// sass ++++++++++++++++++++++++++++++++++++++++++
import './assets/sass/style.sass'

// sass ------------------------------------------


// setup +++++++++++++++++++++++++++++++++++++++++
document.addEventListener('contextmenu', event => event.preventDefault());

function capitalizeFirstLetter(string) {
  let temp = string.charAt(0).toUpperCase() + string.slice(1)
  return temp.replace('_', ' ');
}

$('.stockpile').hover((event) => {
    let color = $(event.target).attr('id')[0]
    if(color=='b') {
      $('#b-army .tooltip').show()
      .text(capitalizeFirstLetter(event.target.getAttribute('dcr')))
    } else {
      $('#w-army .tooltip').show()
      .text(capitalizeFirstLetter(event.target.getAttribute('dcr')))
    }

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