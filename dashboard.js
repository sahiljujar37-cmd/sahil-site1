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
                            ? `<button id="btn-${index}" style="background:green;color:white;" onclick="togglePaid(${index}, 'Paid')">Paid</button>`
                            : `<button id="btn-${index}" onclick="togglePaid(${index}, 'Pending')">Mark Paid</button>`
                        }
                    </td>
                </tr>
            `;
        });
    })
    .catch(err => {
        console.error("Load error:", err);
    });
}

loadMemberships();


/* ================= TOGGLE PAID ================= */
function togglePaid(index, currentStatus) {
    const btn = document.getElementById(`btn-${index}`);
    let newStatus;

    if (currentStatus === "Paid") {
        // Change to Pending
        newStatus = "Pending";

        btn.innerText = "Mark Paid";
        btn.style.background = "";
        btn.style.color = "";
        btn.setAttribute("onclick", `togglePaid(${index}, 'Pending')`);
    } else {
        // Change to Paid
        newStatus = "Paid";

        btn.innerText = "Paid";
        btn.style.background = "green";
        btn.style.color = "white";
        btn.setAttribute("onclick", `togglePaid(${index}, 'Paid')`);
    }

    // Update backend
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
        console.log("Updated:", newStatus);
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Update failed ❌");
    });
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    window.location.href = "admin.html";
}
