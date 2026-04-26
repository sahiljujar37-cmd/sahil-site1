// ================= LOAD DATA =================
let members = JSON.parse(localStorage.getItem("memberships")) || [];

// ================= RENDER =================
function renderMembers() {
    const table = document.getElementById("membershipTable");
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
                    ${m.status === "Active" ? "Unpaid" : "Paid"}
                </button>
                <button onclick="deleteMember(${m.id})">Delete</button>
            </td>
        </tr>`;
    });

    updateStats();
}

// ================= STATS =================
function updateStats() {
    document.getElementById("totalMembers").innerText = members.length;

    const active = members.filter(m => m.status === "Active").length;
    document.getElementById("activeMembers").innerText = active;
    document.getElementById("revenue").innerText = active * 500;
}

// ================= TOGGLE STATUS =================
window.toggleStatus = function (id) {
    members = members.map(m => {
        if (m.id === id) {
            m.status = m.status === "Active" ? "Pending" : "Active";
        }
        return m;
    });

    localStorage.setItem("memberships", JSON.stringify(members));
    renderMembers();
};

// ================= DELETE =================
window.deleteMember = function (id) {
    members = members.filter(m => m.id !== id);

    localStorage.setItem("memberships", JSON.stringify(members));
    renderMembers();
};

// ================= SEARCH =================
window.searchMember = function () {
    const value = document.getElementById("search").value.toLowerCase();

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
        </tr>`;
    });
};

// ================= LOGOUT =================
window.logout = function () {
    localStorage.clear();
    window.location.href = "admin.html";
};

// ================= INIT =================
renderMembers();
