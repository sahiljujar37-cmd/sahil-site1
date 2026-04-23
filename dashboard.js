const email = localStorage.getItem("adminEmail");
const password = localStorage.getItem("adminPassword");

// Redirect if not logged in
if (!email || !password) {
    window.location.href = "admin.html";
}

/* ================= BOOKINGS ================= */
fetch("https://backend-4-v4ii.onrender.com/api/bookings", {
    headers: { email, password }
})
.then(res => res.json())
.then(data => {
    const table = document.getElementById("bookingTable");
    table.innerHTML = "";

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


/* ================= MEMBERSHIPS ================= */
function loadMemberships() {
    fetch("https://backend-4-v4ii.onrender.com/api/memberships", {
        headers: { email, password }
    })
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("membershipTable");
        table.innerHTML = "";

        data.data.forEach((m, index) => {
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
                            ? `<button style="background:green;color:white;" disabled>Paid</button>`
                            : `<button id="btn-${index}" onclick="markPaid(${index})">Mark Paid</button>`
                        }
                    </td>
                </tr>
            `;
        });
    });
}

loadMemberships();


/* ================= MARK AS PAID ================= */
function markPaid(index) {
    const btn = document.getElementById(`btn-${index}`);

    // 🔥 Instant UI change
    btn.innerText = "Paid";
    btn.style.background = "green";
    btn.style.color = "white";
    btn.disabled = true;

    // Backend update
    fetch(`https://backend-4-v4ii.onrender.com/api/memberships/${index}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            email,
            password
        },
        body: JSON.stringify({ status: "Paid" })
    })
    .then(res => res.json())
    .then(() => {
        console.log("Updated in backend");
    })
    .catch(() => {
        alert("Error saving ❌");
    });
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = "admin.html";
}
