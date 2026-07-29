function saveSettings(){


let data={

college:
document.getElementById("collegeName").value,

system:
document.getElementById("systemName").value,

year:
document.getElementById("year").value,

theme:
document.getElementById("theme").value


};


localStorage.setItem(
"settings",
JSON.stringify(data)
);


alert("Settings Saved Successfully");


}