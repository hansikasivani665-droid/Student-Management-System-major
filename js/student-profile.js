// ===============================
// Check Login
// ===============================

if (localStorage.getItem("loggedIn") !== "true") {

    location.href = "/html/login.html";

}

const API = window.API_BASE || window.location.origin;
const STUDENT_API = `${API}/students`;

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

});

async function loadProfile() {

    try {

        const email =
            localStorage.getItem("currentUser");

        if (!email) {
            alert("Student login required");
            location.href = "/html/login.html";
            return;
        }

        const response =
            await fetch(`${STUDENT_API}/email/${encodeURIComponent(email)}`);

        const data =
            await response.json();

        console.log(data);

        if (data.success) {

            const student = data.student;

            document.getElementById("studentName").innerHTML =
                student.name;

            document.getElementById("roll").innerHTML =
                student.roll;

            document.getElementById("department").innerHTML =
                student.department;

            document.getElementById("year").innerHTML =
                student.year;

            document.getElementById("email").innerHTML =
                student.email;

            document.getElementById("phone").innerHTML =
                student.phone;

        }

        else {

            alert("Student details not found");

        }

    }

    catch (error) {

        console.error("Profile Error:", error);
        alert("Unable to load profile");

    }

}
