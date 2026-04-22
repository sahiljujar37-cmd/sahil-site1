let bookings = [];
let members = [];

// Booking
function addBooking() {
  const name = document.getElementById("bName").value;
  const service = document.getElementById("bService").value;

  if (!name || !service) return alert("Fill all fields");

  bookings.push({ name, service, status: "Confirmed" });
  renderBookings();
}

function renderBookings() {
  const list = document.getElementById("bookingList");
  list.innerHTML = "";

  bookings.forEach(b => {
    list.innerHTML += `
      <tr>
        <td>${b.name}</td>
        <td>${b.service}</td>
        <td style="color:green;">${b.status}</td>
      </tr>
    `;
  });

  document.getElementById("totalBookings").innerText = bookings.length;
}

// Membership
function addMember() {
  const name = document.getElementById("mName").value;
  const plan = document.getElementById("mPlan").value;

  if (!name || !plan) return alert("Fill all fields");

  members.push({ name, plan, status: "Pending" });
  renderMembers();
}

function confirmMember(index) {
  members[index].status = "Active";
  renderMembers();
}

function renderMembers() {
  const list = document.getElementById("memberList");
  list.innerHTML = "";

  let pending = 0;
  let active = 0;

  members.forEach((m, i) => {
    if (m.status === "Pending") pending++;
    else active++;

    list.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.plan}</td>
        <td>${m.status}</td>
        <td>
          ${m.status === "Pending"
            ? `<button onclick="confirmMember(${i})">Confirm</button>`
            : "✔"}
        </td>
      </tr>
    `;
  });

  document.getElementById("totalMembers").innerText = members.length;
  document.getElementById("pending").innerText = pending;
  document.getElementById("active").innerText = active;
}
