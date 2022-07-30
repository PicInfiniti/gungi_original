// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

// sass ++++++++++++++++++++++++++++++++++++++++++
import './assets/sass/style.sass'
// import './assets/sass/main.sass'

// sass ------------------------------------------

// app +++++++++++++++++++++++++++++++++++++++++++
// import './assets/js/app'

// app -------------------------------------------

// setup +++++++++++++++++++++++++++++++++++++++++
// import {
//   settings
// } from './assets/js/init'

// setup -----------------------------------------

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


