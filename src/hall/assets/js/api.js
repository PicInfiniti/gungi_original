// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
import './peer'

export var socket = {}
var BaseUrl = 'http://127.0.0.1:5556'
// var BaseUrl = 'https://gungi.pythonanywhere.com'

socket.profile = null
socket.peer = null
socket.activeUser = null
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


chooseId()

function chooseId() {
  console.log(`${socket.index}/${socket.ids.length}`)

  socket.peer = new Peer(socket.ids[socket.index])

  socket.peer.on('open', function (id) {
    socket.profile.id = id
    console.log(`Peer Id: ${id}`)
    $('.g-signin2').remove()
    $('.status').append(`
        <img src=${socket.profile.imageUrl} alt="">
        <h3>${socket.profile.givenName}</h3>
      `)
      
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
            <span name="player">${data.player}: </span>
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