import Mini_Desk from '../lib/desk'
import {
  Marshal,
  Pawn,
  Knight,
  Samurai,
  Spy,
  Cannon,
  Fortress,
  Captain,
  Archer,
  Musketeer,
  General,
  Lieutenant,
  Minor_General
} from '../lib/pieces'

import {
  update_board, table
} from './utils'

// set up +++++++++++++++++++++++++++++++++
// parent=marshal, tag m name 5-6
table('#marshal_1', 'm1')

table('#pawn_1', 'p1')
table('#pawn_2', 'p2')
table('#pawn_3', 'p3')

table('#spy_1', 's1')
table('#spy_2', 's2')
table('#spy_3', 's3')

table('#cannon_1', 'c1')
table('#cannon_2', 'c2')
table('#cannon_3', 'c3')

table('#fortress_1', 'f1')

table('#samurai_1', 'sa1')
table('#samurai_2', 'sa2')
table('#samurai_3', 'sa3')

table('#captain_1', 'ca1')

table('#musketeer_1', 'ma1')
table('#musketeer_2', 'ma2')
table('#musketeer_3', 'ma3')

table('#knight_1', 'k1')
table('#knight_2', 'k2')
table('#knight_3', 'k3')

table('#archer_1', 'a1')
table('#archer_2', 'a2')
table('#archer_3', 'a3')

table('#general_1', 'g1')
table('#general_2', 'g2')
table('#general_3', 'g3')

table('#lieutenant_1', 'l1')
table('#lieutenant_2', 'l2')
table('#lieutenant_3', 'l3')

table('#minor_general_1', 'mg1')
table('#minor_general_2', 'mg2')
table('#minor_general_3', 'mg3')


// ----------------------------------------



// Marshal
const MARSHAL = new Mini_Desk('m1')
MARSHAL.board[4][4][0] = new Marshal('w', 1, '4-4')
MARSHAL.board[2][6][0] = new Pawn('w', 1, '2-6')
MARSHAL.board[2][2][0] = new Knight('w', 1, '2-2')
MARSHAL.board[2][2][1] = new Samurai('w', 2, '2-2')
update_board(MARSHAL)

// Pawn
const Pawn_1 = new Mini_Desk('p1')
Pawn_1.board[4][4][0] = new Pawn('w', 1, '4-4')
update_board(Pawn_1, '#p1')

const Pawn_2 = new Mini_Desk('p2')
Pawn_2.board[4][4][0] = new Knight('w', 1, '4-4')
Pawn_2.board[4][4][1] = new Pawn('w', 2, '4-4')
update_board(Pawn_2, '#p2')

const Pawn_3 = new Mini_Desk('p3')
Pawn_3.board[4][4][0] = new Knight('w', 1, '4-4')
Pawn_3.board[4][4][1] = new Samurai('w', 2, '4-4')
Pawn_3.board[4][4][2] = new Pawn('w', 3, '4-4')
update_board(Pawn_3, '#p3')

// Spy
const Spy_1 = new Mini_Desk('s1')
Spy_1.board[4][4][0] = new Spy('w', 1, '4-4')
update_board(Spy_1, '#s1')

const Spy_2 = new Mini_Desk('s2')
Spy_2.board[4][4][0] = new Knight('w', 1, '4-4')
Spy_2.board[4][4][1] = new Spy('w', 2, '4-4')
update_board(Spy_2, '#s2')

const Spy_3 = new Mini_Desk('s3')
Spy_3.board[4][4][0] = new Knight('w', 1, '4-4')
Spy_3.board[4][4][1] = new Samurai('w', 2, '4-4')
Spy_3.board[4][4][2] = new Spy('w', 3, '4-4')
update_board(Spy_3, '#s3')

// Cannon
const Cannon_1 = new Mini_Desk('c1')
Cannon_1.board[4][4][0] = new Cannon('w', 1, '4-4')
update_board(Cannon_1, '#c1')

