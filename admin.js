function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("https://backend-4-v4ii.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Save login info
            localStorage.setItem("adminEmail", email);
            localStorage.setItem("adminPassword", password);

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid login");
        }
    })
    .catch(err => {
        alert("Server error");
        console.error(err);
    });
}
