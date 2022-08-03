export class Marshal {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'marshal'
    this.symbol = '帥'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      default:
        return point_generator(this, board)
    }
  }

}

export class Pawn {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'pawn'
    this.symbol = '兵'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, 0]
        ])
      case 2:
        return point_generator(this, board, [
          [1, 0],
          [1, 1],
          [1, -1]
        ])
      case 3:
        return point_generator(this, board, [
          [1, 0],
          [1, 1],
          [1, -1]
        ])

      default:
        return null;

    }
  }

}

export class Spy {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'spy'
    this.symbol = '忍'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, 0]
        ])
      case 2:
        return point_generator(this, board, [
          [1, -1],
          [1, 1],
          [-1, -1],
          [-1, 1]
        ])
      case 3:
        return path_generator(this, board, ['East', 'North', 'NE', 'SE'])

      default:
        return null;

    }
  }

}

export class Cannon {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'cannon'
    this.symbol = '砲'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, 0],
          [-1, 0],
          [0, -1],
          [0, 1]
        ])
      case 2:
        return short_path(this, board)
      case 3:
        return path_generator(this, board, ['East', 'North'])

      default:
        return null;

    }
  }

}

export class Fortress {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'fortress'
    this.symbol = '砦'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      default:
        return point_generator(this, board)
    }
  }

}

export class Samurai {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'samurai'
    this.symbol = '侍'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, -1],
          [1, 1],
          [-1, -1],
          [-1, 1]
        ])
      case 2:
        return point_generator(this, board, [
          [2, -2],
          [2, 2],
          [-2, -2],
          [-2, 2]
        ])
      case 3:
        return path_generator(this, board, ['NE', 'SE'])

      default:
        return null;

    }
  }

}

export class Captain {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'captain'
    this.symbol = '謀'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board)

      default:
        let x = this.src.split('-')[0]
        let y = this.src.split('-')[1]
        let top = board[x][y][this.tier - 2]
        if (top.name == this.name) {
          if (this.tier == 3) {
            top = board[x][y][this.tier - 3]
            let temp_piece = new top.constructor(this.color, this.tier, this.src)
            let moves = temp_piece.Possible_moves(board)
            moves = moves.map((move) => {
              return {
                piece: this,
                dst: move.dst,
                type: move.type
              }
            })
            return moves
          } else {
            return point_generator(this, board)
          }

        } else {
          let temp_piece = new top.constructor(this.color, this.tier, this.src)
          let moves = temp_piece.Possible_moves(board)
          moves = moves.map((move) => {
            return {
              piece: this,
              dst: move.dst,
              type: move.type
            }
          })
          return moves
        }
    }
  }
}

export class Musketeer {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'musketeer'
    this.symbol = '筒'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, 0],
        ])
      case 2:
        return short_path(this, board, [this.color == 'w' ? 'North' : 'South'])
      case 3:
        return short_path(this, board, [this.color == 'w' ? 'North' : 'South'], 8)

      default:
        return null;

    }
  }

}

export class Knight {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'knight'
    this.symbol = '馬'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [0, -1],
          [0, 1],
          [2, 1],
          [2, -1]
        ])
      case 2:
        return point_generator(this, board, [
          [1, 2],
          [1, -2],
          [2, 1],
          [2, -1]
        ])
      case 3:
        return point_generator(this, board, [
          [1, 2],
          [1, -2],
          [2, 1],
          [2, -1],
          [-1, 2],
          [-1, -2],
          [-2, 1],
          [-2, -1]
        ])

      default:
        return null;

    }
  }

}

