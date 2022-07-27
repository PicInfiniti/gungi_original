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

  $('#as-b').text(gungi.get_army_size('b'));
  if (gungi.get_army_size('b') == 26) {
    $("#b-army").css({
      'color': 'red'
    })
  } else {
    $("#b-army").css({
      'color': 'rgb(75, 0, 126)'
    })
  }

  $('#as-w').text(gungi.get_army_size('w'));
  if (gungi.get_army_size('w') == 26) {
    $("#w-army").css({
      'color': 'red'
    })
  } else {
    $("#w-army").css({
      'color': 'rgb(75, 0, 126)'
    })
  }
}

function Put_Pieces(e, type, color, tier) {
  $(e).css({
    "color": tier_color[tier - 1],
    "border-radius": "50px",
    "outline": color == "b" ? "10px #171716 solid" : "10px #d1d1d1 solid",
    "outline-offset": "-10px"
  });
  $(e).text(type);
}


function Remove_Pieces(e, type = '*', color = "white") {
  $(e).css({
    "color": color,
    "border-radius": "5px",
    "outline": "0px #999999 solid",
    "outline-offset": "0px"
  });
  $(e).text(type);
}

function Movement_Possibility(src, dst) {
  Possibility = gungi.moves({
    square: src
  })
  return Possibility.filter(Move => Move.dst == dst)
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

function print(x) {
  console.log(x);
}

function Update_Game(Move = {
  src: {
    type: gungi.MARSHAL,
    color: gungi.BLACK
  },
  dst: '7-2',
  type: gungi.PLACE
}) {
  res = gungi.move(Move);
  turn_update();
  if (res) {
    switch (Move.type) {
      case gungi.PLACE:
        Reset_Sections();
        update_board();
        if (Move.src.color == gungi.BLACK) {
          temp = $("#bs-" + Move.src.type).find("sub").text() - 1
          $("#bs-" + Move.src.type).find("sub").text(temp)
          Select_Square("#ws-" + Move.src.type, '#fc9803')

        } else {
          temp = $("#ws-" + Move.src.type).find("sub").text() - 1
          $("#ws-" + Move.src.type).find("sub").text(temp)
          Select_Square("#bs-" + Move.src.type, '#fc9803')
        }

        if (gungi.get_top(Move.dst).piece.type == gungi.MARSHAL) {
          Marshal[gungi.get_top(Move.dst).piece.color] = Move.dst
        }

        if (gungi.in_check()) {
          Check()
        }

        break;

      case gungi.MOVEMENT:
        update_board();
        if (gungi.get_top(Move.dst).piece.type == gungi.MARSHAL) {
          Marshal[gungi.get_top(Move.dst).piece.color] = Move.dst
        }

        if (gungi.in_check()) {
          Check();
        }
        break;

      case gungi.STACK:
        update_board();
        if (gungi.get_top(Move.dst).piece.type == gungi.MARSHAL) {
          Marshal[gungi.get_top(Move.dst).piece.color] = Move.dst
        }

        if (gungi.in_check()) {
          Check();
        }
        break;

      case gungi.ATTACK:
        update_board();
        temp = gungi.get_history();
        temp = temp[temp.length - 1]
        if (temp.dstPiece.color == gungi.BLACK) {
          num = Number($("#bc-" + temp.dstPiece.type).find("sub").text()) + 1
          $("#bc-" + temp.dstPiece.type).find("sub").text(num)
          Select_Square("#bc-" + temp.dstPiece.type, '#000000')

        } else {
          num = Number($("#wc-" + temp.dstPiece.type).find("sub").text()) + 1
          $("#wc-" + temp.dstPiece.type).find("sub").text(num)
          Select_Square("#wc-" + temp.dstPiece.type, '#000000')
        }

        if (gungi.get_top(Move.dst).piece.type == gungi.MARSHAL) {
          Marshal[gungi.get_top(Move.dst).piece.color] = Move.dst
        }

        if (gungi.in_check()) {
          Check()
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
          Remove_Pieces('#b-' + (9 - x) + '-' + (y + 1))
          return false;

        } else if (piece == null && z > 0) {
          return false

        } else {
          Put_Pieces('#b-' + (9 - x) + '-' + (y + 1), piece.type, piece.color, z + 1);
        }

      });
    });
  });
}

function update_tier(pos) {
  $.each(gungi.get(pos), function (index, item) {
    if (item) {
      Put_Pieces("#t-" + index, item.type, item.color, index + 1)
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
  Put_Pieces('#b-' + Marshal[gungi.turn], gungi.MARSHAL, gungi.turn, 4);
  $('#b-' + Marshal[gungi.turn]).css({
    "border": "1px solid red",
    "box-shadow": "0px 0px 5px 1px red"
  }); // change color of current box
}