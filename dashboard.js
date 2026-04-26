// ================= SAFE INIT =================
document.addEventListener("DOMContentLoaded", function () {
    renderMembers();
    renderBookings();
});

// ================= GET DATA =================
function getMembers() {
    return JSON.parse(localStorage.getItem("memberships")) || [];
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

// ================= RENDER MEMBERS =================
function renderMembers() {
    const members = getMembers();
    const table = document.getElementById("membershipTable");

    if (!table) return; // prevent crash

    table.innerHTML = "";

    members.forEach(m => {
        table.innerHTML += `
        <tr>
            <td>${m.name || "-"}</td>
            <td>${m.email || "-"}</td>
            <td>${m.phone || "-"}</td>
            <td>${m.plan || "-"}</td>
            <td>${m.startDate || "-"}</td>
            <td>${m.status || "Pending"}</td>
            <td>
                <button onclick="toggleStatus(${m.id})">
                    ${m.status === "Active" ? "Mark Pending" : "Mark Active"}
                </button>
                <button onclick="deleteMember(${m.id})">Delete</button>
            </td>
        </tr>
        `;
    });

    updateStats();
}

// ================= RENDER BOOKINGS =================
function renderBookings() {
    const bookings = getBookings();
    const table = document.getElementById("bookingTable");

    if (!table) return;

    table.innerHTML = "";

    bookings.forEach(b => {
        table.innerHTML += `
        <tr>
            <td>${b.name || "-"}</td>
            <td>${b.email || "-"}</td>
            <td>${b.phone || "-"}</td>
            <td>${b.service || "-"}</td>
            <td>${b.date || "-"}</td>
            <td>
                <button onclick="deleteBooking(${b.id})">Delete</button>
            </td>
        </tr>
        `;
    });

    const total = document.getElementById("totalBookings");
    if (total) total.innerText = bookings.length;
}

// ================= STATS =================
function updateStats() {
    const members = getMembers();

    const total = document.getElementById("totalMembers");
    const active = document.getElementById("activeMembers");
    const revenue = document.getElementById("revenue");

    if (total) total.innerText = members.length;

    const activeCount = members.filter(m => m.status === "Active").length;

    if (active) active.innerText = activeCount;
    if (revenue) revenue.innerText = activeCount * 500;
}

// ================= TOGGLE STATUS =================
window.toggleStatus = function (id) {
    let members = getMembers();

    members = members.map(m => {
        if (m.id === id) {
            m.status = m.status === "Active" ? "Pending" : "Active";
        }
        return m;
    });

    localStorage.setItem("memberships", JSON.stringify(members));
    renderMembers();
};

// ================= DELETE MEMBER =================
window.deleteMember = function (id) {
    let members = getMembers();

    members = members.filter(m => m.id !== id);

    localStorage.setItem("memberships", JSON.stringify(members));
    renderMembers();
};

// ================= DELETE BOOKING =================
window.deleteBooking = function (id) {
    let bookings = getBookings();

    bookings = bookings.filter(b => b.id !== id);

    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
};

// ================= SEARCH =================
window.searchMember = function () {
    const value = document.getElementById("search")?.value.toLowerCase();
    const members = getMembers();

    const filtered = members.filter(m =>
        (m.name && m.name.toLowerCase().includes(value)) ||
        (m.phone && m.phone.includes(value))
    );

    const table = document.getElementById("membershipTable");
    if (!table) return;

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
        </tr>
        `;
    });
};

// ================= LOGOUT (FIXED) =================
window.logout = function () {
    // simple logout
    window.location.href = "admin.html";
};
