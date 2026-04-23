const email = localStorage.getItem("adminEmail");
const password = localStorage.getItem("adminPassword");

// Redirect if not logged in
if (!email || !password) {
    window.location.href = "admin.html";
}

// Load bookings
fetch("http://localhost:3000/api/bookings", {
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
            </tr>
        `;
    });
});

// Load memberships
fetch("https://backend-4-v4ii.onrender.com/api/memberships", {
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
            </tr>
        `;
    });
});

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "admin.html";
}
