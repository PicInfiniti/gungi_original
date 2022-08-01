// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

const tier_color = ["#000000", "#8a8a8a", "#fc9803", "#cc0000"]

export function Put_Pieces(e, type, tier) {
  $(e).css({
    "color": tier_color[tier - 1],
    "border-radius": "50px",
    "outline": "5px #171716 solid",
    "outline-offset": "-5px"
  });
  $(e).text(type);
}


export function Remove_Pieces(e, type = '0', color = "white") {
  $(e).css({
    "color": color,
    "border-radius": "5px",
    "outline": "0px #999999 solid",
    "outline-offset": "0px"
  });
}

export function Movement_Possibility(gungi, src, dst) {
  let piece = gungi.get_top(src)
  let Possibility = gungi.moves(piece)
  return Possibility.filter(move => move.dst == dst)
}

export function Reset_Sections(e = [".box", ".tier", ".stockpile", ".captured"]) {
  $.each(e, (_, item) => {
    $(item).css({
      "border": "1px solid #999999",
      "box-shadow": "0px 0px 0px 0px #999999"
    }); // change color of all boxes
  });
}

export function Select_Square(e, color) {
  $(e).css({
    "border": "1px solid " + color,
    "box-shadow": "0px 0px 5px 1px " + color
  }); // change color of current box

}

export function Update_Game(gungi, Move) {
  let res = gungi.move(Move);
  if (res) {
    switch (Move.type) {
      case gungi.MOVEMENT:
        update_board(gungi);

        break;
      case gungi.STACK:
        update_board(gungi);
        break;
    }
    return res;
  }
}

export function update_board(gungi) {
  gungi.board.forEach((row, x) => {
    row.forEach((column, y) => {
      column.forEach((piece, z) => {
        if (piece == null && z == 0) {
          Remove_Pieces(`#${gungi.tag}-${x}-${y}`)
        } else if (piece) {
          Put_Pieces(`#${gungi.tag}-${x}-${y}`, piece.symbol, piece.tier);
        }
      })
    })
  })
}

export function Show_Moves(gungi, src) {
  let Moves = gungi.moves(gungi.get_top(src))
  if (Moves.length > 0) {
    $.each(Moves, (_, item) => {
      if (item.type == 'move') {
        $(`#${gungi.tag}-${item.dst}`).css({
          "border": "1px solid #009699",
          "box-shadow": "0px 0px 5px 1px #009699",
        });
      } else {
        $(`#${gungi.tag}-${item.dst}`).css({
          "border": "1px solid red",
          "box-shadow": "0px 0px 5px 1px red"
        });
      }

    });
  }
}

export function table(name, tag) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      $(name).append(`<label class='box boarder' type='text' id='${tag}-${i}-${j}' name='${i}-${j}'>${i}${j}</label>`)
    }
  }
}