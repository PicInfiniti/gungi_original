// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

// sass ++++++++++++++++++++++++++++++++++++++++++
import './assets/sass/style.sass'

// sass ------------------------------------------

// app +++++++++++++++++++++++++++++++++++++++++++


// app -------------------------------------------

// setup +++++++++++++++++++++++++++++++++++++++++

// setup -----------------------------------------
document.addEventListener('contextmenu', event => event.preventDefault());
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    $('#fake').append("<label class='fake boarder' type='text'>0</label>")
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    $('#board').append(`<label class='box' type='text' id='b-${i}-${j}' name='${i}-${j}'>${i}${j}</label>`)
  }
}

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