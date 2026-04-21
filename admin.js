const BASE_URL = "https://backend-4-v4ii.onrender.com";

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

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
      localStorage.setItem("adminLogin", "true");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password");
    }
  })
  .catch(err => {
    console.log(err);
    alert("Server error");
  });
}
