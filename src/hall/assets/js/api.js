// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
import './peer'

import {
  Move,
} from './ui/utils'


export var socket = {}
// var BaseUrl = 'http://127.0.0.1:5556'
// var BaseUrl = 'https://gungi.pythonanywhere.com'

socket.profile = null
socket.peer = null
socket.opponent = null
socket.gameCount = 0
socket.color = null

socket.ids = [
  "0l8mgdv1N8061pmnJETZf",
  "21d9Rr7dwuZBWe2hZtHpq",
  "3EfaKo6xoUNxOmpIRM1YR",
  "9Aafi9YZKNSFMeiMs8Jgx",
  "9SkKaxhTD6AEiSHiXEcwe",
  "DHX2udyZOhxzfqF5V1xym",
  "Ef0MmH1OvcSw8V3EZuyNj",
  "JKxb9Nt0HG0Yxi5sIl8rH",
  "M2njEUBrLTmQ47ayeqR65",
  "RBhsx0qlJKF1BukNEv9tI",
  "aDJI9cigK9hRPdp4kjDVN",
  "azj7RGUlbfjUAoA9vnlVQ",
  "ez5iIjd6HqYcPbnNFzV8K",
  "f5gHSUFIFcnzqYrmYrEzS",
  "h23kHpo9Vv5ot2eDbCKqZ",
  "hZa5aHUGpWGFYAFMpyjur",
  "hfGWkj9VcqkxGM8OMtZkS",
  "ix4hYLbTXLDvci2mEXz6x",
  "sgTBMB65BgodUdX5mR28a",
  "whaG5nnMrxWNzO2hJ4lqD"
]
socket.index = 0
socket.peers = {}


// chooseId()

export function chooseId() {
  console.log(`${socket.index}/${socket.ids.length}`)

  socket.peer = new Peer(socket.ids[socket.index])

  socket.peer.on('open', function (id) {
    socket.profile.id = id
    console.log(`Peer Id: ${id}`)
    $('.g-signin2').remove()
    $('.chatroom .status').append(`
        <img src=${socket.profile.imageUrl} alt="">
        <h3>${socket.profile.givenName}</h3>
        <h1>▶</h1>
      `)
    $('.chatroom .status h1').click((event) => {
      if (socket.gameCount === 0) {
        socket.gameCount = 1
        socket.color = 'b'

        $('.games').append(`
        <div class="game" desc="${socket.profile.id}">
          <div name="blackUser">${socket.profile.givenName}</div>
          <div name="black">帥</div>
          <div name="dash">―</div>
          <div name="white">帥</div>
          <div name="whiteUser">Join +</div>
        </div>
      `)

        SendAll('game', {
          black: socket.profile,
          white: null
        })
      }
    })

    setInterval(() => {
      socket.peer.socket.send({
        type: 'ping'
      })
    }, 16000)

    UserCall()
  })

  socket.peer.on('error', function (err, id) {
    if (err.type == 'unavailable-id') {
      socket.index++;
      if (socket.index > socket.ids.length) {
        alert(`Room is Full...`)
      } else {
        chooseId()
      }
    } else if (err.type == 'peer-unavailable') {
      socket.peers[err.id] == false
    }
  })

  socket.peer.on('connection', function (conn) {
    conn.on('data', function (data) {
      if (data.status == 'message') {
        $('.chat ul').append(`
          <li>
            <span name="player">${data.player.givenName}: </span>
            <span>
              ${data.message}
            </span>
          </li>
          `)
        $(".chat").animate({
          scrollTop: $(".chat").height()
        }, 300);


      } else if (data.status == 'login') {
        $('.players').append(`
        <div id=${data.profile.id}  desc="player">
          <img src=${data.profile.imageUrl} alt="">
          <h3>${data.profile.givenName}</h3>
        </div>
        `)

        socket.peers[data.profile.id] = socket.peer.connect(data.profile.id, {
          reliable: true
        });

        socket.peers[data.profile.id].on('open', function () {
          socket.peers[data.profile.id].send({
            status: 'recall',
            profile: socket.profile
          })
        })

        socket.peers[data.profile.id].on('close', function () {
          $(`#${data.profile.id}`).remove();
          socket.peers[data.profile.id] = false;
        })

      } else if (data.status == 'recall') {
        $('.players').append(`
        <div id=${data.profile.id}  desc="player">
          <img src=${data.profile.imageUrl} alt="">
          <h3>${data.profile.givenName}</h3>
        </div>
      `)
      } else if (data.status == 'game') {
        if (!data.message.white) {
          $('.games').append(`
          <div class="game" desc="${data.message.black.id}">
            <div name="blackUser">${data.message.black.givenName}</div>
            <div name="black">帥</div>
            <div name="dash">―</div>
            <div name="white">帥</div>
            <div name="whiteUser">Join +</div>
          </div>`)

          $(`.games [desc=${data.message.black.id}] [name=whiteUser]`).click((event) => {
            if (socket.gameCount === 0) {
              socket.gameCount = 1
              socket.color = 'w'
              socket.opponent = socket.peers[data.message.black.id]

              $('.chatroom').hide()
              $('.land').show()

              $(event.target).text(socket.profile.givenName)
              SendAll('game', {
                black: data.message.black,
                white: socket.profile
              })
            }
          })
        } else {
          $(`.games [desc=${data.message.black.id}]`).remove()
          $('.games').append(`
          <div class="game" desc="${data.message.black.id}">
            <div name="blackUser">${data.message.black.givenName}</div>
            <div name="black">帥</div>
            <div name="dash">―</div>
            <div name="white">帥</div>
            <div name="whiteUser">${data.message.white.givenName}</div>
          </div>`)

          if (data.message.black.id == socket.profile.id) {
            socket.color = 'b'
            socket.opponent = socket.peers[data.message.white.id]

            $('.chatroom').hide()
            $('.land').show()
          }
        }
      } else if (data.status == 'move' && socket.opponent && socket.color) {
        console.log(data.message)
        Move(data.message)
      }
    });
  });
}


function UserCall() {
  for (let player of socket.ids) {
    if (player != socket.peer.id) {
      socket.peers[player] = socket.peer.connect(player, {
        reliable: true
      });

      socket.peers[player].on('open', function () {
        socket.peers[player].send({
          status: 'login',
          profile: socket.profile
        })
      })

      socket.peers[player].on('close', function () {
        $(`#${player}`).remove();
        socket.peers[player] = false;
      })
    }
  }
}


export function SendAll(status, message, profile = socket.profile, peers = socket.peers) {
  for (let conn in peers) {
    if (peers[conn]) {
      peers[conn].send({
        status: status,
        player: profile,
        message: message
      });
    }
  }
}