// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    renderMembers();
    renderBookings();
});

// ================= CONFIG =================
const BASE_URL = "https://backend-4-v4ii.onrender.com/api";

function getAuthHeaders() {
    const email = localStorage.getItem("adminEmail");
    const password = localStorage.getItem("adminPassword");

    return { email, password };
}

// ================= MEMBERS =================
function renderMembers() {
    fetch(`${BASE_URL}/members`, {
        headers: getAuthHeaders()
    })
    .then(res => res.json())
    .then(members => {
        const table = document.getElementById("membershipTable");
        if (!table) return;

        table.innerHTML = "";

        members.forEach(m => {
            table.innerHTML += `
            <tr>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.phone}</td>
                <td>${m.plan}</td>
                <td>${m.startDate}</td>
                <td>${m.status}</td>
                <td>
                    <button onclick="toggleStatus(${m.id})">
                        ${m.status === "Active" ? "Pending" : "Active"}
                    </button>
                    <button onclick="deleteMember(${m.id})">Delete</button>
                </td>
            </tr>`;
        });

        updateStats(members);
    })
    .catch(err => console.error("Members Error:", err));
}

// ================= BOOKINGS =================
function renderBookings() {
    fetch(`${BASE_URL}/bookings`, {
        headers: getAuthHeaders()
    })
    .then(res => res.json())
    .then(bookings => {
        const table = document.getElementById("bookingTable");
        if (!table) return;

        table.innerHTML = "";

        bookings.forEach(b => {
            table.innerHTML += `
            <tr>
                <td>${b.name}</td>
                <td>${b.email}</td>
                <td>${b.phone}</td>
                <td>${b.service}</td>
                <td>${b.date}</td>
                <td>
                    <button onclick="deleteBooking(${b.id})">Delete</button>
                </td>
            </tr>`;
        });

        document.getElementById("totalBookings").innerText = bookings.length;
    })
    .catch(err => console.error("Bookings Error:", err));
}

// ================= STATS =================
function updateStats(members) {
    document.getElementById("totalMembers").innerText = members.length;

    const active = members.filter(m => m.status === "Active").length;

    document.getElementById("activeMembers").innerText = active;
    document.getElementById("revenue").innerText = active * 500;
}

// ================= ACTIONS =================

// Toggle Member Status
window.toggleStatus = function (id) {
    fetch(`${BASE_URL}/members/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({})
    })
    .then(() => renderMembers())
    .catch(err => console.error("Toggle Error:", err));
};

// Delete Member
window.deleteMember = function (id) {
    fetch(`${BASE_URL}/members/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    })
    .then(() => renderMembers())
    .catch(err => console.error("Delete Member Error:", err));
};

// Delete Booking
window.deleteBooking = function (id) {
    fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    })
    .then(() => renderBookings())
    .catch(err => console.error("Delete Booking Error:", err));
};

// ================= SEARCH =================
window.searchMember = function () {
    const value = document.getElementById("search").value.toLowerCase();

    fetch(`${BASE_URL}/members`, {
        headers: getAuthHeaders()
    })
    .then(res => res.json())
    .then(members => {
        const filtered = members.filter(m =>
            m.name.toLowerCase().includes(value) ||
            m.phone.includes(value)
        );

        const table = document.getElementById("membershipTable");
        table.innerHTML = "";

        filtered.forEach(m => {
            table.innerHTML += `
            <tr>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.phone}</td>
                <td>${m.plan}</td>
                <td>${m.startDate}</td>
                <td>${m.status}</td>
                <td>
                    <button onclick="toggleStatus(${m.id})">
                        ${m.status === "Active" ? "Pending" : "Active"}
                    </button>
                    <button onclick="deleteMember(${m.id})">Delete</button>
                </td>
            </tr>`;
        });
    });
};

// ================= LOGOUT =================
window.logout = function () {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    window.location.href = "admin.html";
};
