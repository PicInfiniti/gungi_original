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
  CheckMate,
  saveText,
  load_history
} from './utils'

import {
  gungi
} from './setup'

import {
  Constants
} from '../constants'

import {
  socket,
} from "../api"

var s = {
  dst: "0-0",
  piece: {
    color: "b",
    name: "marshal",
    src: "0-0",
    symbol: "帥",
    tier: 1
  },
  type: "place"
}




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

$("#result").click(function () {
  Reset_Sections();
});

$("#ReadyButton button").click(function () {
  Reset_Sections();
  if (gungi.in_check()['b'] || gungi.in_check()['w']) {
    Check(gungi.in_check()['b'] ? 'b' : 'w');
    Check(gungi.in_check()['w'] ? 'w' : 'b');
  }

  if (gungi.turn === socket.color) {
    sendMove({
      src: null,
      dst: null,
      type: gungi.READY
    })
    
    Update_Game({
      src: null,
      dst: null,
      type: gungi.READY
    });

    

    turn_update();
    if ($("#ReadyButton button").text() == 'Resign' && $('#r-2').css('opacity') != .6) {
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
  }
});

$("#Attack").click(function () {
  if (gungi.turn === socket.color) {
    sendMove({
      piece: gungi.get_top(click_pos.src),
      dst: click_pos.dst,
      type: gungi.ATTACK
    })

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
  }
});

$("#Stack").click(function () {
  if (gungi.turn === socket.color) {
    sendMove({
      piece: gungi.get_top(click_pos.src),
      dst: click_pos.dst,
      type: gungi.STACK
    })

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
  }
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
  Reset_Sections();
  if (!gungi.in_checkmate() && gungi.turn === socket.color) {
    switch (event.which) {
      case 1: // grab left click
        Select_Square(this, 'green');

        if (Click) {
          click_pos.dst = $(this).attr("name");

          if (stockpile_selected) {
            sendMove({
              piece: stockpile_selected,
              dst: click_pos.dst,
              type: Constants.PLACE
            })

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
            sendMove({
              piece: gungi.get_top(click_pos.src),
              dst: click_pos.dst,
              type: Movement[0].type
            })

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

function sendMove(res) {
  if (res) {
    if(res.type!=gungi.READY){
      socket.opponent.send({
        status: 'move',
        message: {
          piece: {
            color: res.piece.color,
            name: res.piece.name,
            symbol: res.piece.symbol,
            tier: res.piece.tier,
            src: res.piece.src,
          },
          dst: res.dst,
          type: res.type
        }
      })
    } else {
      socket.opponent.send({
        status: 'move',
        message: {
          src: null,
          dst: null,
          type: res.type
        }
      })
    }

  }
}

