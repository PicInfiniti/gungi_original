function turn_update() {
  if (gungi.turn == "b") {
    $("#PB").css({
      'box-shadow': '0px 0px 10px 3px #ad00ad'
    })
    $("#PW").css({
      'box-shadow': '0px 0px 0px 0px #d1d1d1'
    })

  } else {
    $("#PW").css({
      'box-shadow': '0px 0px 10px 3px #ad00ad'
    })
    $("#PB").css({
      'box-shadow': '0px 0px 0px 0px #d1d1d1'
    })
  }

  $('#as-b').text(gungi.army_size['b']);
  if (gungi.army_size['b'] == 26) {
    $("#b-army").css({
      'color': 'red'
    })
  } else {
    $("#b-army").css({
      'color': 'rgb(75, 0, 126)'
    })
  }

  $('#as-w').text(gungi.army_size['w']);
  if (gungi.army_size['w'] == 26) {
    $("#w-army").css({
      'color': 'red'
    })
  } else {
    $("#w-army").css({
      'color': 'rgb(75, 0, 126)'
    })
  }
}

Put_Pieces = (e, type, color, tier) => {
  $(e).css({
    "color": tier_color[tier - 1],
    "border-radius": "50px",
    "outline": color == "b" ? "10px #171716 solid" : "10px #d1d1d1 solid",
    "outline-offset": "-10px",
    "background-color": "white"
  });
  $(e).text(type);
}


function Remove_Pieces(e, type = '*', color = "white") {
  $(e).css({
    "color": '#ffcf9e00',
    "border-radius": "5px",
    "outline": "0px #999999 solid",
    "outline-offset": "0px",
    // "background-color": "#ffcf9e"
  });
  $(e).text(type);
}

function Movement_Possibility(src, dst) {
  let piece = gungi.get_top(src) 
  Possibility = gungi.moves(piece)
  return Possibility.filter(move => move.dst == dst)
}

function Reset_Sections(e = [".box", ".tier", ".stockpile", ".captured"]) {
  $.each(e, function (index, item) {
    $(item).css({
      "border": "1px solid #999999",
      "box-shadow": "0px 0px 0px 0px #999999"
    }); // change color of all boxes
  });
  $("#War").fadeOut();
  WAR = null;
}

function Select_Square(e, color) {
  $(e).css({
    "border": "1px solid " + color,
    "box-shadow": "0px 0px 5px 1px " + color
  }); // change color of current box
}

function Stockpile_update(color) {
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


function Update_Game(Move = {piece:null, dst:null, type:constant.PLACE}) {
  res = gungi.move(Move);
  turn_update();
  if (res) {
    switch (Move.type) {
      case gungi.PLACE:
        Reset_Sections();
        update_board();
        
        if (Move.piece.color == gungi.BLACK) {
          
          temp = $("#bs-" + Move.piece.symbol).find("sub").text() - 1
          $("#bs-" + Move.piece.symbol).find("sub").text(temp)
          Select_Square("#ws-" + Move.piece.symbol, '#fc9803')

        } else {
          temp = $("#ws-" + Move.piece.symbol).find("sub").text() - 1
          $("#ws-" + Move.piece.symbol).find("sub").text(temp)
          Select_Square("#bs-" + Move.piece.symbol, '#fc9803')
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
        temp = gungi.captured;
        temp = temp[temp.length - 1]
        if (temp.color == gungi.BLACK) {
          num = Number($("#bc-" + temp.symbol).find("sub").text()) + 1
          $("#bc-" + temp.symbol).find("sub").text(num)
          Select_Square("#bc-" + temp.symbol, '#000000')

        } else {
          num = Number($("#wc-" + temp.symbol).find("sub").text()) + 1
          $("#wc-" + temp.symbol).find("sub").text(num)
          Select_Square("#wc-" + temp.symbol, '#000000')
        }


        break;
    }
    return res;
  }
}

function update_board() {
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
  if (gungi.in_check()[gungi.turn]) {
    Check();
  }
}

function update_tier(pos) {
  let item = gungi.get(pos) 
  $.each(item, function (index, item) {
    if (item) {
      Put_Pieces("#t-" + index, item.symbol, item.color, index + 1)
    } else {
      Remove_Pieces("#t-" + index)
    }
  });
}

function saveText(text, filename) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}

function Check(){
  let piece = gungi.marshals[gungi.turn]
  $('#b-' + piece.src).css({
    "border": "1px solid red",
    "box-shadow": "0px 0px 5px 1px red",
    "color": "red"
  }); // change color of current box
}

Show_Moves = (gungi, tag)=>{
  Moves = gungi.moves(gungi.get_top())
  if (Moves.length > 0) {
    $.each(Moves, function (_, item) {
      if (item.type == 'move') {
        $('#m-' + item.dst).css({
          "border": "1px solid #009699",
          "box-shadow": "0px 0px 5px 1px #009699",
        });
      } else {
        $('#m-' + item.dst).css({
          "border": "1px solid red",
          "box-shadow": "0px 0px 5px 1px red"
        });
      }

    });
  }
}

function load_history(history) {
  var interval = 500;
  history.forEach(function (el, index) {
    setTimeout(function () {
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