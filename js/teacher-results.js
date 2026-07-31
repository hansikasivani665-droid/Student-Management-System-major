const API = "http://localhost:5000/results";

const form = document.getElementById("resultForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const roll = document.getElementById("roll").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const marks = Number(document.getElementById("marks").value);

    let grade = "";
    let status = "";

    if (marks >= 90) {
        grade = "A+";
    } else if (marks >= 80) {
        grade = "A";
    } else if (marks >= 70) {
        grade = "B";
    } else if (marks >= 60) {
        grade = "C";
    } else if (marks >= 50) {
        grade = "D";
    } else {
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

        if (response.ok) {

            message.style.color = "green";
            message.innerHTML = "✅ Result Saved Successfully";

            form.reset();

        } else {

            message.style.color = "red";
            message.innerHTML = data.message;

        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerHTML = "❌ Server Error";

    }

});