// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

import {
  Piece_Guid
} from './setup'

import {
  Reset_Sections,
  Select_Square,
  Show_Moves,
  Movement_Possibility,
  Update_Game
} from './utils'


var gungi;
var click_pos = {
  src: null,
  dst: null
}

$('.box').mousedown(function (event) {
  switch (event.which) {
    case 1: // grab left click
      Reset_Sections();
      Select_Square(this, 'green');

      gungi = $(this).attr("id").split('-')[0];
      click_pos.dst = $(this).attr("name");
      // --------------------------------------------------------


      let Movement = Movement_Possibility(Piece_Guid[gungi], click_pos.src, click_pos.dst)

      if (Movement.length == 1) {
        Update_Game(Piece_Guid[gungi], {
          piece: Piece_Guid[gungi].get_top(click_pos.src),
          dst: click_pos.dst,
          type: Movement[0].type
        })
        click_pos.src = null;
        click_pos.dst = null;
        Reset_Sections();
      }

      if (Show_Moves(Piece_Guid[gungi], $(this).attr("name")) > 0) {
        click_pos.src = $(this).attr("name");
      } else {
        click_pos.src = null;
        click_pos.dst = null;
      }

      break;

    default:
      console.log("You have a strange Mouse!");
      break;
  }
});