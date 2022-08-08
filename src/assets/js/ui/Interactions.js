// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

import {
  Reset_Sections,
  Select_Square,
  Show_Moves,
  Movement_Possibility,
  Update_Game,
  update_tier,
  turn_update,
  Check,
  CheckMate
} from './utils'

import {
  gungi
} from './setup'

import {
  Constants
} from '../constants'


var click_pos = {
  src: null,
  dst: null
}

var Click = true

var stockpile_selected = gungi.stockpiles.b.marshal[0]

Select_Square("#bs-" + stockpile_selected.symbol, '#fc9803')

$(".stockpile").click(function () {
  Reset_Sections();
  Select_Square(this, '#fc9803')
  stockpile_selected = gungi.stockpiles[gungi.turn][$(this).attr("dcr")][0]

  click_pos = {
    src: null,
    dst: null
  }

  if (gungi.in_check()['b'] || gungi.in_check()['w']) {
    Check(gungi.in_check()['b'] ? 'b' : 'w');
    Check(gungi.in_check()['w'] ? 'w' : 'b');
  }
});

$(".tier").click(function () {
  Reset_Sections();
  Select_Square(this, '#009699')

  stockpile_selected = null
  click_pos = {
    src: null,
    dst: null
  }

  if (gungi.in_check()['b'] || gungi.in_check()['w']) {
    Check(gungi.in_check()['b'] ? 'b' : 'w');
    Check(gungi.in_check()['w'] ? 'w' : 'b');
  }

});

$("#ReadyButton button").click(function () {
  Reset_Sections();
  if (gungi.in_check()['b'] || gungi.in_check()['w']) {
    Check(gungi.in_check()['b'] ? 'b' : 'w');
    Check(gungi.in_check()['w'] ? 'w' : 'b');
  }

  gungi.move({
    src: null,
    dst: null,
    type: gungi.READY
  });
  turn_update();
  if ($("#ReadyButton button").text() == 'Resign') {
    CheckMate(Constants.MARSHAL, gungi.turn == 'w' ? 'b' : 'w', 1)
    Click = false
  }
  if (gungi.phase == 'game') {
    $('#PHASE').text('Game Phase')
    $("#ReadyButton button")
      .text('Resign')
      .css({
        color: 'white',
        border: 'min(.3vh, .3vw) solid red',
        'background-color': 'red'
      })
      .hover((event) => {
        $(this).css({
          'background-color': 'red',
          color: 'white',
          cursor: 'pointer'
        })
      }, (event) => {
        $(this).css({
          'background-color': 'white',
          color: 'red'
        })
      })
  }

  stockpile_selected = null;
  click_pos = {
    src: null,
    dst: null
  }

  if (gungi.in_checkmate() && $('#r-2').css('opacity') != .6) {
    CheckMate(Constants.MARSHAL, gungi.turn, 1)
  }
});

$("#Attack").click(function () {
  Update_Game({
    piece: gungi.get_top(click_pos.src),
    dst: click_pos.dst,
    type: gungi.ATTACK
  });
  $("#War").fadeOut();
  update_tier(click_pos.dst);
  stockpile_selected = null;
  click_pos.src = null;
  click_pos.dst = null
  // WAR = null;
});

$("#Stack").click(function () {
  Update_Game({
    piece: gungi.get_top(click_pos.src),
    dst: click_pos.dst,
    type: gungi.STACK
  })
  $("#War").fadeOut();
  update_tier(click_pos.dst);
  stockpile_selected = null;
  click_pos.src = null;
  click_pos.dst = null
  // WAR = null;
});

$("#save").click(function () {
  saveText(JSON.stringify({
    move: gungi.history
  }), "history.json");
});

// read json ----------------------

function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  load_history(obj.move)
}

$("#jsonfile").change((event) => {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);

});

// ---------------------------------------

$('#board label').mousedown(function (event) {
  console.log(gungi.in_checkmate())
  Reset_Sections();
  if (!gungi.in_checkmate()) {
    switch (event.which) {
      case 1: // grab left click
        Select_Square(this, 'green');

        if(Click){
          click_pos.dst = $(this).attr("name");

          if (stockpile_selected) {
            Update_Game({
              piece: stockpile_selected,
              dst: click_pos.dst,
              type: Constants.PLACE
            });
            update_tier(click_pos.dst);
            stockpile_selected = null;
            click_pos.src = null;
            click_pos.dst = null
  
            break;
          }
  
          update_tier($(this).attr("name"));
  
          let Movement = Movement_Possibility(click_pos.src, click_pos.dst)
          if (Movement.length == 1) {
            Update_Game({
              piece: gungi.get_top(click_pos.src),
              dst: click_pos.dst,
              type: Movement[0].type
            })
            update_tier(click_pos.dst);
            stockpile_selected = null;
            click_pos.src = null;
            click_pos.dst = null
          } else if (Movement.length == 2) {
            $("#War").fadeIn();
          }
  
  
          Show_Moves(gungi, $(this).attr("name"), click_pos)
        }
        // --------------------------------------------------------
        break;


      default:
        console.log("You have a strange Mouse!");
        break;
    }
  }
  if (gungi.in_check()['b'] || gungi.in_check()['w']) {
    Check(gungi.in_check()['b'] ? 'b' : 'w');
    Check(gungi.in_check()['w'] ? 'w' : 'b');
  }
  // console.log(gungi.state)
  // console.log(gungi.in_check())
  if (gungi.in_checkmate() && $('#r-2').css('opacity') != .6) {
    CheckMate(Constants.MARSHAL, gungi.turn, 1)
  }
});