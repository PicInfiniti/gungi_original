// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
import './peer'

export var socket = {}
var BaseUrl = 'http://127.0.0.1:5556'
// var BaseUrl = 'https://gungi.pythonanywhere.com'

socket.users = {}
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


socket.login = function (json) {
  $.ajax({
    type: "POST",
    url: `${BaseUrl}/login`,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      // remove login button ++++++++++++++++++++++++++++++++++
      $('.g-signin2').remove()
      $('.status').append(`
        <img src=${json.imageUrl} alt="">
        <h3>${json.givenName}</h3>
      `)

      // ------------------------------------------------------

      socket.peer = new Peer(json.id) // make main peer
      socket.peer.on('open', function (id) {
        console.log(`Peer is Created: ${id}`)
        for (let player in data['players']) {
          if (!(player in socket.users) && (!socket.profile || socket.profile.id != player)) {
            $('.players').append(`
            <div id=${player}  desc="player">
              <img src=${data['players'][player]['imageUrl']} alt="">
              <h3>${data['players'][player]['givenName']}</h3>
            </div>
          `)
            socket.users[player] = data.players[player]
            socket.peers[player] = socket.peer.connect(player, {
              reliable: true
            });
            console.log(data.players[player].id)
            socket.peers[player].on('open', function () {
              console.log(data.players[player].id)
              socket.peers[player].send({
                status: 'login',
                profile: socket.profile
              })
            })
            socket.peers[player].on('close', function () {
              console.log(socket.peers[player].open)
              socket.peers[player].send({
                status: 'logout',
                profile: socket.profile
              })
            })
          }
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
            socket.users[data.profile.id] = data.profile
            socket.peers[data.profile.id] = socket.peer.connect(data.profile.id, {
              reliable: true
            });
            socket.peers[data.profile.id].on('close', function () {
              console.log(socket.peers[data.profile.id].open)
              socket.peers[data.profile.id].send({
                status: 'logout',
                profile: socket.profile
              })
            })
          }
        });
      });

      // keep connection alive
      setInterval(() => {
        socket.peer.socket.send({
          type: 'ping'
        })
      }, 16000)
    },
    error: function (errMsg) {
      console.log(errMsg);
    }
  });
}

chooseId()



function chooseId() {
  console.log(`${socket.index}/${socket.ids.length}`)
  socket.peer = new Peer(socket.ids[socket.index])
  socket.peer.on('open', function (id) {
    console.log(`Peer Id: ${socket.peer.id}`)
    $('.g-signin2').remove()
    $('.status').append(`
        <img src=${socket.profile.imageUrl} alt="">
        <h3>${socket.profile.givenName}</h3>
      `)

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
      socket.peers[err.id] = null
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
        socket.users[data.profile.id] = data.profile
        socket.peers[data.profile.id] = socket.peer.connect(data.profile.id, {
          reliable: true
        });

        socket.peers[data.profile.id].on('close', function () {
          console.log(socket.peers[data.profile.id].open)
          socket.peers[data.profile.id].send({
            status: 'logout',
            profile: socket.profile
          })
        })
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

    }
  }

}