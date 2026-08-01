const API = "https://onrender.com";


let resultData = [];


// ===============================
// LOAD PAGE
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

    loadResults();


});




// ===============================
// FETCH RESULTS
// ===============================

async function loadResults(){


try{


const response = await fetch(RESULT_API);


const data = await response.json();



console.log(data);



if(data.success){


resultData = data.results;


displayResults(resultData);


calculateCards(resultData);


}


}

catch(error){

console.log(error);

}


}







// ===============================
// DISPLAY TABLE
// ===============================

function displayResults(results){



const tbody = document.getElementById("resultTableBody");



if(!tbody){

console.log("resultTableBody not found");

return;

}



tbody.innerHTML="";




results.forEach((student,index)=>{



tbody.innerHTML += `


<tr>

<td>${index+1}</td>


<td>${student.roll}</td>


<td>${student.name}</td>


<td>${student.department}</td>


<td>${student.year}</td>


<td>${student.subject}</td>


<td>${student.marks}</td>


<td>${student.grade}</td>


<td>${student.status}</td>


</tr>


`;



});



}









// ===============================
// DASHBOARD CARDS
// ===============================


function calculateCards(results){



let total = results.length;



let totalMarks = 0;


let pass = 0;



results.forEach(r=>{


totalMarks += Number(r.marks);



if(r.status==="Pass"){

pass++;

}


});




let average = 0;


if(total>0){

average =
(totalMarks/total).toFixed(2);

}




let passPercentage=0;


if(total>0){

passPercentage =
((pass/total)*100).toFixed(2);

}





document.getElementById("totalResults").innerHTML =
total;



document.getElementById("averageMarks").innerHTML =
average+"%";



document.getElementById("passPercentage").innerHTML =
passPercentage+"%";



}