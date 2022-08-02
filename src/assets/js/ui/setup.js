const gungi = new Desk(Constants)

var stockpile_selected = gungi.stockpiles.b.marshal[0]

var tier_color = ["#000000", "#8a8a8a", "#fc9803", "#cc0000"]


var stockpile = {
  "帥": 1, "兵": 9, "忍": 2, "砲": 2,
  "砦": 2, "侍": 2, "謀": 1, "筒": 1,
  "馬": 2, "弓": 2, "大": 6, "中": 4,
  "小": 4
}

$(document).bind("contextmenu",function(e){
  return false;
});

$.each(stockpile, function(key, value){
  $("#bs-"+key).append("<sub>"+value+"</sub>")
});

$.each(stockpile, function(key, value){
  $("#ws-"+key).append("<sub>"+value+"</sub>")
});


$.each(stockpile, function(key, value){
  $("#bc-"+key).append("<sub>0</sub>")
});

$.each(stockpile, function(key, value){
  $("#wc-"+key).append("<sub>0</sub>")
});