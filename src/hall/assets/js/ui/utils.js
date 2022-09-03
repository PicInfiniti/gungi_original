// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

import {
  gungi
} from './setup'

var tier_color = ["#000000", "#8a8a8a", "#fc9803", "#cc0000"]

export function turn_update() {
  if (gungi.turn == "b") {
    $("#PB label").css({
      'box-shadow': '0px 0px 1.5vh 1.2vh #ad00ad'
    })
    $("#PW label").css({
      'box-shadow': '0px 0px 0px 0px #d1d1d1'
    })

  } else {
    $("#PW label").css({
      'box-shadow': '0px 0px 1.5vh 1.2vh #ad00ad'
    })
    $("#PB label").css({
      'box-shadow': '0px 0px 0px 0px #d1d1d1'
    })
  }

  $('#as-b').text(gungi.army_size['b']);
  if (gungi.army_size['b'] == 26) {
    $("#b-army").css({
      'color': 'red'
    })
  }
  if (gungi.army_size['b'] > 0) {
    $("#b-army").css({
      'color': 'rgb(0, 56, 24)'
    })
  }

  $('#as-w').text(gungi.army_size['w']);
  if (gungi.army_size['w'] == 26) {
    $("#w-army").css({
      'color': 'red'
    })
  }
  if (gungi.army_size['w'] > 0) {
    $("#w-army").css({
      'color': 'rgb(0, 56, 24)'
    })
  }
}

export function Put_Pieces(e, type, color, tier) {
  $(e).css({
    "color": tier_color[tier - 1],
    "border-radius": "50%",
    "outline": color == "b" ? "min(1.5vh,1.5vw) #171716 solid" : "min(1.5vh,1.5vw) #d1d1d1 solid",
    "outline-offset": "max(-1vh,-1vw)",
    "background-color": "white"
  });
  $(e).text(type);
}

export function CheckMate(type, color, tier) {
  $('#r-2').css({
    color: tier_color[tier - 1],
    "border-radius": "50%",
    outline: color == "b" ? "min(2vh,2vw) #171716 solid" : "min(2vh,2vw) #d1d1d1 solid",
    "outline-offset": "max(-1vh,-1vw)",
    opacity: 1,
    "background-color": "white"
  });
  $('#r-0').css({
    opacity: 1
    // "background-color": "white"
  });
  $('#r-4').css({
    opacity: 1
    // "background-color": "white"
  });

  if(color=='b'){
    $('#r-4 span').text('Black');
  } else {
    $('#r-4 span').text('White');
  }

  $('#r-2').text(type);

  $('#result').css({'z-index':3})
}

export function Remove_Pieces(e, type = '*', color = "white") {
  $(e).css({
    "color": '#ffcf9e00',
    "border-radius": "10%",
    "outline": "0px #999999 solid",
    "outline-offset": "0px",
    "background-color": ""
  });
  $(e).text(type);
}

export function Movement_Possibility(src, dst) {
  let piece = gungi.get_top(src)
  let Possibility = gungi.moves(piece)
  return Possibility.filter(move => move.dst == dst)
}

export function Reset_Sections(e = ["#board label", ".tier", ".stockpile", ".captured"]) {
  $.each(e, function (index, item) {
    $(item).css({
      border: "",
      "box-shadow": ""
    }); // change color of all boxes
  });
  $("#War").fadeOut();
  if($('#r-2').css('opacity')==1){
    $('#r-0').css({'opacity':.6, "background-color": "transparent"})
    $('#r-2').css({'opacity':.6})
    $('#r-4').css({'opacity':.6})
    $('#result').css({'z-index':1})
  }
  // WAR = null;
}

export function Select_Square(e, color) {
  $(e).css({
    border: ".2vh solid " + color,
    "box-shadow": "0px 0px min(1vh,1vw) min(.2vh,.2vw) " + color,
  }); // change color of current box
}

export function Stockpile_update(color) {
  Reset_Sections();
  if (color == 'b') {
    black_stockpile[stockpile_selected]--;
    $("#bs-" + stockpile_selected).find("sub").text(black_stockpile[stockpile_selected])
    Select_Square("#ws-" + stockpile_selected, '#fc9803')
  } else {
    white_stockpile[stockpile_selected]--;
    $("#ws-" + stockpile_selected).find("sub").text(white_stockpile[stockpile_selected])
    Select_Square("#bs-" + stockpile_selected, '#fc9803')
  }

  turn_update();
}


