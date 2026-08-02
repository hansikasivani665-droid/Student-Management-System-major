// ===============================
// API
// ===============================
console.log("RESULT JS FILE LOADED");
const RESULT_API = "https://student-management-system-major-1.onrender.com/results";

let resultData = [];


// =============================================
// PAGE LOAD
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    loadResults();

});


async function loadResults() {

    try {

        const response = await fetch(RESULT_API);

        const data = await response.json();

        console.log(data);

        if (data.success) {

            resultData = data.results;

            displayResults(resultData);

            calculateCards(resultData);

        } else {

            console.log("No Results Found");

        }

    }

    catch (error) {

        console.error("Fetch Error:", error);

    }

}


// =============================================
// DISPLAY RESULTS
// =============================================

function displayResults(results) {

    const tbody = document.getElementById("resultTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    results.forEach((student, index) => {

        tbody.innerHTML += `
            <tr>

                <td>${index + 1}</td>

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


// =============================================
// DASHBOARD CARDS
// =============================================

function calculateCards(results) {

    const total = results.length;

    let totalMarks = 0;
    let pass = 0;

    results.forEach(result => {

        totalMarks += Number(result.marks);

        if (result.status === "Pass") {

            pass++;

        }

    });

    const average =
        total > 0
            ? (totalMarks / total).toFixed(2)
            : 0;

    const passPercentage =
        total > 0
            ? ((pass / total) * 100).toFixed(2)
            : 0;

    document.getElementById("totalResults").innerHTML = total;
    document.getElementById("averageMarks").innerHTML = average + "%";
    document.getElementById("passPercentage").innerHTML = passPercentage + "%";

}