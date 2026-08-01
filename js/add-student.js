// =====================================
// Add Student Module (Optimized for Live Demo)
// =====================================

console.log("Add Student Page Loaded");

const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");

studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect student data from the form fields
    const studentData = {
        roll: document.getElementById("rollNo").value.trim(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        department: document.getElementById("department").value.trim(),
        year: document.getElementById("year").value.trim(),
        password: "1234"
    };

    console.log("Student Data Sent:", studentData);

    // Phone number validation (10 digits check)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(studentData.phone)) {
        message.style.color = "red";
        message.innerHTML = "❌ Phone number must contain exactly 10 digits";
        return;
    }

    // Basic frontend validation for blank entries
    if (
        !studentData.roll ||
        !studentData.name ||
        !studentData.email ||
        !studentData.phone ||
        !studentData.department ||
        !studentData.year
    ) {
        message.style.color = "red";
        message.innerHTML = "❌ Please fill all required fields";
        return;
    }

    try {
        // --- DYNAMICALLY ROUTE NETWORKING PATHS TO ACTIVE LIVE CONTAINER ---
        const liveServerUrl = "https://onrender.com";

        const response = await fetch(liveServerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        console.log(
            "Server Response:",
            JSON.stringify(result, null, 2)
        );

        if (response.ok) {
            message.style.color = "green";
            message.innerHTML = "✅ Student Added Successfully";

            studentForm.reset();

            // Delays for 1.5 seconds so the user can see the green success message
            setTimeout(() => {
                window.location.href = "teacher-student-list.html";
            }, 1500);

        } else {
            message.style.color = "red";
            message.innerHTML = "❌ " + (result.message || "Failed to add student.");
        }

    } catch (error) {
        console.error("Server Error:", error);
        message.style.color = "red";
        message.innerHTML = "❌ Server connection failed";
    }
});
