// var _ = require('lodash');
export class Gungi {
    constructor() {
        this.KNIGHT = '馬';
        this.BLACK = constants_1.BLACK;
        this.WHITE = constants_1.WHITE;
        this.DRAFT = constants_1.DRAFT;
        this.GAME = constants_1.GAME;
        this.ATTACK = constants_1.ATTACK;
        this.MOVEMENT = constants_1.MOVEMENT;
        this.STACK = constants_1.STACK;
        this.PLACE = constants_1.PLACE;
        this.READY = constants_1.READY;
        this.MAJOR_GENERAL = constants_1.MAJOR_GENERAL;
        this.LIEUTENANT_GENERAL = constants_1.LIEUTENANT_GENERAL;
        this.GENERAL = constants_1.GENERAL;
        this.ARCHER = constants_1.ARCHER;
        this.KNIGHT = constants_1.KNIGHT;
        this.MUSKETEER = constants_1.MUSKETEER;
        this.CAPTAIN = constants_1.CAPTAIN;
        this.SAMURAI = constants_1.SAMURAI;
        this.FORTRESS = constants_1.FORTRESS;
        this.CANNON = constants_1.CANNON;
        this.SPY = constants_1.SPY;
        this.PAWN = constants_1.PAWN;
        this.MARSHAL = constants_1.MARSHAL;
        this.board = [];
        for (let i = 0; i < constants_1.RANK_9; i++) {
            this.board[i] = [];
            for (let k = 0; k < constants_1.FILE_9; k++) {
                this.board[i][k] = [null, null, null];
            }
        }
        this.turn = constants_1.BLACK;
        this.phase = constants_1.DRAFT;
        this.stockpile = [];
        this._history = [];
        this._captured = [];
        this._drafted = {
            w: 0,
            b: 0,
        };
        this._marshal_placed = {
            w: 0,
            b: 0,
        };
        this._army_size = {
            w: 0,
            b: 0,
        };
        this._turn_count = 0;
        this._turns_without_placing_or_capturing = 0;
        Array.prototype.push.apply(this.stockpile, helper_1.init_stockpile(constants_1.WHITE));
        Array.prototype.push.apply(this.stockpile, helper_1.init_stockpile(constants_1.BLACK));
        this.get_board = () => {
            return [...this.board];
        };
        this.get_stockpile = (color) => {
            if (!color) {
                return [...this.stockpile];
            }
            return [...this.stockpile.filter((x) => x.piece.color === color)];
        };
        this.get_army_size = (color) => {
            if (color === 'w') {
                return this._army_size.w;
            }
            else {
                return this._army_size.b;
            }
        };
        this.get_captured = (color) => {
            if (!color) {
                return [
                    ..._.orderBy(this._captured, ['piece.color', 'piece.type'], ['asc', 'asc']),
                ];
            }
            return [
                ..._.orderBy(this._captured, ['piece.color', 'piece.type'], ['asc', 'asc']).filter((x) => x.piece.color == color),
            ];
        };
        this.get = (square) => {
            return helper_1.get(this.board, square);
        };
        this.get_top = (square) => {
            return helper_1.get_top(this.board, square);
        };
        this.get_history = () => {
            return [...this._history];
        };
        this.in_check = () => {
            var _a;
            var is_in_check = false;
            var vision = [];
            for (var i = constants_1.RANK_1; i <= constants_1.RANK_9; i++) {
                for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                    var square = i + '-' + j;
                    var src = helper_1.get_top(this.board, square);
                    if (src && ((_a = src.piece) === null || _a === void 0 ? void 0 : _a.color) !== this.turn) {
                        var probes = move_gen_1.single_square_move_gen(this.board, src, square);
                        vision = vision.concat(probes);
                    }
                }
            }
            vision.forEach((square) => {
                var _a, _b;
                var top = helper_1.get_top(this.board, square.rank + '-' + square.file);
                if (top !== null &&
                    ((_a = top.piece) === null || _a === void 0 ? void 0 : _a.type) === constants_1.MARSHAL &&
                    ((_b = top.piece) === null || _b === void 0 ? void 0 : _b.color) == this.turn) {
                    is_in_check = true;
                }
            });
            return is_in_check;
        };
        this.in_checkmate = () => {
            return ((this.in_check() && this.moves().length == 0) ||
                this._captured.find((x) => x.piece.color === this.turn && x.piece.type === constants_1.MARSHAL) !== undefined);
        };
        this.in_stalemate = () => {
            return ((!this.in_check() && this.moves().length == 0) ||
                this._turns_without_placing_or_capturing > 50);
        };
        this.game_over = () => {
            return this.in_checkmate() || this.in_stalemate();
        };
        this.moves = (options) => {
            var _a;
            let moves = [];
            if (this.phase === constants_1.GAME) {
                for (var i = constants_1.RANK_1; i <= constants_1.RANK_9; i++) {
                    for (var j = constants_1.FILE_1; j <= constants_1.FILE_9; j++) {
                        var square = i + '-' + j;
                        var src = helper_1.get_top(this.board, square);
                        if (src != null && ((_a = src.piece) === null || _a === void 0 ? void 0 : _a.color) === this.turn) {
                            var probes = move_gen_1.single_square_move_gen(this.board, src, square);
                            moves = moves.concat(move_gen_1.generate_moves_from_probes(this.board, probes, src, square, this.turn));
                        }
                    }
                }
            }
            moves = moves.concat(stockpile_move_gen_1.stockpile_move_gen(this.board, this.phase, this.turn, this.stockpile, this._marshal_placed, this._army_size));
            var temp_board = JSON.stringify(this.board);
            for (var i = moves.length - 1; i >= 0; i--) {
                var move = moves[i];
                switch (move.type) {
                    case constants_1.MOVEMENT:
                        if (move.dst && typeof move.src === 'string') {
                            var piece = helper_1.remove(this.board, move.src);
                            helper_1.put(this.board, piece, move.dst);
                        }
                        break;
                    case constants_1.PLACE:
                        if (move.src && move.dst && igungi_1.IsPiece(move.src)) {
                            helper_1.put(this.board, {
                                type: move.src.type,
                                color: move.src.color,
                            }, move.dst);
                        }
                        break;
                    case constants_1.ATTACK:
                        if (move.dst) {
                            var piece = helper_1.remove(this.board, move.dst);
                            if (helper_1.get_top(this.board, move.dst) === null) {
                                if (move.src && typeof move.src === 'string') {
                                    var temp = helper_1.remove(this.board, move.src);
                                    helper_1.put(this.board, temp, move.dst);
                                }
                            }
                        }
                        break;
                    case constants_1.STACK:
                        if (move.src && move.dst && typeof move.src === 'string') {
                            var piece = helper_1.remove(this.board, move.src);
                            helper_1.put(this.board, piece, move.dst);
                        }
                        break;
                    default:
                        break;
                }
                if (this.in_check()) {
                    moves.splice(i, 1);
                }
                this.board = JSON.parse(temp_board);
            }
            if (options && options.square != null) {
                var input = options.square.split('-');
                var rank = parseInt(input[0]);
                var file = parseInt(input[1]);
                if (!move_gen_1.isSquareOutOfBounds(rank, file)) {
                    return moves.filter((x) => x.src !== null &&
                        x.src === options.square &&
                        x.type !== constants_1.PLACE &&
                        x.type !== constants_1.READY);
                }
            }
            return moves;
        };
        
