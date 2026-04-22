const BASE_URL = "https://backend-4-v4ii.onrender.com";

// ================= BOOKINGS =================
async function getBookings() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`);
    const data = await res.json();

    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    data.forEach(b => {
      list.innerHTML += `
        <tr>
          <td>${b.name || "-"}</td>
          <td>${b.service || "-"}</td>
          <td style="color:green;">${b.status || "Confirmed"}</td>
        </tr>
      `;
    });

    document.getElementById("totalBookings").innerText = data.length;

  } catch (err) {
    console.error("Booking fetch error:", err);
  }
}

// ================= MEMBERS =================
async function getMembers() {
  try {
    const res = await fetch(`${BASE_URL}/api/members`);
    const data = await res.json();

    const list = document.getElementById("memberList");
    list.innerHTML = "";

    let pending = 0;
    let active = 0;

    data.forEach(m => {

      if (m.status === "Pending") pending++;
      else active++;

      list.innerHTML += `
        <tr>
          <td>${m.name || "-"}</td>
          <td>${m.plan || "-"}</td>
          <td>${m.status || "Pending"}</td>
          <td>
            ${m.status === "Pending"
              ? `<button onclick="confirmMember('${m._id}')">Confirm</button>`
              : "✔"}
          </td>
        </tr>
      `;
    });

    document.getElementById("totalMembers").innerText = data.length;
    document.getElementById("pending").innerText = pending;
    document.getElementById("active").innerText = active;

  } catch (err) {
    console.error("Member fetch error:", err);
  }
}

// ================= CONFIRM MEMBER =================
async function confirmMember(id) {
  try {
    await fetch(`${BASE_URL}/api/members/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Active" })
    });

    getMembers(); // refresh list

  } catch (err) {
    console.error("Confirm error:", err);
  }
}

// ================= AUTO LOAD =================
window.onload = function () {
  getBookings();
  getMembers();
};
