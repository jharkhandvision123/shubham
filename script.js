document.addEventListener("DOMContentLoaded", () => {

const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");

if(searchBtn){

searchBtn.addEventListener("click",()=>{

const text = searchBox.value.trim();

if(text===""){

alert("Please enter something to search.");

}else{

alert("Searching for: " + text);

}

});

}

console.log("JharkhandVision123 Student Portal Loaded");

});
