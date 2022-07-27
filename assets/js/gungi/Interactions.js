Select_Square("#bs-" + stockpile_selected, '#fc9803')

$(".stockpile").click(function () {
  Reset_Sections();
  Select_Square(this, '#fc9803')
  stockpile_selected = $(this).attr("name");

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

$("#myButton").click(function () {
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
    src: click_pos.src,
    dst: click_pos.dst,
    type: gungi.ATTACK
  });
  $("#War").fadeOut();
  WAR = null;
});

$("#Stack").click(function () {
  Update_Game({
    src: click_pos.src,
    dst: click_pos.dst,
    type: gungi.STACK
  })
  $("#War").fadeOut();
  WAR = null;
});

$("#save").click(function () {
  saveText(JSON.stringify({
    move: gungi.get_history()
  }), "history.json");
});

$("#load").click(function () {
  $.getJSON("/assets/json/history-3.json", function (json) {
    moveNumber = 0;
    var IntervalId = setInterval(function () {
      Update_Game({
        src: json.move[moveNumber].src,
        dst: json.move[moveNumber].dst,
        type: json.move[moveNumber].type
      })
      console.log(json.move[moveNumber].type)
      console.log(Marshal)
      moveNumber++;
      if (moveNumber > json.move.length - 1) {
        clearInterval(IntervalId)
      }
    }, 500);
  });
});

$('.box').mousedown(function (event) {
  switch (event.which) {
    case 1: // grab left click
      Reset_Sections();
      Select_Square(this, 'green');

      stockpile_selected = null;
      click_pos.src = $(this).attr("name");

      update_tier(click_pos.src);

      Moves = gungi.moves({
        square: click_pos.src
      })
      if (Moves.length > 0) {
        $.each(Moves, function (index, item) {
          if (item.type == 'move') {
            $('#b-' + item.dst).css({
              "border": "1px solid #009699",
              "box-shadow": "0px 0px 5px 1px #009699"
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

    case 2:
      break;

    case 3:
      Reset_Sections([".box", ".tier"]);
      Select_Square(this, 'blue');
      click_pos.dst = $(this).attr("name");


      // Tyr for Place or Stack from stock pile
      if (stockpile_selected) {
        Update_Game({
          src: {
            type: stockpile_selected,
            color: gungi.turn
          },
          dst: click_pos.dst,
          type: gungi.PLACE
        });
        update_tier(click_pos.dst);
        break;
      }

      // Try Move from main board
      Movement = Movement_Possibility(click_pos.src, click_pos.dst)
      if (Movement.length == 1) {
        Update_Game(Movement[0])

      } else if (Movement.length == 2) {
        $("#War").fadeIn();
      }

      update_tier(click_pos.dst);
      break;

    default:
      console.log("You have a strange Mouse!");
      break;
  }
});