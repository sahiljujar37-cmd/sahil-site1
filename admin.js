const BASE_URL = "https://backend-4-v4ii.onrender.com"; // e.g. https://zunjarfitness-api.onrender.com

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("adminEmail", email);
            localStorage.setItem("adminPassword", password);

            window.location.href = "dashboard.html";
        } else {
            alert("Invalid login");
        }
    })
    .catch(() => alert("Server error"));
}