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


setInterval(socket.players, 2000)






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

//   socket.login(profile)
// });

var peer = new Peer();
peer.on('open', function(id) {
  profile['idPeer'] = id
  console.log(id)
});

peer.on('connection', function(conn) {
  conn.on('data', function(data){
    console.log(data)
    $('.chat ul').append(`
    <li>
      <span name="player">${$('.status h3').text()}: </span>
      <span>
        ${data}
      </span>
    </li>
    `)
  });
});

var profile = new fakeAccount();
profile = {
  id: profile.getId,
  fullName: profile.getName,
  givenName: profile.getGivenName,
  familyName: profile.getFamilyName,
  imageUrl: profile.getImageUrl,
  email: profile.getEmail,
}



$('.g-signin2').click(function (googleUser) {
  socket.main = profile
  socket.login(profile)
});

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


// var conn = peer.connect('another-peers-id');
// // on open will be launch when you successfully connect to PeerServer
// conn.on('open', function(){
//   // here you have conn.id
//   conn.send('hi!');
// });


$('.massage input').keypress(function (event) {
  
  if (event.which == 13 && event.target.value.length > 0 && $('.status h3').text() != '') {
    let conn = peer.connect(socket.activeUser);

    $('.chat ul').append(`
    <li>
      <span name="player">${$('.status h3').text()}: </span>
      <span>
        ${event.target.value}
      </span>
    </li>
    `)

    $(".chat").animate({
      scrollTop: $(".chat").height()
    }, 300);
    // on open will be launch when you successfully connect to PeerServer

    conn.on('open', function(){
      conn.send(event.target.value);
      $('.massage input').val('')
    });
  }
});


