const email = localStorage.getItem("adminEmail");
const password = localStorage.getItem("adminPassword");

if (!email || !password) {
    window.location.href = "admin.html";
}

let membersData = [];
let bookingsData = [];
let revenue = 0;

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

        document.getElementById("totalMembers").innerText = membersData.length;

        const active = membersData.filter(m => m.status === "Paid").length;
        document.getElementById("activeMembers").innerText = active;

        revenue = active * 500;
        document.getElementById("revenue").innerText = revenue;
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
                <button class="pay-btn" 
                    data-index="${index}" 
                    data-status="${status}"
                    style="${status === 'Paid' ? 'background:green;color:white;' : ''}">
                    ${status === "Paid" ? "Paid" : "Mark Paid"}
                </button>
            </td>
        </tr>`;
    });
}


/* ================= CLICK HANDLER ================= */
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("pay-btn")) {

        const btn = e.target;
        const index = btn.getAttribute("data-index");
        const currentStatus = btn.getAttribute("data-status");

        const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";

        // 🔥 INSTANT UI CHANGE
        if (newStatus === "Paid") {
            btn.innerText = "Paid";
            btn.style.background = "green";
            btn.style.color = "white";
        } else {
            btn.innerText = "Mark Paid";
            btn.style.background = "";
            btn.style.color = "";
        }

        btn.setAttribute("data-status", newStatus);

        // 🔥 UPDATE REVENUE INSTANTLY
        if (newStatus === "Paid") {
            revenue += 500;
        } else {
            revenue -= 500;
        }
        document.getElementById("revenue").innerText = revenue;

        // 🔥 BACKEND UPDATE
        fetch(`https://backend-4-v4ii.onrender.com/api/memberships/${index}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                email,
                password
            },
            body: JSON.stringify({ status: newStatus })
        })
        .catch(() => {
            alert("Server error ❌");
        });
    }
});


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


/* ================= LOAD ================= */
loadBookings();
loadMembers();