export function Update_Game(Move = {
  piece: null,
  dst: null,
  type: constant.PLACE
}) {
  let res = gungi.move(Move);
  turn_update();
  if (res) {
    switch (Move.type) {
      case gungi.PLACE:
        update_board();

        if (Move.piece.color == gungi.BLACK) {

          let temp = $(`#bs-${Move.piece.symbol} sub`).text() - 1
          $(`#bs-${Move.piece.symbol} sub`).text(temp != 0 ? temp : '')
          // Select_Square(`#ws-${Move.piece.symbol}`, '#fc9803')

        } else {
          let temp = $(`#ws-${Move.piece.symbol}`).find("sub").text() - 1
          $(`#ws-${Move.piece.symbol} sub`).text(temp != 0 ? temp : '')
          // Select_Square(`#bs-${Move.piece.symbol}`, '#fc9803')
        }

        break;

      case gungi.MOVEMENT:
        update_board();

        break;

      case gungi.STACK:
        update_board();

        break;

      case gungi.ATTACK:
        update_board();
        let temp = gungi.captured;
        temp = temp[temp.length - 1]
        if (temp.color == gungi.BLACK) {
          let num = Number($("#bc-" + temp.symbol).find("sub").text()) + 1
          $("#bc-" + temp.symbol).find("sub").text(num)
          Select_Square("#bc-" + temp.symbol, '#000000')

        } else {
          let num = Number($("#wc-" + temp.symbol).find("sub").text()) + 1
          $("#wc-" + temp.symbol).find("sub").text(num)
          Select_Square("#wc-" + temp.symbol, '#000000')
        }


        break;
    }
    return res;
  }
}

export function update_board() {
  $.each(gungi.board, function (x, row) {
    $.each(row, function (y, column) {
      $.each(column, function (z, piece) {
        if (piece == null && z == 0) {
          Remove_Pieces(`#b-${x}-${y}`)
          return false;

        } else if (piece == null && z > 0) {
          return false

        } else {
          Put_Pieces(`#b-${x}-${y}`, piece.symbol, piece.color, z + 1);
        }

      });
    });
  });
  if (gungi.in_check()['b'] || gungi.in_check()['w']) {
    Check(gungi.in_check()['b'] ? 'b' : 'w');
  }
}

export function update_tier(pos) {
  let item = gungi.get(pos)
  $.each(item, function (index, item) {
    if (item) {
      Put_Pieces("#t-" + index, item.symbol, item.color, index + 1)
    } else {
      Remove_Pieces("#t-" + index)
    }
  });
}

export function saveText(text, filename) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}

export function Check(color) {
  let piece = gungi.marshals[color]
  $('#b-' + piece.src).css({
    "border": "min(.2vh,.2vw) solid red",
    "box-shadow": "0px 0px min(1vh,1vw) min(.3vh,.3vw) red",
    "color": "red"
  }); // change color of current box
}


export function Show_Moves(gungi, tag, click_pos) {
  let Moves = gungi.moves(gungi.get_top(tag))
  if (Moves.length > 0) {
    click_pos.src = tag;
    $.each(Moves, function (_, item) {
      if (item.type == 'move') {
        $('#b-' + item.dst).css({
          "border": "min(.2vh,.2vw)solid #009699",
          "box-shadow": "0px 0px min(1vh,1vw) min(.2vh,.2vw) #009699",
        });
      } else {
        $('#b-' + item.dst).css({
          "border": "min(.2vh,.2vw) solid red",
          "box-shadow": "0px 0px min(1vh,1vw) min(.2vh,.2vw) red"
        });
      }

    });
  }
}

export function load_history(history) {
  var interval = 500;
  history.forEach(function (el, index) {
    setTimeout(function () {
      let res, piece;
      switch (el.move.type) {
        case 'place':
          piece = el.move.piece
          piece = gungi.stockpiles[piece.color][piece.name][0]
          res = Update_Game({
            piece: piece,
            dst: el.move.dst,
            type: 'place'
          });
          break

        case 'ready':
          res = Update_Game({
            piece: null,
            dst: null,
            type: 'ready'
          });
          if (gungi.phase == 'game') {
            $('#PHASE').text('Game Phase')
          }

          break

        default:
          piece = gungi.get_top(el.move.piece.src)
          res = Update_Game({
            piece: piece,
            dst: el.move.dst,
            type: el.move.type
          });
          break;

      }
    }, index * interval);
  });
}

export function Move(message) {
  let piece;
  switch (message.type) {
    case 'place':
      piece = message.piece
      piece = gungi.stockpiles[piece.color][piece.name][0]
      Update_Game({
        piece: piece,
        dst: message.dst,
        type: 'place'
      });

      break

    case 'ready':
      Update_Game({
        piece: null,
        dst: null,
        type: 'ready'
      });
      if (gungi.phase == 'game') {
        $('#PHASE').text('Game Phase')
      }

      break

    default:
      piece = gungi.get_top(message.piece.src)
      Update_Game({
        piece: piece,
        dst: message.dst,
        type: message.type
      });
  }
}