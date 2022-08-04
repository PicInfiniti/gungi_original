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
  turn_update
} from './utils'

import {
  gungi
} from './setup'

import {Constants} from '../constants'


var click_pos = {
  src: null,
  dst: null
}

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
});

$(".tier").click(function () {
  Reset_Sections();
  Select_Square(this, '#009699')

  stockpile_selected = null
  click_pos = {
    src: null,
    dst: null
  }
});

$("#ReadyButton button").click(function () {
  console.log(gungi.in_check())
  Reset_Sections();
  gungi.move({
    src: null,
    dst: null,
    type: gungi.READY
  });
  turn_update();
  if (gungi.phase == 'game') {
    $('#PHASE').text('Game Phase')
  }

  stockpile_selected = null;
  click_pos = {
    src: null,
    dst: null
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
  console.log(gungi.in_check())
  switch (event.which) {
    case 1: // grab left click
      Reset_Sections();
      Select_Square(this, 'green');
      
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


      let Moves = gungi.moves(gungi.get_top($(this).attr("name")))

      if (Moves.length > 0) {
        click_pos.src = $(this).attr("name");
        $.each(Moves, function (_, item) {
          if (item.type == 'move') {
            $('#b-' + item.dst).css({
              "border": "1px solid #009699",
              "box-shadow": "0px 0px 5px 1px #009699",
            });
          } else {
            $('#b-' + item.dst).css({
              "border": "1px solid red",
              "box-shadow": "0px 0px 5px 1px red"
            });
          }

        });
      }



      // --------------------------------------------------------
      break;


    default:
      console.log("You have a strange Mouse!");
      break;
  }
});