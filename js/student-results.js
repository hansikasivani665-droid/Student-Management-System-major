// ===============================
// Check Login
// ===============================

if (localStorage.getItem("loggedIn") !== "true") {

    location.href = "/html/login.html";

}

const API = window.API_BASE || window.location.origin;
const STUDENT_API = `${API}/students`;
const RESULT_API = `${API}/results`;

document.addEventListener("DOMContentLoaded", () => {

    loadResults();

});

async function loadResults() {

    try {

        const email =
            localStorage.getItem("currentUser");

        if (!email) {
            alert("Student login required");
            location.href = "/html/login.html";
            return;
        }

        const studentResponse =
            await fetch(`${STUDENT_API}/email/${encodeURIComponent(email)}`);

        const studentData =
            await studentResponse.json();

        if (!studentData.success) {

            alert("Student details not found");
            return;

        }

        const roll =
            studentData.student.roll;

        const response =
            await fetch(RESULT_API);

        const data =
            await response.json();

        const table =
            document.getElementById("resultTable");

        table.innerHTML = "";

        if (data.success) {

            const results =
                data.results.filter(result => result.roll === roll);

            if (results.length > 0) {

                results.forEach(result => {

                    table.innerHTML += `

<tr>

<td>${result.subject}</td>

<td>${result.marks}</td>

<td>${result.grade}</td>

<td>${result.status}</td>

</tr>

`;

                });

            }

            else {

                table.innerHTML = `

<tr>

<td colspan="4">

No Results Found

</td>

</tr>

`;

            }

        }

    }

    catch (error) {

        console.log("Result Error:", error);

    }

}
