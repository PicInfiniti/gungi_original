// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
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

$('.massage input').keypress(function (event) {
  if (event.which == 13 && event.target.value.length > 0 && $('.status h3').text()!='') {
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

    $('.massage input').val('')


  }

});


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


$('.g-signin2').click(function (googleUser) {
  // Useful data for your client-side scripts:
  var profile = new fakeAccount();

  profile = {
    id: profile.getId,
    fullName: profile.getName,
    givenName: profile.getGivenName,
    familyName: profile.getFamilyName,
    imageUrl: profile.getImageUrl,
    email: profile.getEmail,
  }

  socket.login(profile)
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