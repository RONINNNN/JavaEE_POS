document.getElementById("cusSec").style.setProperty("Display","none","important");
document.getElementById("itemSec").style.setProperty("Display","none","important");
// document.getElementById("oderSec").style.setProperty("Display","none","important");


// NavBar clicks
document.getElementById("itemClick").addEventListener("click",function (){
    document.getElementById("itemSec").style.setProperty("Display","block","important");
    document.getElementById("cusSec").style.setProperty("Display","none","important");
    document.getElementById("oderSec").style.setProperty("Display","none","important");
});
// NavBar clicks
document.getElementById("customerClick").addEventListener("click",function (){
    document.getElementById("cusSec").style.setProperty("Display","block","important");
    document.getElementById("itemSec").style.setProperty("Display","none","important");
    document.getElementById("oderSec").style.setProperty("Display","none","important");
});
// NavBar clicks
document.getElementById("orderClick").addEventListener("click",function (){
    document.getElementById("itemSec").style.setProperty("Display","none","important");
    document.getElementById("cusSec").style.setProperty("Display","none","important");
    document.getElementById("oderSec").style.setProperty("Display","block","important");
});