        this.move = (player_move) => {
            var legal_moves = this.moves().filter((x) => JSON.stringify(x) === JSON.stringify(player_move));
            if (legal_moves.length) {
                var legal_move = legal_moves[0];
                var source_piece = typeof legal_move.src === 'string'
                    ? helper_1.get_top(this.board, legal_move.src)
                    : null;
                var destination_piece = null;
                if (typeof legal_move.dst === 'string') {
                    destination_piece = helper_1.get_top(this.board, legal_move.dst);
                    if (destination_piece == null) {
                        destination_piece = { piece: null, tier: 1 };
                    }
                }
                switch (legal_move.type) {
                    case constants_1.MOVEMENT:
                        if (legal_move &&
                            legal_move.dst &&
                            typeof legal_move.src === 'string') {
                            var piece = helper_1.remove(this.board, legal_move.src);
                            helper_1.put(this.board, piece, legal_move.dst);
                            this._turns_without_placing_or_capturing++;
                        }
                        break;
                    case constants_1.PLACE:
                        if (legal_move && legal_move.dst && igungi_1.IsPiece(legal_move.src)) {
                            helper_1.remove_stockpile(this.stockpile, legal_move.src);
                            helper_1.put(this.board, {
                                type: legal_move.src.type,
                                color: legal_move.src.color,
                            }, legal_move.dst);
                            this._turns_without_placing_or_capturing = 0;
                            if (legal_move.src.color === constants_1.BLACK) {
                                this._army_size.b++;
                                if (legal_move.src.type === constants_1.MARSHAL) {
                                    this._marshal_placed.b = 1;
                                }
                            }
                            else {
                                this._army_size.w++;
                                if (legal_move.src.type === constants_1.MARSHAL) {
                                    this._marshal_placed.w = 1;
                                }
                            }
                        }
                        break;
                    case constants_1.ATTACK:
                        if (legal_move.dst) {
                            var piece = helper_1.remove(this.board, legal_move.dst);
                            if (piece) {
                                var c = this._captured.filter((x) => JSON.stringify(x.piece) === JSON.stringify(piece));
                                if (c.length > 0) {
                                    c[0].amount++;
                                }
                                else {
                                    this._captured.push({ piece, amount: 1 });
                                }
                                if (piece.color === 'b') {
                                    this._army_size.b--;
                                }
                                else {
                                    this._army_size.w--;
                                }
                                this._turns_without_placing_or_capturing = 0;
                            }
                            if (legal_move && typeof legal_move.src === 'string') {
                                var temp = helper_1.remove(this.board, legal_move.src);
                                helper_1.put(this.board, temp, legal_move.dst);
                            }
                        }
                        break;
                    case constants_1.STACK:
                        if (legal_move &&
                            legal_move.dst &&
                            typeof legal_move.src === 'string') {
                            var piece = helper_1.remove(this.board, legal_move.src);
                            helper_1.put(this.board, piece, legal_move.dst);
                            this._turns_without_placing_or_capturing++;
                        }
                        break;
                    case constants_1.READY:
                        if (this.turn === constants_1.BLACK) {
                            this._drafted.b = 1;
                        }
                        else {
                            this._drafted.w = 1;
                        }
                        this._turns_without_placing_or_capturing = 0;
                        break;
                }
                this._turn_count++;
                this._history.push({
                    moveNumber: this._turn_count,
                    turn: this.turn,
                    src: legal_move.src,
                    dst: legal_move.dst,
                    type: legal_move.type,
                    srcTier: source_piece === null || source_piece === void 0 ? void 0 : source_piece.tier,
                    srcPiece: source_piece === null || source_piece === void 0 ? void 0 : source_piece.piece,
                    dstTier: destination_piece === null || destination_piece === void 0 ? void 0 : destination_piece.tier,
                    dstPiece: destination_piece === null || destination_piece === void 0 ? void 0 : destination_piece.piece,
                });
                if (this.phase === constants_1.DRAFT) {
                    if (this._drafted.w === 0 && this._drafted.b === 0) {
                        if (this.turn === constants_1.BLACK) {
                            this.turn = constants_1.WHITE;
                        }
                        else {
                            this.turn = constants_1.BLACK;
                        }
                    }
                    else if (this._drafted.w === 1 && this._drafted.b === 0) {
                        this.turn = constants_1.BLACK;
                    }
                    else if (this._drafted.w === 0 && this._drafted.b === 1) {
                        this.turn = constants_1.WHITE;
                    }
                    else if (this._drafted.w === 1 && this._drafted.b === 1) {
                        this.turn = constants_1.WHITE;
                        this.phase = constants_1.GAME;
                    }
                }
                else {
                    if (this.turn === constants_1.BLACK) {
                        this.turn = constants_1.WHITE;
                    }
                    else {
                        this.turn = constants_1.BLACK;
                    }
                }
                return legal_move;
            }
            return null;
        };
        this.ascii = () => {
            var _a, _b;
            var s = '     +--------------------------------------------------------+\n';
            s += '     |                                                        |\n';
            for (let i = 9; i > 0; i--) {
                s += ` ｒ${i} |  `;
                for (let j = 1; j < 10; j++) {
                    let top = helper_1.get_top(this.board, i + '-' + j);
                    if (top !== null) {
                        let type = (_a = top.piece) === null || _a === void 0 ? void 0 : _a.type;
                        let color = (_b = top.piece) === null || _b === void 0 ? void 0 : _b.color;
                        let symbol = '';
                        switch (top.tier) {
                            case 1:
                                symbol = color === constants_1.WHITE ? constants_1.TIER1_WHITE : constants_1.TIER1_BLACK;
                                break;
                            case 2:
                                symbol = color === constants_1.WHITE ? constants_1.TIER2_WHITE : constants_1.TIER2_BLACK;
                                break;
                            case 3:
                                symbol = color === constants_1.WHITE ? constants_1.TIER3_WHITE : constants_1.TIER3_BLACK;
                                break;
                        }
                        s += `${symbol + type}  `;
                    }
                    else {
                        s += '。。  ';
                    }
                }
                s += '|\n';
                s +=
                    '     |                                                        |\n';
            }
            s += '     +--------------------------------------------------------+\n';
            s += '        ｆ１  ｆ２  ｆ３  ｆ４  ｆ５  ｆ６  ｆ７  ｆ８  ｆ９';
            return s;
        };
    }
}
