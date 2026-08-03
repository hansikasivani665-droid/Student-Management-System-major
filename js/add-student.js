// =====================================
// ADD STUDENT MODULE
// =====================================

console.log("Add Student Page Loaded");

const API = window.API_BASE || window.location.origin;

const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");

studentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const studentData = {

        roll: document.getElementById("rollNo").value.trim(),

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        department: document.getElementById("department").value,

        year: document.getElementById("year").value,

        password: "1234"

    };


    console.log(studentData);


    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(studentData.phone)) {

        message.style.color = "red";

        message.innerHTML =
            "❌ Phone Number must contain exactly 10 digits";

        return;

    }


    if (

        !studentData.roll ||

        !studentData.name ||

        !studentData.email ||

        !studentData.phone ||

        !studentData.department ||

        !studentData.year

    ) {

        message.style.color = "red";

        message.innerHTML =
            "❌ Please fill all fields.";

        return;

    }


    try {

        const response = await fetch(`${API}/students`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(studentData)

        });


        const result = await response.json();

        console.log(result);


        if (result.success) {

            message.style.color = "green";

            message.innerHTML =
                "✅ Student Added Successfully";

            studentForm.reset();

            setTimeout(() => {

                window.location.href =
                    "/html/teacher-student-list.html";

            }, 1500);

        }

        else {

            message.style.color = "red";

            message.innerHTML =
                "❌ " + result.message;

        }

    }

    catch (err) {

        console.log(err);

        message.style.color = "red";

        message.innerHTML =
            "❌ Server Connection Failed";

    }

});