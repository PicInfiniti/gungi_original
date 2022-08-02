class Desk {
  constructor(constant) {
    // constants +++++++++++++++++++++++++++++++++
    this.BLACK = 'b'
    this.WHITE = 'w'
    this.DRAFT = 'draft'
    this.GAME = 'game'
    this.ATTACK = 'attack'
    this.MOVEMENT = 'move'
    this.STACK = 'stack'
    this.PLACE = 'place'
    this.READY = 'ready'
    this.MAJOR_GENERAL = '小'
    this.LIEUTENANT = '中'
    this.GENERAL = '大'
    this.ARCHER = '弓'
    this.KNIGHT = '馬'
    this.MUSKETEER = '筒'
    this.CAPTAIN = '謀'
    this.SAMURAI = '侍'
    this.FORTRESS = '砦'
    this.CANNON = '砲'
    this.SPY = '忍'
    this.PAWN = '兵'
    this.MARSHAL = '帥'
    this.TIER1_WHITE = '一'
    this.TIER2_WHITE = '二'
    this.TIER3_WHITE = '三'
    this.TIER1_BLACK = '壱'
    this.TIER2_BLACK = '弐'
    this.TIER3_BLACK = '参'
    this.ROW = 9
    this.COLUMN = 9

    // -----------------------------------------
    this.board = this.board_generator(this.ROW, this.COLUMN)
    this.board_1D = []
    this.board_temp;
    this.phase = this.DRAFT
    this.turn = this.BLACK
    this.marshals = {
      b: new Marshal('b'),
      w: new Marshal('w')
    }
    this.stockpiles = {
      b: this.stockpile_generator(this.BLACK),
      w: this.stockpile_generator(this.WHITE)
    }
    this.captured = []
    this.state = {
      b: this.DRAFT,
      w: this.DRAFT
    } // in_check || in_checkmate || draft || game || ?

    this.army_size = {
      b: 0,
      w: 0
    }

    // territory 
    this.territory = {
      'b': [],
      'w': []
    }

    // move number
    this.count = 0

    //history
    this.history = []

  }

  get = (pos) => {
    if (pos) {
      let x = Number(pos.split('-')[0]);
      let y = Number(pos.split('-')[1])
      return this.board[x][y];
    } else {
      return []
    }
  }

  get_top = (item) => {
    item = this.get(item);
    return this.get_array_top(item)
  }

  get_array_top = (array) => {
    for (let i = array.length; i >= 0; i--) {
      if (array[i]) {
        return array[i]
      }
    }
    return null;
  }
  //------------------------------
  moves = (piece) => {
    if (piece) {
      return piece.Possible_moves(this.board).filter((move) => {
        return this.legal_moves(move)
      })

    } else {
      return []
    }
  }

  move = (Move) => { // piece is an object
    if (this.moves(Move.piece).filter((move) => {
        return Dict_Compare(move, Move)
      }).length == 1) {
      let top, x, y, index;

      switch (Move.type) {
        case gungi.PLACE:
          top = this.get_top(Move.dst); // get top piece of destination
          if ((!top || (top.tier < 3)) &&
            this.stockpiles[Move.piece.color][Move.piece.name].length > 0
          ) { // if its not empty an less than 3 piece and have possible move there you can place

            // add to history -----------------------
            this.history.push({
              Num: this.count,
              move: {
                piece: {
                  symbol: Move.piece.symbol,
                  color: Move.piece.color,
                  name: Move.piece.name,
                  src: null
                },
                dst: Move.dst,
                type: gungi.PLACE
              }
            })
            // --------------------------

            Move.piece.tier = top ? top.tier + 1 : 1; // set tier for placed piece
            Move.piece.src = Move.dst; // update piece position
            this.board_1D.push(Move.piece)
            this.update_turn() // update game turn
            this.count++;

            // put piece on board desireable position
            x = Number(Move.dst.split('-')[0]);
            y = Number(Move.dst.split('-')[1])
            this.board[x][y][Move.piece.tier - 1] = Move.piece

            // update army size
            this.army_size[Move.piece.color]++;

            // remove from stockpile
            this.stockpiles[Move.piece.color][Move.piece.name].shift();

            // update territory
            this.territory = this.update_territory(this.board)
            return {
              piece: Move.piece,
              dst: Move.dst,
              type: this.PLACE
            }
          } else {
            return null;
          }

          case gungi.MOVEMENT:
            x = Number(Move.piece.src.split('-')[0]);
            y = Number(Move.piece.src.split('-')[1])

            index = this.board[x][y].indexOf(Move.piece)
            this.board[x][y][index] = null

            // add to history -----------------------------
            this.history.push({
              Num: this.count,
              move: {
                piece: {
                  symbol: Move.piece.symbol,
                  color: Move.piece.color,
                  name: Move.piece.name,
                  src: Move.piece.src
                },
                dst: Move.dst,
                type: gungi.MOVEMENT
              }
            })

            // ---------------------------
            Move.piece.tier = 1; // set tier for placed piece
            Move.piece.src = Move.dst; // update piece position
            this.update_turn() // update game turn
            this.count++;

            // put piece on board desireable position
            x = Number(Move.dst.split('-')[0]);
            y = Number(Move.dst.split('-')[1])
            this.board[x][y][Move.piece.tier - 1] = Move.piece

            // update territory
            this.territory = this.update_territory(this.board)
            return {
              piece: Move.piece,
                dst: Move.dst,
                type: Move.type
            }
            break;


          case gungi.STACK:
            top = this.get_top(Move.dst); // get top piece of destination

            x = Number(Move.piece.src.split('-')[0]);
            y = Number(Move.piece.src.split('-')[1])
            index = this.board[x][y].indexOf(Move.piece)
            this.board[x][y][index] = null

            // add to history ------------------------
            this.history.push({
              Num: this.count,
              move: {
                piece: {
                  symbol: Move.piece.symbol,
                  color: Move.piece.color,
                  name: Move.piece.name,
                  src: Move.piece.src
                },
                dst: Move.dst,
                type: this.STACK
              }
            })
            //-------------------------

            Move.piece.tier = top.tier + 1; // set tier for placed piece
            Move.piece.src = Move.dst; // update piece position
            this.update_turn() // update game turn
            this.count++;


            // put piece on board desireable position
            x = Number(Move.dst.split('-')[0]);
            y = Number(Move.dst.split('-')[1])
            this.board[x][y][Move.piece.tier - 1] = Move.piece

            // update territory
            this.territory = this.update_territory(this.board)
            return {
              piece: Move.piece,
                dst: Move.dst,
                type: this.STACK
            };
            break

          case gungi.ATTACK:
            // get top piece of destination -----------------------------
            top = this.get_top(Move.dst);

            // remove piece from current place -----------------------------
            x = Number(Move.piece.src.split('-')[0]);
            y = Number(Move.piece.src.split('-')[1])
            index = this.board[x][y].indexOf(Move.piece)
            this.board[x][y][index] = null

            // add to history -----------------------------
            this.history.push({
              Num: this.count,
              move: {
                piece: {
                  symbol: Move.piece.symbol,
                  color: Move.piece.color,
                  name: Move.piece.name,
                  src: Move.piece.src
                },
                dst: Move.dst,
                type: gungi.ATTACK
              }
            })
            // -----------------------------

            Move.piece.tier = top.tier; // set tier for placed piece
            Move.piece.src = Move.dst; // update piece position
            this.update_turn() // update game turn
            this.count++;

            // put piece on board desireable position
            x = Number(Move.dst.split('-')[0]);
            y = Number(Move.dst.split('-')[1])
            this.board[x][y][Move.piece.tier - 1] = Move.piece

            // capchred
            top.tier = -1
            this.captured.push(top)
            this.board_1D.splice(this.board_1D.indexOf(top), 1)

            // update territory
            this.territory = this.update_territory(this.board)
            return {
              piece: Move.piece,
                dst: Move.dst,
                type: this.ATTACK
            }
            break;
      }
    } else if (
      Move.type == 'ready' &&
      this.marshals.b.src &&
      this.marshals.w.src &&
      this.state[this.turn] == 'draft'
    ) {
      this.state[this.turn] = 'game';
      this.update_turn();
      this.count++;
      this.history.push({
        Num: this.count,
        move: {
          piece: null,
          dst: null,
          type: gungi.READY
        }
      })
      if (this.state.b == 'game' && this.state.w == 'game') {
        this.phase = 'game'
        this.turn = 'w'
      }

      console.log(this.phase)
      return Move

    } else {
      return null
    }
  }


  update_turn = () => {
    if (this.state.b == this.state.w) {
      this.turn = this.turn == 'b' ? 'w' : 'b'
    } else if (this.state.b == 'draft') {
      this.turn = 'b'
    } else {
      this.turn = 'w'
    }
  }
  // util functions --------------------------------------------
  board_generator = (row, column) => {
    let board = []
    for (let r = 0; r < row; r++) {
      let temp = []
      for (let c = 0; c < column; c++) {
        temp.push([null, null, null])
      }
      board.push(temp)
    }
    return board;
  }

  stockpile_generator = (color = null) => {
    let stockpile = {
      marshal: [this.marshals[color]],
      pawn: [],
      general: [],
      spy: [new Spy(color), new Spy(color)],
      cannon: [new Cannon(color), new Cannon(color)],
      fortress: [new Fortress(color), new Fortress(color)],
      samurai: [new Samurai(color), new Samurai(color)],
      captain: [new Captain(color)],
      musketeer: [new Musketeer(color)],
      knight: [new Knight(color), new Knight(color)],
      archer: [new Archer(color), new Archer(color)],
      general: [],
      lieutenant: [new Lieutenant(color), new Lieutenant(color), new Lieutenant(color), new Lieutenant(color)],
      minor_general: [new Minor_General(color), new Minor_General(color), new Minor_General(color), new Minor_General(color)]
    };


    for (let i = 0; i < 9; i++) {
      stockpile.pawn.push(new Pawn(color))
    }

    for (let i = 0; i < 6; i++) {
      stockpile.general.push(new General(color))
    }

    return stockpile;
  }


  // update territory
  update_territory = (board) => {
    let territory = {
      'b': [],
      'w': []
    };
    let piece;
    board.forEach((row, r) => {
      row.forEach((column, c) => {
        piece = this.get_array_top(column);
        if (piece) {
          territory[piece.color] = territory[piece.color].concat(piece.Possible_moves(board))
        }
      })
    })
    territory.b = territory.b.map((move) => {
      return move.dst
    })
    territory.w = territory.w.map((move) => {
      return move.dst
    })

    return territory;
  }

  marshal_neighborhood = (marshal, dst) => {
    if (marshal.Possible_moves(this.board).filter((move) => {
        return move.dst == dst
      }).length > 0) {
      return true
    } else {
      return false
    }
  }

  in_check = (board = this.board) => {
    let territory = this.update_territory(board)
    let check = {
      'b': territory.w.indexOf(this.marshals.b.src) != -1,
      'w': territory.b.indexOf(this.marshals.w.src) != -1
    }
    return check
  }

  in_checkmate = (board = this.board) => {
    return this.in_check(board) && this.in_stalemate(board)
  }

  in_stalemate = (board = this.board) => {
    let possible_moves = []
    let temp;

    temp = this.board_1D.filter((piece) => {
      return (piece.color == this.turn && this.get_top(piece.src) == piece)
    })

    temp.forEach((piece, _) => {
      possible_moves = possible_moves.concat(this.moves(piece))
    })

    for (let Piece in this.stockpiles[this.turn]) {
      this.stockpiles[this.turn][Piece].forEach((piece, _) => {
        possible_moves = possible_moves.concat(this.moves(piece))
      })
    }
    return possible_moves.length == 0
  }
  // game rules
  legal_moves = (move) => {
    let temp_src, temp_tier, temp_top, pawns, pawns_y;
    let legal = [move.piece.color == this.turn]; // check turn
    let opposite = this.marshals[move.piece.color == 'b' ? 'w' : 'b']
    let x = Number(move.dst.split('-')[0])
    let y = Number(move.dst.split('-')[1])
    if (move.piece.name == 'marshal') {
      legal.push(!this.marshal_neighborhood(opposite, move.dst)) // check distance of two marshal
      legal.push(this.territory[opposite.color].indexOf(move.dst) == -1) // forbid marshal to go in opponent territory
    }

    if (move.piece.name == 'pawn' && move.type == 'place') {
      pawns = this.board_1D.filter((piece) => {
        return piece.name == 'pawn' && piece.color == move.piece.color
      })
      pawns_y = pawns.map((pawn) => {
        return pawn.src.split('-')[1]
      })

      legal.push(pawns_y.indexOf(move.dst.split('-')[1]) == -1)
    }

    if (move.piece.name == 'fortress' && move.type == 'stack') {
      legal.push(false)
    }
    if (move.piece.name == 'fortress' && move.type == 'place' && this.get_top(move.dst)) {
      legal.push(false)
    }

    if (this.state[move.piece.color] == 'draft') {
      if (move.piece.color == 'b') {
        legal.push(x < 3)
      } else {
        legal.push(x > 5)
      }
    }
    if (this.phase == 'draft') {
      legal.push(move.type == 'place')
    }

    // fake move -------------------
    switch (move.type) {
      case 'place':
        temp_top = this.get_top(move.dst)
        move.piece.src = move.dst
        move.piece.tier = temp_top ? temp_top.tier + 1 : 1
        this.board_1D.push(move.piece)
        // ------------------------------------------------------------
        this.board_temp = this.D1_to_3d()
        legal.push(!this.in_check(this.board_temp)[move.piece.color])
        // ------------------------------------------------------------
        move.piece.src = null
        move.piece.tier = 0
        this.board_1D.splice(this.board_1D.indexOf(move.piece), 1)

        break;

      case 'move':
        temp_src = move.piece.src;
        temp_tier = move.piece.tier
        // ------------------------------------------------------------
        move.piece.src = move.dst
        move.piece.tier = 1
        // ------------------------------------------------------------
        this.board_temp = this.D1_to_3d()
        legal.push(!this.in_check(this.board_temp)[move.piece.color])
        // ------------------------------------------------------------
        move.piece.src = temp_src
        move.piece.tier = temp_tier

        break;

      case 'stack':
        temp_top = this.get_top(move.dst)
        temp_src = move.piece.src;
        temp_tier = move.piece.tier
        // ------------------------------------------------------------
        move.piece.src = move.dst
        move.piece.tier = temp_top.tier + 1
        // ------------------------------------------------------------
        this.board_temp = this.D1_to_3d()
        legal.push(!this.in_check(this.board_temp)[move.piece.color])
        // ------------------------------------------------------------
        move.piece.src = temp_src
        move.piece.tier = temp_tier

        break;

      case 'attack':
        temp_top = this.get_top(move.dst)
        temp_src = move.piece.src;
        temp_tier = move.piece.tier
        // ------------------------------------------------------------
        move.piece.src = move.dst
        move.piece.tier = temp_top.tier
        this.board_1D.splice(this.board_1D.indexOf(temp_top), 1)
        // ------------------------------------------------------------
        this.board_temp = this.D1_to_3d()
        legal.push(!this.in_check(this.board_temp)[move.piece.color])
        // ------------------------------------------------------------
        move.piece.src = temp_src
        move.piece.tier = temp_tier
        this.board_1D.push(temp_top)

        break;
    }

    // console.log(legal)
    return legal.indexOf(false) == -1
  }

  D1_to_3d = () => {
    let board = this.board_generator(this.ROW, this.COLUMN)
    this.board_1D.forEach((piece) => {
      let x = Number(piece.src.split('-')[0])
      let y = Number(piece.src.split('-')[1])
      board[x][y][piece.tier - 1] = piece
    })
    return board
  }
}

Dict_Compare = (d1, d2) => {
  for (i in d1) {
    if (d1[i] != d2[i]) {
      return false
    }
  }
  return true
}