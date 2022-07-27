export const helper_1 = {}

helper_1.init_stockpile = (color) => {
    return new Array({
        piece: {
            type: constants_1.MARSHAL,
            color,
        },
        amount: 1,
    }, {
        piece: {
            type: constants_1.PAWN,
            color,
        },
        amount: 9,
    }, {
        piece: {
            type: constants_1.SPY,
            color,
        },
        amount: 2,
    }, {
        piece: {
            type: constants_1.CANNON,
            color,
        },
        amount: 2,
    }, {
        piece: {
            type: constants_1.FORTRESS,
            color,
        },
        amount: 2,
    }, {
        piece: {
            type: constants_1.SAMURAI,
            color,
        },
        amount: 2,
    }, {
        piece: {
            type: constants_1.CAPTAIN,
            color,
        },
        amount: 1,
    }, {
        piece: {
            type: constants_1.MUSKETEER,
            color,
        },
        amount: 1,
    }, {
        piece: {
            type: constants_1.KNIGHT,
            color,
        },
        amount: 2,
    }, {
        piece: {
            type: constants_1.ARCHER,
            color,
        },
        amount: 2,
    }, {
        piece: {
            type: constants_1.GENERAL,
            color,
        },
        amount: 6,
    }, {
        piece: {
            type: constants_1.LIEUTENANT_GENERAL,
            color,
        },
        amount: 4,
    }, {
        piece: {
            type: constants_1.MAJOR_GENERAL,
            color,
        },
        amount: 4,
    });
};

helper_1.put = (board, piece, square) => {
    let rank = parseInt(square.split('-')[0]);
    let file = parseInt(square.split('-')[1]);
    let top = helper_1.get_top(board, square);
    let tier = top == null ? 1 : top.tier + 1;
    if (tier > 3 || !piece) {
        return null;
    }
    board[9 - rank][file - 1][tier - 1] = {
        type: piece.type,
        color: piece.color,
    };
    return {
        piece,
        tier,
    };
};

helper_1.get = (board, square) => {
    let rank = parseInt(square.split('-')[0]);
    let file = parseInt(square.split('-')[1]);
    return board[9 - rank][file - 1];
};

helper_1.get_top = (board, square) => {
    let tower = helper_1.get(board, square);
    for (let i = 2; i >= 0; i--) {
        if (tower[i] !== null) {
            return {
                piece: tower[i],
                tier: i + 1,
            };
        }
    }
    return null;
};

helper_1.remove = (board, square) => {
    let tower = helper_1.get(board, square);
    for (let i = 2; i >= 0; i--) {
        if (tower[i] !== null) {
            let temp = tower[i];
            tower[i] = null;
            return temp;
        }
    }
    return null;
};

helper_1.remove_stockpile = (stockpile, piece) => {
    var stockPiece = stockpile.find((x) => x.piece.type === piece.type && x.piece.color === piece.color);
    if (!stockPiece) {
        return null;
    }
    if (stockPiece.amount === 0) {
        return null;
    }
    stockPiece.amount--;
    return stockPiece;
};