const Cannon_2 = new Mini_Desk('c2')
Cannon_2.board[4][4][0] = new Knight('w', 1, '4-4')
Cannon_2.board[4][4][1] = new Cannon('w', 2, '4-4')
update_board(Cannon_2, '#c2')

const Cannon_3 = new Mini_Desk('c3')
Cannon_3.board[4][4][0] = new Knight('w', 1, '4-4')
Cannon_3.board[4][4][1] = new Samurai('w', 2, '4-4')
Cannon_3.board[4][4][2] = new Cannon('w', 3, '4-4')
update_board(Cannon_3, '#c3')

// Fortress
const FORTRESS = new Mini_Desk('f1')
FORTRESS.board[4][4][0] = new Fortress('w', 1, '4-4')
FORTRESS.board[2][5][0] = new Pawn('w', 1, '2-5')
update_board(FORTRESS)

// Samurai
const Samurai_1 = new Mini_Desk('sa1')
Samurai_1.board[4][4][0] = new Samurai('w', 1, '4-4')
update_board(Samurai_1, '#sa1')

const Samurai_2 = new Mini_Desk('sa2')
Samurai_2.board[4][4][0] = new Knight('w', 1, '4-4')
Samurai_2.board[4][4][1] = new Samurai('w', 2, '4-4')
update_board(Samurai_2, '#sa2')

const Samurai_3 = new Mini_Desk('sa3')
Samurai_3.board[4][4][0] = new Knight('w', 1, '4-4')
Samurai_3.board[4][4][1] = new Cannon('w', 2, '4-4')
Samurai_3.board[4][4][2] = new Samurai('w', 3, '4-4')
update_board(Samurai_3, '#sa3')

// Captain
const CAPTAIN = new Mini_Desk('ca1')
CAPTAIN.board[4][4][0] = new Captain('w', 1, '4-4')
CAPTAIN.board[2][5][0] = new Pawn('w', 1, '2-5')
CAPTAIN.board[2][2][0] = new Knight('w', 1, '2-2')
CAPTAIN.board[2][2][1] = new Samurai('w', 2, '2-2')
CAPTAIN.board[6][6][0] = new Archer('w', 1, '6-6')
update_board(CAPTAIN)

// Musketeer
const Musketeer_1 = new Mini_Desk('ma1')
Musketeer_1.board[4][4][0] = new Musketeer('w', 1, '4-4')
update_board(Musketeer_1, '#ma1')

const Musketeer_2 = new Mini_Desk('ma2')
Musketeer_2.board[4][4][0] = new Knight('w', 1, '4-4')
Musketeer_2.board[4][4][1] = new Musketeer('w', 2, '4-4')
update_board(Musketeer_2, '#ma2')

const Musketeer_3 = new Mini_Desk('ma3')
Musketeer_3.board[4][4][0] = new Knight('w', 1, '4-4')
Musketeer_3.board[4][4][1] = new Samurai('w', 2, '4-4')
Musketeer_3.board[4][4][2] = new Musketeer('w', 3, '4-4')
update_board(Musketeer_3, '#ma3')

// Knight
const Knight_1 = new Mini_Desk('k1')
Knight_1.board[4][4][0] = new Knight('w', 1, '4-4')
update_board(Knight_1, '#k1')

const Knight_2 = new Mini_Desk('k2')
Knight_2.board[4][4][0] = new Pawn('w', 1, '4-4')
Knight_2.board[4][4][1] = new Knight('w', 2, '4-4')
update_board(Knight_2, '#k2')

const Knight_3 = new Mini_Desk('k3')
Knight_3.board[4][4][0] = new Pawn('w', 1, '4-4')
Knight_3.board[4][4][1] = new Samurai('w', 2, '4-4')
Knight_3.board[4][4][2] = new Knight('w', 3, '4-4')
update_board(Knight_3, '#k3')

// Archer
const Archer_1 = new Mini_Desk('a1')
Archer_1.board[4][4][0] = new Archer('w', 1, '4-4')
update_board(Archer_1, '#a1')

