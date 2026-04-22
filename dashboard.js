const BASE_URL = "https://backend-4-v4ii.onrender.com";

// Show error on screen
function showError(msg) {
  document.body.innerHTML += `<p style="color:red;">${msg}</p>`;
}

// ================= BOOKINGS =================
async function getBookings() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`);
    
    if (!res.ok) throw new Error("Bookings API not working");

    const data = await res.json();
    console.log("Bookings:", data);

    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    data.forEach(b => {
      list.innerHTML += `
        <tr>
          <td>${b.name}</td>
          <td>${b.service}</td>
          <td>${b.status || "Confirmed"}</td>
        </tr>
      `;
    });

    document.getElementById("totalBookings").innerText = data.length;

  } catch (err) {
    console.error(err);
    showError("❌ Booking API error: " + err.message);
  }
}

// ================= MEMBERS =================
async function getMembers() {
  try {
    const res = await fetch(`${BASE_URL}/api/members`);
    
    if (!res.ok) throw new Error("Members API not working");

    const data = await res.json();
    console.log("Members:", data);

    const list = document.getElementById("memberList");
    list.innerHTML = "";

    let pending = 0;
    let active = 0;

    data.forEach(m => {

      if (m.status === "Pending") pending++;
      else active++;

      list.innerHTML += `
        <tr>
          <td>${m.name}</td>
          <td>${m.plan}</td>
          <td>${m.status}</td>
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
    console.error(err);
    showError("❌ Member API error: " + err.message);
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
    showError("❌ Confirm error: " + err.message);
  }
}

// ================= LOAD =================
window.onload = () => {
  getBookings();
  getMembers();
};
