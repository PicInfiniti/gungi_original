export const move_gen_1 = {}

move_gen_1.get_squares_around = (square, ignore_list) => {
    let squares = [];
    let rank = parseInt(square.split('-')[0]);
    let file = parseInt(square.split('-')[1]);
    for (let i = rank - 1; i <= rank + 1; i++) {
        for (let j = file - 1; j <= file + 1; j++) {
            let valid_square = !move_gen_1.isSquareOutOfBounds(i, j);
            ignore_list.forEach((item) => {
                valid_square =
                    valid_square &&
                        (i != rank + item.rank_offset || j != file + item.file_offset);
            });
            if (valid_square) {
                squares.push({
                    rank: i,
                    file: j,
                });
            }
        }
    }
    return squares;
};

move_gen_1.isSquareOutOfBounds = (rank, file) => {
    return (isNaN(rank) ||
        isNaN(file) ||
        rank < constants_1.RANK_1 ||
        rank > constants_1.RANK_9 ||
        file < constants_1.FILE_1 ||
        file > constants_1.FILE_9);
};

move_gen_1.probe_directions = (board, square, depth, directions) => {
    let rank = parseInt(square.split('-')[0]);
    let file = parseInt(square.split('-')[1]);
    let squares = [];
    let found = Array(8).fill(false);
    let probes = Array(8).fill(null);
    for (let i = 1; i <= depth; i++) {
        probes.splice(0, 0, {
            rank: rank,
            file: file + i,
        });
        probes.splice(1, 0, {
            rank: rank,
            file: file - i,
        });
        probes.splice(2, 0, {
            rank: rank + i,
            file: file,
        });
        probes.splice(3, 0, {
            rank: rank - i,
            file: file,
        });
        probes.splice(4, 0, {
            rank: rank + i,
            file: file + i,
        });
        probes.splice(5, 0, {
            rank: rank + i,
            file: file - i,
        });
        probes.splice(6, 0, {
            rank: rank - i,
            file: file + i,
        });
        probes.splice(7, 0, {
            rank: rank - i,
            file: file - i,
        });
        for (let j = 0; j < 8; j++) {
            if (directions[j] &&
                !move_gen_1.isSquareOutOfBounds(probes[j].rank, probes[j].file) &&
                !found[j]) {
                squares.push(probes[j]);
                found[j] =
                    helper_1.get_top(board, probes[j].rank + '-' + probes[j].file) !== null;
            }
        }
    }
    return squares;
};

move_gen_1.generate_moves_from_probes = (board, probes, src, square, turn) => {
    let moves = [];
    probes.forEach((x) => {
        var _a, _b, _c;
        let pos = x.rank + '-' + x.file;
        let dst = helper_1.get_top(board, pos);
        if (dst === null) {
            moves.push({
                src: square,
                dst: pos,
                type: constants_1.MOVEMENT,
            });
        }
        else {
            if (dst.tier < 3 &&
                ((_a = dst.piece) === null || _a === void 0 ? void 0 : _a.type) != constants_1.MARSHAL &&
                ((_b = src.piece) === null || _b === void 0 ? void 0 : _b.type) != constants_1.FORTRESS) {
                moves.push({
                    src: square,
                    dst: pos,
                    type: constants_1.STACK,
                });
            }
            if (((_c = dst.piece) === null || _c === void 0 ? void 0 : _c.color) !== turn) {
                moves.push({
                    src: square,
                    dst: pos,
                    type: constants_1.ATTACK,
                });
            }
        }
    });
    return moves;
};

