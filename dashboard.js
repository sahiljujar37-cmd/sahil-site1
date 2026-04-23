const email = localStorage.getItem("adminEmail");
const password = localStorage.getItem("adminPassword");

if (!email || !password) {
    window.location.href = "admin.html";
}

let membersData = [];
let totalRevenue = 0;

/* ================= BOOKINGS ================= */
fetch("https://backend-4-v4ii.onrender.com/api/bookings", {
    headers: { email, password }
})
.then(res => res.json())
.then(data => {
    const table = document.getElementById("bookingTable");
    document.getElementById("totalBookings").innerText = data.data.length;

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


/* ================= MEMBERS ================= */
function loadMembers() {
    fetch("https://backend-4-v4ii.onrender.com/api/memberships", {
        headers: { email, password }
    })
    .then(res => res.json())
    .then(data => {
        membersData = data.data;
        renderMembers(membersData);

        document.getElementById("totalMembers").innerText = membersData.length;

        const active = membersData.filter(m => m.status === "Paid").length;
        document.getElementById("activeMembers").innerText = active;

        totalRevenue = active * 500; // change price if needed
        document.getElementById("revenue").innerText = totalRevenue;
    });
}

loadMembers();


/* ================= RENDER ================= */
function renderMembers(data) {
    const table = document.getElementById("membershipTable");
    table.innerHTML = "";

    data.forEach((m, index) => {
        const status = m.status || "Pending";

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td>${m.phone}</td>
            <td>${m.plan}</td>
            <td>${m.startDate}</td>
            <td>${status}</td>
            <td>
                ${
                    status === "Paid"
                    ? `<button style="background:green;color:white;" onclick="togglePaid(${index}, 'Paid')">Paid</button>`
                    : `<button onclick="togglePaid(${index}, 'Pending')">Mark Paid</button>`
                }
            </td>
        </tr>`;
    });
}


/* ================= TOGGLE ================= */
function togglePaid(index, status) {
    const newStatus = status === "Paid" ? "Pending" : "Paid";

    fetch(`https://backend-4-v4ii.onrender.com/api/memberships/${index}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            email,
            password
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(() => {
        loadMembers();
    });
}


/* ================= SEARCH ================= */
function searchMember() {
    const value = document.getElementById("search").value.toLowerCase();

    const filtered = membersData.filter(m =>
        m.name.toLowerCase().includes(value) ||
        m.phone.includes(value)
    );

    renderMembers(filtered);
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = "admin.html";
}