export class Archer {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'archer'
    this.symbol = '弓'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board)
      case 2:
        return point_generator(this, board, [
            [-2, -2],
            [-2, -1],
            [-2, 0],
            [-2, 1],
            [-2, 2],
            [-1, -2],
            [-1, 2],
            [0, -2],
            [0, 2],
            [1, -2],
            [1, 2],
            [2, -2],
            [2, -1],
            [2, 0],
            [2, 1],
            [2, 2]
          ]


        )
      case 3:
        return point_generator(this, board, [
          [-3, -3],
          [-3, -2],
          [-3, -1],
          [-3, 0],
          [-3, 1],
          [-3, 2],
          [-3, 3],
          [-2, -3],
          [-2, 3],
          [-1, -3],
          [-1, 3],
          [0, -3],
          [0, 3],
          [1, -3],
          [1, 3],
          [2, -3],
          [2, 3],
          [3, -3],
          [3, -2],
          [3, -1],
          [3, 0],
          [3, 1],
          [3, 2],
          [3, 3]
        ])

      default:
        return null;

    }
  }

}

export class General {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'general'
    this.symbol = '大'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, -1],
          [1, 0],
          [1, 1],
          [-1, 0],
          [0, -1],
          [0, 1]
        ])
      case 2:
        return point_generator(this, board)
      case 3:
        return general_moves(this, board)

      default:
        return null;

    }
  }


}

export class Lieutenant {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'lieutenant'
    this.symbol = '中'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, -1],
          [1, 0],
          [1, 1],
          [-1, -1],
          [-1, 1]
        ])
      case 2:
        return point_generator(this, board, [
          [1, -1],
          [1, 0],
          [1, 1],
          [-1, -1],
          [-1, 0],
          [-1, 1]
        ])
      case 3:
        return point_generator(this, board)

      default:
        return null;

    }
  }

}

export class Minor_General {
  constructor(color, tier = 0, src = null) {
    this.color = color
    this.name = 'minor_general'
    this.symbol = '小'
    this.tier = tier
    this.src = src
  }

  Possible_moves = (board) => {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return point_generator(this, board, [
          [1, -1],
          [1, 1],
        ])
      case 2:
        return point_generator(this, board, [
          [1, -1],
          [1, 0],
          [1, 1],
          [-1, -1],
          [-1, 1]
        ])
      case 3:
        return point_generator(this, board, [
          [1, -1],
          [1, 0],
          [1, 1],
          [-1, 0],
          [0, -1],
          [0, 1]
        ])

      default:
        return null;

    }
  }

}

