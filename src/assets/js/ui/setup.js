// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

import {
  Constants
} from "../constants"

import Desk from "../lib/desk"

export const gungi = new Desk(Constants)


var stockpile = {
  "帥": 1,
  "兵": 9,
  "忍": 2,
  "砲": 2,
  "砦": 2,
  "侍": 2,
  "謀": 1,
  "筒": 1,
  "馬": 2,
  "弓": 2,
  "大": 6,
  "中": 4,
  "小": 4
}

$.each(stockpile, function (key, value) {
  $("#bs-" + key).append("<sub>" + value + "</sub>")
});

$.each(stockpile, function (key, value) {
  $("#ws-" + key).append("<sub>" + value + "</sub>")
});


$.each(stockpile, function (key, value) {
  $("#bc-" + key).append("<sub>0</sub>")
});

$.each(stockpile, function (key, value) {
  $("#wc-" + key).append("<sub>0</sub>")
});




for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    $('#fake').append("<label type='text'>0</label>")
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    $('#board').append(`<label type='text' id='b-${i}-${j}' name='${i}-${j}'>${i}${j}</label>`)
  }
}
