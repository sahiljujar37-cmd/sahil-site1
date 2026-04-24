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

        bookingsData.forEach((b) => {
            table.innerHTML += `
            <tr>
                <td>${b.name}</td>
                <td>${b.email}</td>
                <td>${b.phone}</td>
                <td>${b.service}</td>
                <td>${b.date}</td>
                <td>
                    <button class="delete-btn" onclick="deleteBooking('${b._id}')">
                        Delete
                    </button>
                </td>
            </tr>`;
        });
    })
    .catch(() => alert("Failed to load bookings ❌"));
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
        updateStats();
    })
    .catch(() => alert("Failed to load members ❌"));
}


/* ================= UPDATE STATS ================= */
function updateStats() {
    document.getElementById("totalMembers").innerText = membersData.length;

    const active = membersData.filter(m => m.status === "Active").length;
    document.getElementById("activeMembers").innerText = active;

    const revenue = active * 500;
    document.getElementById("revenue").innerText = revenue;
}


/* ================= RENDER MEMBERS ================= */
function renderMembers(data) {
    const table = document.getElementById("membershipTable");
    table.innerHTML = "";

    data.forEach((m) => {
        const status = m.status || "Pending";

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td>${m.phone}</td>
            <td>${m.plan}</td>
            <td>${m.startDate}</td>
            <td class="${status === 'Active' ? 'status-active' : 'status-pending'}">
                ${status}
            </td>
            <td>
                <button class="paid-btn"
                    onclick="toggleStatus('${m._id}', '${status}')">
                    ${status === "Active" ? "Deactivate" : "Mark Paid"}
                </button>

                <button class="delete-btn"
                    onclick="deleteMember('${m._id}')">
                    Delete
                </button>
            </td>
        </tr>`;
    });
}


/* ================= TOGGLE STATUS ================= */
function toggleStatus(id, currentStatus) {

    const newStatus = currentStatus === "Active" ? "Pending" : "Active";

    fetch(`https://backend-4-v4ii.onrender.com/api/memberships/${id}`, {
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
        loadMembers(); // reload correct data
    })
    .catch(() => alert("Update failed ❌"));
}


/* ================= DELETE BOOKING ================= */
function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;

    fetch(`https://backend-4-v4ii.onrender.com/api/bookings/${id}`, {
        method: "DELETE",
        headers: { email, password }
    })
    .then(() => loadBookings())
    .catch(() => alert("Delete failed ❌"));
}


/* ================= DELETE MEMBER ================= */
function deleteMember(id) {
    if (!confirm("Delete this member?")) return;

    fetch(`https://backend-4-v4ii.onrender.com/api/memberships/${id}`, {
        method: "DELETE",
        headers: { email, password }
    })
    .then(() => loadMembers())
    .catch(() => alert("Delete failed ❌"));
}


/* ================= SEARCH ================= */
function searchMember() {
    const value = document.getElementById("search").value.toLowerCase();

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


/* ================= INIT ================= */
loadBookings();
loadMembers();