const Archer_2 = new Mini_Desk('a2')
Archer_2.board[4][4][0] = new Pawn('w', 1, '4-4')
Archer_2.board[4][4][1] = new Archer('w', 2, '4-4')
update_board(Archer_2, '#a2')

const Archer_3 = new Mini_Desk('a3')
Archer_3.board[4][4][0] = new Pawn('w', 1, '4-4')
Archer_3.board[4][4][1] = new Knight('w', 2, '4-4')
Archer_3.board[4][4][2] = new Archer('w', 3, '4-4')
update_board(Archer_3, '#a3')

// General
const General_1 = new Mini_Desk('g1')
General_1.board[4][4][0] = new General('w', 1, '4-4')
update_board(General_1, '#g1')

const General_2 = new Mini_Desk('g2')
General_2.board[4][4][0] = new Pawn('w', 1, '4-4')
General_2.board[4][4][1] = new General('w', 2, '4-4')
update_board(General_2, '#g2')

const General_3 = new Mini_Desk('g3')
General_3.board[4][4][0] = new Pawn('w', 1, '4-4')
General_3.board[4][4][1] = new Knight('w', 2, '4-4')
General_3.board[4][4][2] = new General('w', 3, '4-4')
update_board(General_3, '#g3')

// Lieutenant
const Lieutenant_1 = new Mini_Desk('l1')
Lieutenant_1.board[4][4][0] = new Lieutenant('w', 1, '4-4')
update_board(Lieutenant_1, '#l1')

const Lieutenant_2 = new Mini_Desk('l2')
Lieutenant_2.board[4][4][0] = new Pawn('w', 1, '4-4')
Lieutenant_2.board[4][4][1] = new Lieutenant('w', 2, '4-4')
update_board(Lieutenant_2, '#l2')

const Lieutenant_3 = new Mini_Desk('l3')
Lieutenant_3.board[4][4][0] = new Pawn('w', 1, '4-4')
Lieutenant_3.board[4][4][1] = new Knight('w', 2, '4-4')
Lieutenant_3.board[4][4][2] = new Lieutenant('w', 3, '4-4')
update_board(Lieutenant_3, '#l3')

// Minor_General
const Minor_General_1 = new Mini_Desk('mg1')
Minor_General_1.board[4][4][0] = new Minor_General('w', 1, '4-4')
update_board(Minor_General_1, '#mg1')

const Minor_General_2 = new Mini_Desk('mg2')
Minor_General_2.board[4][4][0] = new Pawn('w', 1, '4-4')
Minor_General_2.board[4][4][1] = new Minor_General('w', 2, '4-4')
update_board(Minor_General_2, '#mg2')

const Minor_General_3 = new Mini_Desk('mg3')
Minor_General_3.board[4][4][0] = new Pawn('w', 1, '4-4')
Minor_General_3.board[4][4][1] = new Knight('w', 2, '4-4')
Minor_General_3.board[4][4][2] = new Minor_General('w', 3, '4-4')
update_board(Minor_General_3, '#mg3')


export const Piece_Guid = {
  'm1': MARSHAL,

  'p1': Pawn_1,
  'p2': Pawn_2,
  'p3': Pawn_3,

  's1': Spy_1,
  's2': Spy_2,
  's3': Spy_3,

  'c1': Cannon_1,
  'c2': Cannon_2,
  'c3': Cannon_3,

  'f1': FORTRESS,

  'sa1': Samurai_1,
  'sa2': Samurai_2,
  'sa3': Samurai_3,

  'ca1': CAPTAIN,

  'ma1': Musketeer_1,
  'ma2': Musketeer_2,
  'ma3': Musketeer_3,

  'k1': Knight_1,
  'k2': Knight_2,
  'k3': Knight_3,

  'a1': Archer_1,
  'a2': Archer_2,
  'a3': Archer_3,

  'g1': General_1,
  'g2': General_2,
  'g3': General_3,

  'l1': Lieutenant_1,
  'l2': Lieutenant_2,
  'l3': Lieutenant_3,

  'mg1': Minor_General_1,
  'mg2': Minor_General_2,
  'mg3': Minor_General_3
}