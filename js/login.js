// ===============================
// API URL
// ===============================

const API = window.API_BASE || window.location.origin;

// ===============================
// Show Password
// ===============================
document
.getElementById("showPassword")
.addEventListener("change", function () {

    const password = document.getElementById("password");

    password.type = this.checked ? "text" : "password";

});


// ===============================
// Remember Me
// ===============================
if (localStorage.getItem("rememberMe") === "true") {

    document.getElementById("rememberMe").checked = true;

    document.getElementById("email").value =
        localStorage.getItem("savedEmail") || "";

}


// ===============================
// Login
// ===============================
document
.querySelector(".log")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const role =
        document.getElementById("role").value;

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const remember =
        document.getElementById("rememberMe").checked;


    if (role === "") {

        alert("Please select login role.");
        return;

    }

    if (email === "") {

        alert("Please enter email.");
        return;

    }

    if (password.length < 4) {

        alert("Password must contain at least 4 characters.");
        return;

    }

    try {

        const response = await fetch(`${API}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                role: role,
                email: email,
                password: password
            })

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message);

            document.getElementById("password").value = "";

            return;

        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", email);
        localStorage.setItem("userRole", role);

        if (result.teacher) {
            localStorage.setItem("teacher", JSON.stringify(result.teacher));
        } else {
            localStorage.removeItem("teacher");
        }

        if (result.student) {
            localStorage.setItem("student", JSON.stringify(result.student));
        } else {
            localStorage.removeItem("student");
        }

        if (remember) {

            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("savedEmail", email);

        } else {

            localStorage.removeItem("rememberMe");
            localStorage.removeItem("savedEmail");

        }

        if (role === "admin") {

            window.location.href = "/html/dashboard.html";

        }
        else if (role === "teacher") {

            window.location.href = "/html/teacher-dashboard.html";

        }
        else if (role === "student") {

            window.location.href = "/html/student-dashboard.html";

        }

    }
    catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }

});
