const gungi = new Gungi()

var stockpile_selected = gungi.MARSHAL
var click_pos = {src: null, dst: null}
var tier_color = ["#000000", "#8a8a8a", "#fc9803", "#cc0000"]
var Marshal = {'b':null, 'w': null}

var black_stockpile = {
  "帥": 1, "兵": 9, "忍": 2, "砲": 2,
  "砦": 2, "侍": 2, "謀": 1, "筒": 1,
  "馬": 2, "弓": 2, "大": 6, "中": 4,
  "小": 4
}

var white_stockpile = {
  "帥": 1, "兵": 9, "忍": 2, "砲": 2,
  "砦": 2, "侍": 2, "謀": 1, "筒": 1,
  "馬": 2, "弓": 2, "大": 6, "中": 4,
  "小": 4
}

$(document).bind("contextmenu",function(e){
  return false;
});

$.each(black_stockpile, function(key, value){
  $("#bs-"+key).append("<sub>"+value+"</sub>")
});

$.each(black_stockpile, function(key, value){
  $("#ws-"+key).append("<sub>"+value+"</sub>")
});


$.each(black_stockpile, function(key, value){
  $("#bc-"+key).append("<sub>0</sub>")
});

$.each(black_stockpile, function(key, value){
  $("#wc-"+key).append("<sub>0</sub>")
});