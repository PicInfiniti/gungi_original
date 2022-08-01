export default class Mini_Desk {
  constructor(tag) {
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
    this.tag = tag
    // -----------------------
    this.board = this.board_generator(this.ROW, this.COLUMN)

  }

  get = (pos) => {
    if (pos) {
      pos = pos.split('-')
      let x = Number(pos[0]);
      let y = Number(pos[1])
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
    let top, x, y, index;
    switch (Move.type) {
      case this.MOVEMENT:
        x = Number(Move.piece.src.split('-')[0]);
        y = Number(Move.piece.src.split('-')[1])

        index = this.board[x][y].indexOf(Move.piece)
        this.board[x][y][index] = null

        Move.piece.tier = 1
        Move.piece.src = Move.dst; // update piece position

        // put piece on board desireable position
        x = Number(Move.dst.split('-')[0]);
        y = Number(Move.dst.split('-')[1])
        this.board[x][y][Move.piece.tier - 1] = Move.piece

        // update territory
        return {
          piece: Move.piece,
            dst: Move.dst,
            type: Move.type
        }


        case this.STACK:
          top = this.get_top(Move.dst); // get top piece of destination

          x = Number(Move.piece.src.split('-')[0]);
          y = Number(Move.piece.src.split('-')[1])
          index = this.board[x][y].indexOf(Move.piece)
          this.board[x][y][index] = null

          Move.piece.tier = top.tier + 1; // set tier for placed piece
          Move.piece.src = Move.dst; // update piece position

          // put piece on board desireable position
          x = Number(Move.dst.split('-')[0]);
          y = Number(Move.dst.split('-')[1])
          this.board[x][y][Move.piece.tier - 1] = Move.piece


          return {
            piece: Move.piece,
              dst: Move.dst,
              type: this.STACK
          };
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


  // update territory
  update_territory = () => {
    this.territory = {
      'b': [],
      'w': []
    };
    let piece
    this.board.forEach((row, r) => {
      row.forEach((column, c) => {
        piece = this.get_array_top(column);
        if (piece) {
          this.territory[piece.color] = this.territory[piece.color].concat(piece.Possible_moves(this.board))
        }
      })
    })
  }

  legal_moves = (move) => {
    let legal = []
    if (move.piece.name == 'fortress' && move.type == 'stack') {
      legal.push(false)
    }

    // console.log(legal)
    return legal.indexOf(false) == -1
  }
}

function Dict_Compare(d1, d2) {
  for (i in d1) {
    if (d1[i] != d2[i]) {
      return false
    }
  }
  return true
}