move_gen_1.single_square_move_gen = (board, src, square) => {
    var _a;
    let moves = [];
    let rank = parseInt(square.split('-')[0]);
    let file = parseInt(square.split('-')[1]);
    let probes = [];
    switch ((_a = src.piece) === null || _a === void 0 ? void 0 : _a.type) {
        case constants_1.MAJOR_GENERAL:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (src.piece.color == constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file + 1)) {
                            probes.push({
                                rank: rank - 1,
                                file: file + 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file - 1)) {
                            probes.push({
                                rank: rank - 1,
                                file: file - 1,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file + 1)) {
                            probes.push({
                                rank: rank + 1,
                                file: file + 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file - 1)) {
                            probes.push({
                                rank: rank + 1,
                                file: file - 1,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    var ignore_squares_white = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 0,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 0,
                            file_offset: 1,
                        },
                        {
                            rank_offset: -1,
                            file_offset: 0,
                        },
                    ];
                    var ignore_squares_black = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 0,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 0,
                            file_offset: 1,
                        },
                        {
                            rank_offset: 1,
                            file_offset: 0,
                        },
                    ];
                    if (src.piece.color === constants_1.BLACK) {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_black);
                    }
                    else {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_white);
                    }
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = [];
                    var ignore_squares_white = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: -1,
                            file_offset: -1,
                        },
                        {
                            rank_offset: -1,
                            file_offset: 1,
                        },
                    ];
                    var ignore_squares_black = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 1,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 1,
                            file_offset: 1,
                        },
                    ];
                    if (src.piece.color === constants_1.BLACK) {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_black);
                    }
                    else {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_white);
                    }
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.LIEUTENANT_GENERAL:
            switch (src.tier) {
                case 1:
                    probes = [];
                    var ignore_squares_white = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 0,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 0,
                            file_offset: 1,
                        },
                        {
                            rank_offset: -1,
                            file_offset: 0,
                        },
                    ];
                    var ignore_squares_black = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 0,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 0,
                            file_offset: 1,
                        },
                        {
                            rank_offset: 1,
                            file_offset: 0,
                        },
                    ];
                    if (src.piece.color === constants_1.BLACK) {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_black);
                    }
                    else {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_white);
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 0,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 0,
                            file_offset: 1,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.GENERAL:
            switch (src.tier) {
                case 1:
                    probes = [];
                    var ignore_squares_white = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: -1,
                            file_offset: -1,
                        },
                        {
                            rank_offset: -1,
                            file_offset: 1,
                        },
                    ];
                    var ignore_squares_black = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                        {
                            rank_offset: 1,
                            file_offset: -1,
                        },
                        {
                            rank_offset: 1,
                            file_offset: 1,
                        },
                    ];
                    if (src.piece.color === constants_1.BLACK) {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_black);
                    }
                    else {
                        probes = move_gen_1.get_squares_around(square, ignore_squares_white);
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file - 1) &&
                            !helper_1.get_top(board, rank - 1 + '-' + (file - 1))) {
                            probes.push({
                                rank: rank - 2,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file) &&
                            !helper_1.get_top(board, rank - 1 + '-' + file)) {
                            probes.push({
                                rank: rank - 2,
                                file: file,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file + 1) &&
                            !helper_1.get_top(board, rank - 1 + '-' + (file + 1))) {
                            probes.push({
                                rank: rank - 2,
                                file: file + 1,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file - 1) &&
                            !helper_1.get_top(board, rank + 1 + '-' + (file - 1))) {
                            probes.push({
                                rank: rank + 2,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file) &&
                            !helper_1.get_top(board, rank + 1 + '-' + file)) {
                            probes.push({
                                rank: rank + 2,
                                file: file,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file + 1) &&
                            !helper_1.get_top(board, rank + 1 + '-' + (file + 1))) {
                            probes.push({
                                rank: rank + 2,
                                file: file + 1,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.ARCHER:
            switch (src.tier) {
                case 1:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    for (var i = 0; i < 4; i++) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file + 2 - i)) {
                            probes.push({
                                rank: rank - 2,
                                file: file + 2 - i,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2 + i, file - 2)) {
                            probes.push({
                                rank: rank - 2 + i,
                                file: file - 2,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file - 2 + i)) {
                            probes.push({
                                rank: rank + 2,
                                file: file - 2 + i,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2 - i, file + 2)) {
                            probes.push({
                                rank: rank + 2 - i,
                                file: file + 2,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = [];
                    for (var i = 0; i < 6; i++) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 3, file + 3 - i)) {
                            probes.push({
                                rank: rank - 3,
                                file: file + 3 - i,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 3 + i, file - 3)) {
                            probes.push({
                                rank: rank - 3 + i,
                                file: file - 3,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 3, file - 3 + i)) {
                            probes.push({
                                rank: rank + 3,
                                file: file - 3 + i,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 3 - i, file + 3)) {
                            probes.push({
                                rank: rank + 3 - i,
                                file: file + 3,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.KNIGHT:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank, file - 1)) {
                            probes.push({
                                rank: rank,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank, file + 1)) {
                            probes.push({
                                rank: rank,
                                file: file + 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file - 1)) {
                            probes.push({
                                rank: rank - 2,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file + 1)) {
                            probes.push({
                                rank: rank - 2,
                                file: file + 1,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank, file - 1)) {
                            probes.push({
                                rank: rank,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank, file + 1)) {
                            probes.push({
                                rank: rank,
                                file: file + 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file - 1)) {
                            probes.push({
                                rank: rank + 2,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file + 1)) {
                            probes.push({
                                rank: rank + 2,
                                file: file + 1,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file - 2)) {
                            probes.push({
                                rank: rank - 1,
                                file: file - 2,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file - 1)) {
                            probes.push({
                                rank: rank - 2,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 2, file + 1)) {
                            probes.push({
                                rank: rank - 2,
                                file: file + 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file + 2)) {
                            probes.push({
                                rank: rank - 1,
                                file: file + 2,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file - 2)) {
                            probes.push({
                                rank: rank + 1,
                                file: file - 2,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file - 1)) {
                            probes.push({
                                rank: rank + 2,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 2, file + 1)) {
                            probes.push({
                                rank: rank + 2,
                                file: file + 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file + 2)) {
                            probes.push({
                                rank: rank + 1,
                                file: file + 2,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = [];
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file - 2)) {
                        probes.push({
                            rank: rank - 1,
                            file: file - 2,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 2, file - 1)) {
                        probes.push({
                            rank: rank - 2,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 2, file + 1)) {
                        probes.push({
                            rank: rank - 2,
                            file: file + 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file + 2)) {
                        probes.push({
                            rank: rank - 1,
                            file: file + 2,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file - 2)) {
                        probes.push({
                            rank: rank + 1,
                            file: file - 2,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 2, file - 1)) {
                        probes.push({
                            rank: rank + 2,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 2, file + 1)) {
                        probes.push({
                            rank: rank + 2,
                            file: file + 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file + 2)) {
                        probes.push({
                            rank: rank + 1,
                            file: file + 2,
                        });
                    }
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.MUSKETEER:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file)) {
                            probes.push({
                                rank: rank - 1,
                                file: file,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file)) {
                            probes.push({
                                rank: rank + 1,
                                file: file,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    if (src.piece.color === constants_1.BLACK) {
                        probes = move_gen_1.probe_directions(board, square, 2, [
                            false,
                            false,
                            false,
                            true,
                            false,
                            false,
                            false,
                            false,
                        ]);
                        moves = moves.concat(probes);
                    }
                    else {
                        probes = move_gen_1.probe_directions(board, square, 2, [
                            false,
                            false,
                            true,
                            false,
                            false,
                            false,
                            false,
                            false,
                        ]);
                        moves = moves.concat(probes);
                    }
                    break;
                case 3:
                    if (src.piece.color === constants_1.BLACK) {
                        probes = move_gen_1.probe_directions(board, square, 8, [
                            false,
                            false,
                            false,
                            true,
                            false,
                            false,
                            false,
                            false,
                        ]);
                        moves = moves.concat(probes);
                    }
                    else {
                        probes = move_gen_1.probe_directions(board, square, 8, [
                            false,
                            false,
                            true,
                            false,
                            false,
                            false,
                            false,
                            false,
                        ]);
                        moves = moves.concat(probes);
                    }
                    break;
            }
            break;
        case constants_1.CAPTAIN:
            switch (src.tier) {
                case 1:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    moves = moves.concat(probes);
                    break;
                case 2:
                case 3:
                    var piece_under = helper_1.get(board, square)[src.tier - 2];
                    if (piece_under) {
                        if (piece_under.type === constants_1.CAPTAIN) {
                            var deep_piece_under = helper_1.get(board, square)[src.tier - 3];
                            if (deep_piece_under) {
                                moves = moves.concat(move_gen_1.single_square_move_gen(board, {
                                    piece: {
                                        type: deep_piece_under.type,
                                        color: src.piece.color,
                                    },
                                    tier: src.tier,
                                }, square));
                            }
                            else {
                                probes = [];
                                var ignore_squares = [
                                    {
                                        rank_offset: 0,
                                        file_offset: 0,
                                    },
                                ];
                                probes = move_gen_1.get_squares_around(square, ignore_squares);
                                moves = moves.concat(probes);
                            }
                        }
                        else {
                            moves = moves.concat(move_gen_1.single_square_move_gen(board, {
                                piece: { type: piece_under.type, color: src.piece.color },
                                tier: src.tier,
                            }, square));
                        }
                    }
                    break;
            }
            break;
        case constants_1.SAMURAI:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file - 1)) {
                        probes.push({
                            rank: rank + 1,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file + 1)) {
                        probes.push({
                            rank: rank + 1,
                            file: file + 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file - 1)) {
                        probes.push({
                            rank: rank - 1,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file + 1)) {
                        probes.push({
                            rank: rank - 1,
                            file: file + 1,
                        });
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    if (!move_gen_1.isSquareOutOfBounds(rank + 2, file - 2)) {
                        probes.push({
                            rank: rank + 2,
                            file: file - 2,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 2, file + 2)) {
                        probes.push({
                            rank: rank + 2,
                            file: file + 2,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 2, file - 2)) {
                        probes.push({
                            rank: rank - 2,
                            file: file - 2,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 2, file + 2)) {
                        probes.push({
                            rank: rank - 2,
                            file: file + 2,
                        });
                    }
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = move_gen_1.probe_directions(board, square, 8, [
                        false,
                        false,
                        false,
                        false,
                        true,
                        true,
                        true,
                        true,
                    ]);
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.FORTRESS:
            probes = [];
            var ignore_squares = [
                {
                    rank_offset: 0,
                    file_offset: 0,
                },
            ];
            probes = move_gen_1.get_squares_around(square, ignore_squares);
            moves = moves.concat(probes);
            break;
        case constants_1.CANNON:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (!move_gen_1.isSquareOutOfBounds(rank, file - 1)) {
                        probes.push({
                            rank: rank,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank, file + 1)) {
                        probes.push({
                            rank: rank,
                            file: file + 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file)) {
                        probes.push({
                            rank: rank - 1,
                            file: file,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file)) {
                        probes.push({
                            rank: rank + 1,
                            file: file,
                        });
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = move_gen_1.probe_directions(board, square, 2, [
                        true,
                        true,
                        true,
                        true,
                        false,
                        false,
                        false,
                        false,
                    ]);
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = move_gen_1.probe_directions(board, square, 8, [
                        true,
                        true,
                        true,
                        true,
                        false,
                        false,
                        false,
                        false,
                    ]);
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.SPY:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file)) {
                            probes.push({
                                rank: rank - 1,
                                file: file,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file)) {
                            probes.push({
                                rank: rank + 1,
                                file: file,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                    probes = [];
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file - 1)) {
                        probes.push({
                            rank: rank + 1,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank + 1, file + 1)) {
                        probes.push({
                            rank: rank + 1,
                            file: file + 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file - 1)) {
                        probes.push({
                            rank: rank - 1,
                            file: file - 1,
                        });
                    }
                    if (!move_gen_1.isSquareOutOfBounds(rank - 1, file + 1)) {
                        probes.push({
                            rank: rank - 1,
                            file: file + 1,
                        });
                    }
                    moves = moves.concat(probes);
                    break;
                case 3:
                    probes = move_gen_1.probe_directions(board, square, 8, [
                        true,
                        true,
                        true,
                        true,
                        true,
                        true,
                        true,
                        true,
                    ]);
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.PAWN:
            switch (src.tier) {
                case 1:
                    probes = [];
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file)) {
                            probes.push({
                                rank: rank - 1,
                                file: file,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file)) {
                            probes.push({
                                rank: rank + 1,
                                file: file,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
                case 2:
                case 3:
                    probes = [];
                    if (src.piece.color === constants_1.BLACK) {
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file)) {
                            probes.push({
                                rank: rank - 1,
                                file: file,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file - 1)) {
                            probes.push({
                                rank: rank - 1,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank - 1, file + 1)) {
                            probes.push({
                                rank: rank - 1,
                                file: file + 1,
                            });
                        }
                    }
                    else {
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file)) {
                            probes.push({
                                rank: rank + 1,
                                file: file,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file - 1)) {
                            probes.push({
                                rank: rank + 1,
                                file: file - 1,
                            });
                        }
                        if (!move_gen_1.isSquareOutOfBounds(rank + 1, file + 1)) {
                            probes.push({
                                rank: rank + 1,
                                file: file + 1,
                            });
                        }
                    }
                    moves = moves.concat(probes);
                    break;
            }
            break;
        case constants_1.MARSHAL:
            switch (src.tier) {
                case 1:
                case 2:
                case 3:
                    probes = [];
                    var ignore_squares = [
                        {
                            rank_offset: 0,
                            file_offset: 0,
                        },
                    ];
                    probes = move_gen_1.get_squares_around(square, ignore_squares);
                    moves = moves.concat(probes);
                    break;
            }
            break;
    }
    return moves;
};