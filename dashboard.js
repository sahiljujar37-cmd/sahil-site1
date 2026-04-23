const email = localStorage.getItem("adminEmail");
const password = localStorage.getItem("adminPassword");

if (!email || !password) {
    window.location.href = "admin.html";
}

let membersData = [];
let bookingsData = [];

/* ================= BOOKINGS ================= */
function loadBookings() {
    fetch("https://backend-4-v4ii.onrender.com/api/bookings", {
        headers: { email, password }
    })
    .then(res => res.json())
    .then(data => {
        bookingsData = data.data || [];

        document.getElementById("totalBookings").innerText = bookingsData.length;

        const table = document.getElementById("bookingTable");
        table.innerHTML = "";

        bookingsData.forEach(b => {
            table.innerHTML += `
            <tr>
                <td>${b.name}</td>
                <td>${b.email}</td>
                <td>${b.phone}</td>
                <td>${b.service}</td>
                <td>${b.date}</td>
            </tr>`;
        });
    })
    .catch(() => {
        console.log("Booking load failed");
    });
}


/* ================= MEMBERS ================= */
function loadMembers() {
    fetch("https://backend-4-v4ii.onrender.com/api/memberships", {
        headers: { email, password }
    })
    .then(res => res.json())
    .then(data => {
        membersData = data.data || [];

        renderMembers(membersData);

        // ✅ FIX stats
        document.getElementById("totalMembers").innerText = membersData.length;

        const active = membersData.filter(m => m.status === "Paid").length;
        document.getElementById("activeMembers").innerText = active;

        document.getElementById("revenue").innerText = active * 500;
    })
    .catch(() => {
        console.log("Members load failed");
    });
}


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


/* ================= TOGGLE (REAL FIX) ================= */
function togglePaid(index, currentStatus) {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";

    fetch(`https://backend-4-v4ii.onrender.com/api/memberships/${index}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            email,
            password
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(() => {
        // ✅ IMPORTANT: reload from backend
        loadMembers();
    })
    .catch(() => {
        alert("Update failed ❌");
    });
}


/* ================= SEARCH (FIXED) ================= */
function searchMember() {
    const input = document.getElementById("search");
    if (!input) return;

    const value = input.value.toLowerCase();

    const filtered = membersData.filter(m =>
        (m.name && m.name.toLowerCase().includes(value)) ||
        (m.phone && m.phone.includes(value))
    );

    renderMembers(filtered);
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = "admin.html";
}


/* ================= LOAD ALL ================= */
loadBookings();
loadMembers();
