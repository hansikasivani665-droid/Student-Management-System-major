
document.querySelector(".pass").addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const message = document.getElementById("message");

    const emailPattern =
    /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;

    if (!emailPattern.test(email)) {

        message.style.color = "red";
        message.textContent = "Please enter a valid email address.";

        return;

    }

    // Add this part here
    const submitBtn = document.querySelector(".passw");

    submitBtn.disabled = true;

    submitBtn.textContent = "Sending...";

    setTimeout(() => {

        message.style.color = "green";

        message.textContent = "Password reset link sent successfully!";

        submitBtn.disabled = false;

        submitBtn.textContent = "Send Reset Link";

        document.querySelector(".pass").reset();

    }, 1500);

});