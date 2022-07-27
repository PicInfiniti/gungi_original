export const stockpile_move_gen_1 = {}

const get_stockpile = (stockpile, color) => {
    if (!color) {
        return stockpile;
    }
    return stockpile.filter((x) => x.piece.color === color);
};
stockpile_move_gen_1.stockpile_move_gen = (board, phase, turn, stockpile, marshal_placed, army_size) => {
    var moves = [];
    if (phase === constants_1.DRAFT) {
        if (turn === constants_1.BLACK) {
            if (marshal_placed.b === 0) {
                for (var i = constants_1.RANK_7; i <= constants_1.RANK_9; i++) {
                    for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                        moves.push({
                            src: {
                                type: constants_1.MARSHAL,
                                color: constants_1.BLACK,
                            },
                            dst: i + '-' + j,
                            type: constants_1.PLACE,
                        });
                    }
                }
            }
            else {
                moves.push({
                    src: null,
                    dst: null,
                    type: constants_1.READY,
                });
                if (army_size.b === 26) {
                    return moves;
                }
                var pieces = get_stockpile(stockpile, constants_1.BLACK)
                    .filter((x) => x.amount > 0)
                    .map((x) => x.piece);
                pieces.forEach((piece) => {
                    var _a;
                    for (var i = constants_1.RANK_7; i <= constants_1.RANK_9; i++) {
                        for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                            var dest = helper_1.get_top(board, i + '-' + j);
                            if (piece.type === constants_1.FORTRESS) {
                                if (dest === null) {
                                    moves.push({
                                        src: piece,
                                        dst: i + '-' + j,
                                        type: constants_1.PLACE,
                                    });
                                }
                            }
                            else {
                                if (!dest || (dest.tier < 3 && ((_a = dest.piece) === null || _a === void 0 ? void 0 : _a.type) !== constants_1.MARSHAL)) {
                                    if (piece.type === constants_1.PAWN) {
                                        var pawns_in_file = board
                                            .map((x) => x[j - 1])
                                            .filter((x) => x.some((item) => item !== null &&
                                            item.color === constants_1.BLACK &&
                                            item.type === constants_1.PAWN)).length;
                                        if (pawns_in_file === 0) {
                                            moves.push({
                                                src: piece,
                                                dst: i + '-' + j,
                                                type: constants_1.PLACE,
                                            });
                                        }
                                    }
                                    else {
                                        moves.push({
                                            src: piece,
                                            dst: i + '-' + j,
                                            type: constants_1.PLACE,
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        else {
            if (marshal_placed.w === 0) {
                for (var i = constants_1.RANK_1; i <= constants_1.RANK_3; i++) {
                    for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                        moves.push({
                            src: {
                                type: constants_1.MARSHAL,
                                color: constants_1.WHITE,
                            },
                            dst: i + '-' + j,
                            type: constants_1.PLACE,
                        });
                    }
                }
            }
            else {
                moves.push({
                    src: null,
                    dst: null,
                    type: constants_1.READY,
                });
                if (army_size.w === 26) {
                    return moves;
                }
                var pieces = get_stockpile(stockpile, constants_1.WHITE)
                    .filter((x) => x.amount > 0)
                    .map((x) => x.piece);
                pieces.forEach((piece) => {
                    var _a;
                    for (var i = constants_1.RANK_1; i <= constants_1.RANK_3; i++) {
                        for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                            var dest = helper_1.get_top(board, i + '-' + j);
                            if (piece.type === constants_1.FORTRESS) {
                                if (dest === null) {
                                    moves.push({
                                        src: piece,
                                        dst: i + '-' + j,
                                        type: constants_1.PLACE,
                                    });
                                }
                            }
                            else {
                                if (!dest || (dest.tier < 3 && ((_a = dest.piece) === null || _a === void 0 ? void 0 : _a.type) !== constants_1.MARSHAL)) {
                                    if (piece.type == constants_1.PAWN) {
                                        var pawns_in_file = board
                                            .map((x) => x[j - 1])
                                            .filter((x) => x.some((item) => item !== null &&
                                            item.color === constants_1.WHITE &&
                                            item.type === constants_1.PAWN)).length;
                                        if (pawns_in_file === 0) {
                                            moves.push({
                                                src: piece,
                                                dst: i + '-' + j,
                                                type: constants_1.PLACE,
                                            });
                                        }
                                    }
                                    else {
                                        moves.push({
                                            src: piece,
                                            dst: i + '-' + j,
                                            type: constants_1.PLACE,
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    else {
        if (turn === constants_1.BLACK) {
            if (army_size.b === 26) {
                return moves;
            }
            var pieces = get_stockpile(stockpile, constants_1.BLACK)
                .filter((x) => x.amount > 0)
                .map((x) => x.piece);
            pieces.forEach((piece) => {
                var _a;
                for (var i = constants_1.RANK_4; i <= constants_1.RANK_9; i++) {
                    for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                        var dest = helper_1.get_top(board, i + '-' + j);
                        if (piece.type === constants_1.FORTRESS) {
                            if (dest === null) {
                                moves.push({
                                    src: piece,
                                    dst: i + '-' + j,
                                    type: constants_1.PLACE,
                                });
                            }
                        }
                        else {
                            if (!dest || (dest.tier < 3 && ((_a = dest.piece) === null || _a === void 0 ? void 0 : _a.type) !== constants_1.MARSHAL)) {
                                if (piece.type == constants_1.PAWN) {
                                    var pawns_in_file = board
                                        .map((x) => x[j - 1])
                                        .filter((x) => x.some((item) => item !== null &&
                                        item.color === constants_1.BLACK &&
                                        item.type === constants_1.PAWN)).length;
                                    if (pawns_in_file === 0) {
                                        moves.push({
                                            src: piece,
                                            dst: i + '-' + j,
                                            type: constants_1.PLACE,
                                        });
                                    }
                                }
                                else {
                                    moves.push({
                                        src: piece,
                                        dst: i + '-' + j,
                                        type: constants_1.PLACE,
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
        else {
            if (army_size.w === 26) {
                return moves;
            }
            var pieces = get_stockpile(stockpile, constants_1.WHITE)
                .filter((x) => x.amount > 0)
                .map((x) => x.piece);
            pieces.forEach((piece) => {
                var _a;
                for (var i = constants_1.RANK_1; i <= constants_1.RANK_6; i++) {
                    for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                        var dest = helper_1.get_top(board, i + '-' + j);
                        if (piece.type === constants_1.FORTRESS) {
                            if (dest === null) {
                                moves.push({
                                    src: piece,
                                    dst: i + '-' + j,
                                    type: constants_1.PLACE,
                                });
                            }
                        }
                        else {
                            if (!dest || (dest.tier < 3 && ((_a = dest.piece) === null || _a === void 0 ? void 0 : _a.type) !== constants_1.MARSHAL)) {
                                if (piece.type == constants_1.PAWN) {
                                    var pawns_in_file = board
                                        .map((x) => x[j - 1])
                                        .filter((x) => x.some((item) => item !== null &&
                                        item.color === constants_1.WHITE &&
                                        item.type === constants_1.PAWN)).length;
                                    if (pawns_in_file === 0) {
                                        moves.push({
                                            src: piece,
                                            dst: i + '-' + j,
                                            type: constants_1.PLACE,
                                        });
                                    }
                                }
                                else {
                                    moves.push({
                                        src: piece,
                                        dst: i + '-' + j,
                                        type: constants_1.PLACE,
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    return moves;
};
