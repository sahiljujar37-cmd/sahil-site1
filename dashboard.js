const API = "https://backend-4-v4ii.onrender.com";

async function loadDashboard() {
  let members = await fetch(`${API}/members`).then(r => r.json());
  let bookings = await fetch(`${API}/bookings`).then(r => r.json());
  let payments = await fetch(`${API}/payments`).then(r => r.json());

  document.getElementById("m").innerText = members.length;
  document.getElementById("b").innerText = bookings.length;

  let total = 0;
  payments.forEach(p => total += Number(p.amount));

  document.getElementById("r").innerText = total;
}

loadDashboard();
