// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

import './assets/js/peer'
import {
  socket
} from "./assets/js/api"
// libraries -------------------------------------

// style and util +++++++++++++++++++++++++
import "./assets/sass/about.sass"
// ----------------------------------------

$(document).bind("contextmenu", function (_) {
  return false;
});


export class fakeAccount {
  constructor() {
    this.getId = makeid(21)
    this.getName = 'Siavash Moghadas'
    this.getGivenName = makeid(6)
    this.getFamilyName = 'Moghadas'
    this.getImageUrl = 'https://lh3.googleusercontent.com/a-/AFdZucqPnBxSS9ppBtdCZu4c-CFHRiOEuAhMpaqGKgLJ=s96-c'
    this.getEmail = `${makeid(17)}@gmail.com`
  }
}



var profile = new fakeAccount();
profile = {
  id: profile.getId,
  fullName: profile.getName,
  givenName: profile.getGivenName,
  familyName: profile.getFamilyName,
  imageUrl: profile.getImageUrl,
  email: profile.getEmail,
}

$('.g-signin2').on('data-onsuccess', function (googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();

  profile = {
    id: profile.getId(),
    fullName: profile.getName(),
    givenName: profile.getGivenName(),
    familyName: profile.getFamilyName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
  }

  if(!socket.main){
    socket.peer = new Peer(profile.id);
    socket.peer.on('open', function (id) {
      console.log(socket.peer.id)
      for (let player in socket.users) {
        console.log(player)
        let conn = socket.peer.connect(player);
        conn.on('open', function () {
          conn.send({
            status: 'login',
            profile: socket.main
          });
        });
      }
    });
    socket.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        console.log(data)
        if (data.status == 'message') {
          $('.chat ul').append(`
        <li>
          <span name="player">${data.player}: </span>
          <span>
            ${data.message}
          </span>
        </li>
        `)
        } else if (data.status == 'login') {
          $('.players').append(`
          <div id=${conn.id}  desc="player">
            <img src=${data.profile.imageUrl} alt="">
            <h3>${data.profile.givenName}</h3>
          </div>
        `)
          socket.users[data.profile.id] = data.profile
        }
      });
    });
    socket.main = profile
    socket.login(profile)
  }
});


// $('.g-signin2').click(function (googleUser) {
//   if(!socket.main){
//     socket.peer = new Peer(profile.id);
//     socket.peer.on('open', function (id) {
//       console.log(socket.peer.id)
//       for (let player in socket.users) {
//         console.log(player)
//         let conn = socket.peer.connect(player);
//         conn.on('open', function () {
//           conn.send({
//             status: 'login',
//             profile: socket.main
//           });
//         });
//       }
//     });
//     socket.peer.on('connection', function (conn) {
//       conn.on('data', function (data) {
//         console.log(data)
//         if (data.status == 'message') {
//           $('.chat ul').append(`
//         <li>
//           <span name="player">${data.player}: </span>
//           <span>
//             ${data.message}
//           </span>
//         </li>
//         `)
//         } else if (data.status == 'login') {
//           $('.players').append(`
//           <div id=${conn.id}  desc="player">
//             <img src=${data.profile.imageUrl} alt="">
//             <h3>${data.profile.givenName}</h3>
//           </div>
//         `)
//           socket.users[data.profile.id] = data.profile
//         }
//       });
//     });
//     socket.main = profile
//     socket.login(profile)
//   }
// });



function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


$('.massage input').keypress(function (event) {
  if (event.which == 13 && event.target.value.length > 0 && $('.status h3').text() != '') {
    let message = event.target.value
    $('.massage input').val('')
    $('.chat ul').append(`
    <li>
      <span name="player">${$('.status h3').text()}: </span>
      <span>
        ${message}
      </span>
    </li>
    `)

    $(".chat").animate({
      scrollTop: $(".chat").height()
    }, 300);
    // on open will be launch when you successfully connect to PeerServer
    for (let player in socket.users) {
      let conn = socket.peer.connect(player);
      conn.on('open', function () {
        conn.send({
          status: 'message',
          player: socket.main.givenName,
          message: message
        });
      });
    }
  }
});