// related functions
function path_generator(piece, board, direction = ['East']) {
  let path = []
  src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }

  direction.forEach((d) => {
    switch (d) {
      case 'East':
        for (let y = src.y + 1; y < 9; y++) {
          if (board[src.x][y][0]) {
            let temp = get_array_top(board[src.x][y])
            path = path.concat(movment_limitation(piece, temp, src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }

        for (let y = src.y - 1; y >= 0; y--) {
          if (board[src.x][y][0]) {
            let temp = get_array_top(board[src.x][y])
            path = path.concat(movment_limitation(piece, temp, src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }
        break;

      case 'North':
        for (let x = src.x + 1; x < 9; x++) {
          if (board[x][src.y][0]) {
            let temp = get_array_top(board[x][src.y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }

        for (let x = src.x - 1; x >= 0; x--) {
          if (board[x][src.y][0]) {
            let temp = get_array_top(board[x][src.y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }
        break;


      case 'NE':
        for (x = src.x + 1, y = src.y + 1; x < 9 && y < 9; x++, y++) {
          if (board[x][y][0]) {
            let temp = get_array_top(board[x][y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }

        for (x = src.x - 1, y = src.y - 1; x >= 0 && y >= 0; x--, y--) {
          if (board[x][y][0]) {
            let temp = get_array_top(board[x][y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + y))
            break
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }

        break;



      case 'SE':
        for (x = src.x + 1, y = src.y - 1; x < 9 && y >= 0; x++, y--) {
          if (board[x][y][0]) {
            let temp = get_array_top(board[x][y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + y))
            break
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }

        for (x = src.x - 1, y = src.y + 1; x >= 0 && y < 9; x--, y++) {
          if (board[x][y][0]) {
            let temp = get_array_top(board[x][y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }
    }
  })


  return path;
}

function point_generator(piece, board, points = [
  [1, -1],
  [1, 0],
  [1, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1]
]) {
  let temp = [];
  let src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }

  points.forEach((item) => {
    let x = piece.color == 'b' ? item[0] : -item[0]
    if (
      src.x + x < 9 && src.x + x >= 0 &&
      src.y + item[1] < 9 && src.y + item[1] >= 0
    ) {
      if (board[src.x + x][src.y + item[1]][0]) {
        let top = get_array_top(board[src.x + x][src.y + item[1]])
        temp = temp.concat(movment_limitation(piece, top, (src.x + x) + '-' + (src.y + item[1])))
      } else {
        temp.push({
          piece: piece,
          dst: (src.x + x) + '-' + (src.y + item[1]),
          type: 'move'
        })
      }


    }
  })
  return temp;
}


function short_path(piece, board, direction = ['East', 'West', 'North', 'South'], limit = 2) {
  let path = []
  let src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }

  direction.forEach((d) => {
    switch (d) {
      case 'East':
        for (let y = src.y + 1; y < 9 && y <= src.y + limit; y++) {
          if (board[src.x][y][0]) {
            let temp = get_array_top(board[src.x][y])
            path = path.concat(movment_limitation(piece, temp, src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }
        break;

      case 'West':
        for (let y = src.y - 1; y >= 0 && y >= src.y - limit; y--) {
          if (board[src.x][y][0]) {
            let temp = get_array_top(board[src.x][y])
            path = path.concat(movment_limitation(piece, temp, src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }
        break;

      case 'North':
        for (let x = src.x - 1; x >= 0 && src.x - limit <= x; x--) {
          if (board[x][src.y][0]) {
            let temp = get_array_top(board[x][src.y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }
        break;

      case 'South':
        for (let x = src.x + 1; x < 9 && src.x + limit >= x; x++) {
          if (board[x][src.y][0]) {
            let temp = get_array_top(board[x][src.y])
            path = path.concat(movment_limitation(piece, temp, x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }
        break;
    }
  })


  return path;
}


function general_moves(piece, board) {
  let temp = point_generator(piece, board);
  src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }
  x = piece.color == 'b' ? 2 : -2
  for (let i = -1; i < 2; i++) {
    if (src.x + (x / 2) < 9 && src.x + (x / 2) > 0 && src.y + i < 9 && src.y + i > 0 && !board[src.x + (x / 2)][src.y + i][0]) {
      temp = temp.concat(point_generator(piece, board, [
        [2, i]
      ]))
    }
  }

  return temp;
}

function get_array_top(arr) {
  for (let i = arr.length; i >= 0; i--) {
    if (arr[i]) {
      return arr[i];
    }
  }
  return null;
}

function movment_limitation(piece, top_piece, dst) {
  if (top_piece.color === piece.color) {
    if (top_piece.name != 'marshal' && top_piece.tier != 3) {
      return [{
        piece: piece,
        dst: dst,
        type: 'stack'
      }]
    } else {
      return []
    }
  } else {
    if (top_piece.name != 'marshal' && top_piece.tier != 3) {
      return [{
        piece: piece,
        dst: dst,
        type: 'stack'
      }, {
        piece: piece,
        dst: dst,
        type: 'attack'
      }]
    } else {
      return [{
        piece: piece,
        dst: dst,
        type: 'attack'
      }]
    }
  }
}

function draft_moves(piece, board) {
  let temp = []
  let top;
  for (let r = [piece.color == 'w' ? 3 : 0]; r < [piece.color == 'w' ? 9 : 6]; r++) {
    for (let c = 0; c < 9; c++) {
      top = get_array_top(board[r][c])
      if (
        !top ||
        (top.name != 'marshal' &&
          top.tier < 3)
      ) {
        temp.push({
          piece: piece,
          dst: r + '-' + c,
          type: 'place'
        })
      }
    }
  }
  return temp
}