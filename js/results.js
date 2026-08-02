// =====================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN RESULTS MODULE
// =====================================


if(localStorage.getItem("loggedIn") !== "true"){

    window.location.href="/html/login.html";

}




// =====================================
// API
// =====================================


const RESULT_API =
"https://student-management-system-major-1.onrender.com/results";



let resultsData=[];





// =====================================
// PAGE LOAD
// =====================================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadResults();



const search =
document.getElementById(
"searchResult"
);



if(search){


search.addEventListener(
"input",
searchResults
);


}



});








// =====================================
// LOAD RESULTS
// =====================================


async function loadResults(){


try{


const response =
await fetch(
RESULT_API
);



const data =
await response.json();



console.log(
"Results API:",
data
);




if(data.success){



resultsData =
data.results || [];



displayResults(
resultsData
);



updateCards(
resultsData
);



}

else{


showNoData();


}



}


catch(error){


console.error(
"Results Error:",
error
);


showNoData();


}



}








// =====================================
// DISPLAY RESULTS TABLE
// =====================================


function displayResults(results){



const table =
document.getElementById(
"resultTableBody"
);



if(!table){

return;

}



table.innerHTML="";




if(results.length===0){



table.innerHTML=`

<tr>

<td colspan="9">

No Results Found

</td>

</tr>

`;

return;


}






results.forEach(
(result,index)=>{



table.innerHTML += `


<tr>


<td>
${index+1}
</td>



<td>
${result.roll || "-"}
</td>



<td>
${result.name || "-"}
</td>



<td>
${result.department || "-"}
</td>



<td>
${result.year || "-"}
</td>



<td>
${result.subject || "-"}
</td>



<td>
${result.marks ?? "-"}
</td>



<td>
${result.grade || "-"}
</td>



<td>

<span class="${
result.status==="Pass"
?
"pass"
:
"fail"
}">

${result.status || "-"}

</span>


</td>



</tr>



`;



});



}









// =====================================
// UPDATE CARDS
// =====================================


function updateCards(results){



const total =
results.length;



let totalMarks=0;

let pass=0;




results.forEach(result=>{


totalMarks +=
Number(result.marks || 0);



if(result.status==="Pass"){

pass++;

}


});






const average =

total

?

(
totalMarks / total
)
.toFixed(2)

:

0;





const percentage =

total

?

Math.round(
(pass / total) * 100
)

:

0;







const totalElement =
document.getElementById(
"totalResults"
);



const averageElement =
document.getElementById(
"averageMarks"
);



const passElement =
document.getElementById(
"passPercentage"
);





if(totalElement){

totalElement.innerHTML =
total;

}



if(averageElement){

averageElement.innerHTML =
average+"%";

}



if(passElement){

passElement.innerHTML =
percentage+"%";

}



}








// =====================================
// SEARCH
// =====================================


function searchResults(){



const keyword =
document
.getElementById(
"searchResult"
)
.value
.toLowerCase();




const filtered =

resultsData.filter(result=>{



return (

(result.name || "")
.toLowerCase()
.includes(keyword)


||

(result.roll || "")
.toLowerCase()
.includes(keyword)


||

(result.subject || "")
.toLowerCase()
.includes(keyword)


);



});




displayResults(
filtered
);



}








// =====================================
// NO DATA
// =====================================


function showNoData(){



const table =
document.getElementById(
"resultTableBody"
);



if(table){


table.innerHTML=`

<tr>

<td colspan="9">

No Results Available

</td>

</tr>

`;

}



}