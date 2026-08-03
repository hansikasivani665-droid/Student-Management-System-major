// =====================================
// Admin Profile
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // Login Check
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "/html/login.html";
        return;
    }

    // Default Admin Data
    const admin = JSON.parse(localStorage.getItem("admin")) || {
        name: "Administrator",
        email: "admin@sms.com",
        phone: "9876543210",
        role: "System Administrator"
    };

    // Display Data
    if (document.getElementById("adminName"))
        document.getElementById("adminName").value = admin.name;

    if (document.getElementById("adminEmail"))
        document.getElementById("adminEmail").value = admin.email;

    if (document.getElementById("adminPhone"))
        document.getElementById("adminPhone").value = admin.phone;

    if (document.getElementById("adminRole"))
        document.getElementById("adminRole").value = admin.role;
});


// =====================================
// Save Profile
// =====================================

function saveProfile() {

    const admin = {

        name: document.getElementById("adminName").value,

        email: document.getElementById("adminEmail").value,

        phone: document.getElementById("adminPhone").value,

        role: document.getElementById("adminRole").value

    };

    localStorage.setItem("admin", JSON.stringify(admin));

    alert("Profile Updated Successfully");
}