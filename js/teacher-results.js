// =====================================
// Teacher Result Module
// =====================================

const API = "https://student-management-system-major-1.onrender.com/results";

const form = document.getElementById("resultForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const roll = document.getElementById("roll").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const marks = Number(document.getElementById("marks").value);

    // Validation
    if (!roll || !subject || isNaN(marks)) {

        message.style.color = "red";
        message.innerHTML = "❌ Please fill all fields.";
        return;

    }

    if (marks < 0 || marks > 100) {

        message.style.color = "red";
        message.innerHTML = "❌ Marks must be between 0 and 100.";
        return;

    }

    let grade = "";
    let status = "";

    if (marks >= 90) {

        grade = "A+";

    }
    else if (marks >= 80) {

        grade = "A";

    }
    else if (marks >= 70) {

        grade = "B";

    }
    else if (marks >= 60) {

        grade = "C";

    }
    else if (marks >= 50) {

        grade = "D";

    }
    else {

        grade = "F";

    }

    status = marks >= 35 ? "Pass" : "Fail";

    const result = {

        roll,
        subject,
        marks,
        grade,
        status

    };

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(result)

        });

        const data = await response.json();

        if (data.success) {

            message.style.color = "green";
            message.innerHTML = "✅ Result Saved Successfully";

            form.reset();

        }

        else {

            message.style.color = "red";
            message.innerHTML = data.message || "Failed to save result.";

        }

    }

    catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerHTML = "❌ Server Connection Failed.";

    }

});