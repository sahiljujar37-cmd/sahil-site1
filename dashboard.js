const BASE_URL = "https://backend-4-v4ii.onrender.com";

const email = localStorage.getItem("adminEmail");
const password = localStorage.getItem("adminPassword");

if (!email || !password) {
    window.location.href = "admin.html";
}

// Bookings
fetch(`${BASE_URL}/api/bookings`, {
    headers: { email, password }
})
.then(res => res.json())
.then(data => {
    const table = document.getElementById("bookingTable");

    data.data.forEach(b => {
        table.innerHTML += `
        <tr>
            <td>${b.name}</td>
            <td>${b.email}</td>
            <td>${b.phone}</td>
            <td>${b.service}</td>
            <td>${b.date}</td>
        </tr>`;
    });
});

// Memberships
fetch(`${BASE_URL}/api/memberships`, {
    headers: { email, password }
})
.then(res => res.json())
.then(data => {
    const table = document.getElementById("membershipTable");

    data.data.forEach(m => {
        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td>${m.phone}</td>
            <td>${m.plan}</td>
            <td>${m.startDate}</td>
        </tr>`;
    });
});

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "admin.html";
}