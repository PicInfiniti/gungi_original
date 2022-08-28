// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
import Filter from 'bad-words'

import './assets/js/chat/peer'
import {
  socket
} from "./assets/js/chat/api"
import {
  fakeAccount
} from "./assets/js/chat/utils"
// libraries -------------------------------------

// style and util +++++++++++++++++++++++++
import "./assets/sass/chatroom.sass"
import "./assets/sass/land.sass"
// ----------------------------------------

$(document).bind("contextmenu", function (_) {
  return false;
});

var filter = new Filter();

var profile = new fakeAccount();
socket.profile = {
  fullName: profile.getName,
  givenName: profile.getGivenName,
  familyName: profile.getFamilyName,
  imageUrl: profile.getImageUrl,
  email: profile.getEmail,
}

// $('.g-signin2').on('data-onsuccess', function (googleUser) {
//   // Useful data for your client-side scripts:
//   var profile = googleUser.getBasicProfile();

//   profile = {
//     id: profile.getId(),
//     fullName: profile.getName(),
//     givenName: profile.getGivenName(),
//     familyName: profile.getFamilyName(),
//     imageUrl: profile.getImageUrl(),
//     email: profile.getEmail(),
//   }

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


$('.g-signin2').click(function (googleUser) {
  if (!socket.profile) {
    chooseId()
  }
});


$('.massage input').keypress(function (event) {
  if (event.which == 13 && event.target.value.length > 0 && socket.profile) {
    let message = event.target.value
    $('.massage input').val('')
    $('.chat ul').append(`
    <li>
      <span name="player">${$('.status h3').text()}: </span>
      <span>
        ${filter.clean(message)}
      </span>
    </li>
    `)

    $(".chat").animate({
      scrollTop: $(".chat").height()
    }, 300);
    // on open will be launch when you successfully connect to PeerServer
    for (let conn in socket.peers) {
      if(socket.peers[conn]){
        socket.peers[conn].send({
          status: 'message',
          player: socket.profile.givenName,
          message: filter.clean(message)
        });
      }
    }
  }
});




// setup +++++++++++++++++++++++++++++++++++++++++
document.addEventListener('contextmenu', event => event.preventDefault());

function capitalizeFirstLetter(string) {
  let temp = string.charAt(0).toUpperCase() + string.slice(1)
  return temp.replace('_', ' ');
}

$('.stockpile').hover((event) => {
    let color = $(event.target).attr('id')[0]
    if(color=='b') {
      $('#b-army .tooltip').show()
      .text(capitalizeFirstLetter(event.target.getAttribute('dcr')))
    } else {
      $('#w-army .tooltip').show()
      .text(capitalizeFirstLetter(event.target.getAttribute('dcr')))
    }

  },
  (event) => {
    $('.tooltip').hide()
      .text('Marshal')
  })
  
// setup -----------------------------------------

// Ui ++++++++++++++++++++++++++++++++++++++
import './assets/js/gungi/ui/setup'
import './assets/js/gungi/ui/Interactions'

// Ui -------------------------------------------