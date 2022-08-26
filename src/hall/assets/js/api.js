// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
export var socket = {}
// var BaseUrl = 'http://127.0.0.1:5000'
var BaseUrl = 'https://gungi.pythonanywhere.com'

socket.users = {}
socket.main = null
socket.activeUser = null
socket.peer = null


socket.login = function (json) {
  $.ajax({
    type: "POST",
    url: `${BaseUrl}/login`,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      $('.g-signin2').remove()
      $('.status').append(`
        <img src=${json['imageUrl']} alt="">
        <h3>${json['givenName']}</h3>
      `)
      for(let player in data['players']){
        if(!(player in socket.users) && (!socket.main || socket.main.id!=player)){
          $('.players').append(      `
          <div id=${player}  desc="player">
            <img src=${data['players'][player]['imageUrl']} alt="">
            <h3>${data['players'][player]['givenName']}</h3>
          </div>
        `)
        socket.users[player] = data['players'][player]
        $(`#${player}`).click((event)=>{
          socket.activeUser = player
        })
        }
      }
    },
    error: function (errMsg) {
      console.log(errMsg);
    }
  });
}

// socket.players = function () {
//   $.ajax({
//     type: "GET",
//     url: `${BaseUrl}/players`,
//     // The key needs to match your method's input parameter (case-sensitive).
//     contentType: "application/json; charset=utf-8",
//     dataType: "json",
//     success: function (data) {
//       for(let player in data['players']){
//         if(!socket.users.includes(player) && (!socket.main || socket.main.id!=player)){
//           $('.players').append(      `
//           <div id=${player}  desc="player">
//             <img src=${data['players'][player]['imageUrl']} alt="">
//             <h3>${data['players'][player]['givenName']}</h3>
//           </div>
//         `)
//         socket.users.push(player)
//         $(`#${player}`).click((event)=>{
//           socket.activeUser = data['players'][event.delegateTarget.getAttribute('id')]['idPeer']
//           console.log(socket.activeUser)
//         })
//         }
//       }
//     },
//     error: function (errMsg) {
//       console.log(errMsg);
//     }
//   });
// }

socket.chat = function (json) {
  $.ajax({
    type: "POST",
    url: `${BaseUrl}/chat`,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      console.log(data);
    },
    error: function (errMsg) {
      console.log(errMsg);
    }
  });
}

