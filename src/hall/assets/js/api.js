// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
import './peer'

export var socket = {}
var BaseUrl = 'http://192.168.1.11:5555'
// var BaseUrl = 'https://gungi.pythonanywhere.com'

socket.users = {}
socket.profile = null
socket.peer = null
socket.activeUser = null
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
            socket.peers[player] = socket.peer.connect(player);
            socket.peers[player].on('open', function () {
              console.log(data.players[player].id)
              socket.peers[player].send({
                status: 'login',
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
            socket.peers[data.profile.id] = socket.peer.connect(data.profile.id);
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