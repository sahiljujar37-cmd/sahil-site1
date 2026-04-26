// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    renderMembers();
    renderBookings();
});

// ================= STORAGE =================
function getMembers() {
    return JSON.parse(localStorage.getItem("memberships")) || [];
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

// ================= MEMBERS =================
function renderMembers(data = null) {
    const members = data || getMembers();
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
        </tr>
        `;
    });

    updateStats();
}

// ================= BOOKINGS =================
function renderBookings() {
    const bookings = getBookings();
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
        </tr>
        `;
    });

    document.getElementById("totalBookings").innerText = bookings.length;
}

// ================= STATS =================
function updateStats() {
    const members = getMembers();

    document.getElementById("totalMembers").innerText = members.length;

    const active = members.filter(m => m.status === "Active").length;

    document.getElementById("activeMembers").innerText = active;
    document.getElementById("revenue").innerText = active * 500;
}

// ================= ACTIONS =================
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

window.deleteMember = function (id) {
    let members = getMembers();

    members = members.filter(m => m.id !== id);

    localStorage.setItem("memberships", JSON.stringify(members));
    renderMembers();
};

window.deleteBooking = function (id) {
    let bookings = getBookings();

    bookings = bookings.filter(b => b.id !== id);

    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
};

// ================= SEARCH =================
window.searchMember = function () {
    const value = document.getElementById("search").value.toLowerCase();

    const members = getMembers();

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(value) ||
        m.phone.includes(value)
    );

    renderMembers(filtered);
};

// ================= LOGOUT =================
window.logout = function () {
    window.location.href = "admin.html";
};
