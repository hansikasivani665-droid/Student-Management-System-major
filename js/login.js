// ===============================
// API URL
// ===============================
const API = "https://student-management-system-693o.onrender.com/";



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


    // ===========================
    // Validation
    // ===========================

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


    // ===========================
    // Send Login Request
    // ===========================
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

        // ===========================
        // Login Failed
        // ===========================
        if (!result.success) {

            alert(result.message);

            document.getElementById("password").value = "";

            return;

        }


        // ===========================
        // Save Login
        // ===========================
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", email);
        localStorage.setItem("userRole", role);

        if (remember) {

            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("savedEmail", email);

        } else {

            localStorage.removeItem("rememberMe");
            localStorage.removeItem("savedEmail");

        }


        // ===========================
        // Redirect
        // ===========================
        if (role === "admin") {

            window.location.href = "dashboard.html";

        }
        else if (role === "teacher") {

            window.location.href = "teacher-dashboard.html";

        }
        else if (role === "student") {

            window.location.href = "student-dashboard.html";

        }

    }
    catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }

});