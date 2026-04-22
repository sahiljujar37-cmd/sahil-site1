const BASE_URL = "https://backend-4-v4ii.onrender.com";

// ================= BOOKINGS =================
async function getBookings() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`);
    
    if (!res.ok) throw new Error("Booking API not working");

    const data = await res.json();

    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    data.forEach(b => {
      list.innerHTML += `
        <tr>
          <td>${b.name || "-"}</td>
          <td>${b.service || "-"}</td>
          <td>${b.status || "Confirmed"}</td>
        </tr>
      `;
    });

    document.getElementById("totalBookings").innerText = data.length;

  } catch (err) {
    console.error(err);
    alert("❌ Booking API error");
  }
}

// ================= MEMBERS =================
async function getMembers() {
  try {
    const res = await fetch(`${BASE_URL}/api/members`);
    
    if (!res.ok) throw new Error("Member API not working");

    const data = await res.json();

    const list = document.getElementById("memberList");
    list.innerHTML = "";

    let active = 0;

    data.forEach(m => {
      if (m.status === "Active") active++;

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

  } catch (err) {
    console.error(err);
    alert("❌ Member API error");
  }
}

// ================= CONFIRM =================
async function confirmMember(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Active" })
    });

    if (!res.ok) throw new Error("Confirm failed");

    getMembers();

  } catch (err) {
    console.error(err);
    alert("❌ Confirm error");
  }
}

// ================= LOAD =================
window.onload = () => {
  getBookings();
  getMembers();
};
