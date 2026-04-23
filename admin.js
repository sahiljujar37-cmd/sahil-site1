const API = "https://backend-4-v4ii.onrender.com";

let members = [];
let bookings = [];
let payments = [];

function show(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ================= MEMBERS ================= */

async function loadMembers() {
  const res = await fetch(`${API}/members`);
  members = await res.json();
  renderMembers();
}

async function addMember() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;

  await fetch(`${API}/members`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, phone, status: "Unpaid" })
  });

  loadMembers();
}

function renderMembers() {
  let table = document.getElementById("memberTable");
  let select = document.getElementById("memberSelect");

  table.innerHTML = "";
  select.innerHTML = "";

  members.forEach((m, i) => {
    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.phone}</td>
        <td>${m.status}</td>
      </tr>
    `;

    select.innerHTML += `<option value="${m._id}">${m.name}</option>`;
  });
}

/* ================= BOOKINGS ================= */

async function loadBookings() {
  const res = await fetch(`${API}/bookings`);
  bookings = await res.json();
  renderBookings();
}

async function addBooking() {
  let name = document.getElementById("bname").value;
  let time = document.getElementById("time").value;

  await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, time })
  });

  loadBookings();
}

function renderBookings() {
  let table = document.getElementById("bookingTable");
  table.innerHTML = "";

  bookings.forEach(b => {
    table.innerHTML += `
      <tr>
        <td>${b.name}</td>
        <td>${b.time}</td>
      </tr>
    `;
  });
}

/* ================= PAYMENTS ================= */

async function loadPayments() {
  const res = await fetch(`${API}/payments`);
  payments = await res.json();
  renderPayments();
}

async function pay() {
  let memberId = document.getElementById("memberSelect").value;
  let amount = document.getElementById("amount").value;

  await fetch(`${API}/payments`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ memberId, amount })
  });

  alert("Payment saved ✅");

  loadPayments();
  loadMembers(); // update status
}

function renderPayments() {
  let list = document.getElementById("paymentList");
  list.innerHTML = "";

  payments.forEach(p => {
    list.innerHTML += `<li>${p.name || p.memberId} paid ₹${p.amount}</li>`;
  });
}

/* ================= INIT ================= */

window.onload = () => {
  show("members");
  loadMembers();
  loadBookings();
  loadPayments();
};
