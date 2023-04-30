var header = document.getElementById("menuHeader");
var btns = header.getElementsByClassName("menu-btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("menu-active");
  current[0].className = current[0].className.replace(" menu-active", "");
  this.className += " menu-active";
  });
}