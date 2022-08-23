// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"
export var socket = {}
var BaseUrl = 'http://192.168.1.11:5000'

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
        if(player!=json['id']){
          $('.players').append(      `
          <div id=${player}>
            <img src=${data['players'][player]['imageUrl']} alt="">
            <h3>${data['players'][player]['givenName']}</h3>
          </div>
        `)
        }
      }
    },
    error: function (errMsg) {
      console.log(errMsg);
    }
  });
}

socket.players = function (json) {
  $.ajax({
    type: "GET",
    url: `${BaseUrl}/players`,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      $('.g-signin2').remove()
    },
    error: function (errMsg) {
      console.log(errMsg);
    }
  });
}