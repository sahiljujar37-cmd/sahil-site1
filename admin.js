
const BASE_URL = "https://backend-4-v4ii.onrender.com";

// Check login on load
window.onload = function () {
  const email = localStorage.getItem("adminEmail");
  const password = localStorage.getItem("adminPassword");

  if (email && password) {
    showPanel();
    getBookings();
  }
};

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  // simple login (no backend auth)
  localStorage.setItem("adminEmail", email);
  localStorage.setItem("adminPassword", password);

  showPanel();
  getBookings();
}

// SHOW PANEL
function showPanel() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

// LOGOUT
function logout() {
  localStorage.clear();
  location.reload();
}

// FETCH BOOKINGS
async function getBookings() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`);
    const data = await res.json();

    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    data.forEach(b => {
      list.innerHTML += `
        <tr>
          <td>${b.name || "-"}</td>
          <td>${b.service || "-"}</td>
          <td>${b.status || "Pending"}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error fetching bookings");
  }
}
