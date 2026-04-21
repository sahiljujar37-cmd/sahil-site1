const BASE_URL = "https://backend-4-v4ii.onrender.com";

// SWITCH SECTION
function showSection(id){
  document.getElementById('booking').style.display='none';
  document.getElementById('members').style.display='none';

  document.getElementById(id).style.display='block';

  if(id === 'booking') loadBookings();
  if(id === 'members') loadMembers();
}

// LOAD BOOKINGS
function loadBookings(){
  fetch(`${BASE_URL}/api/bookings`)
  .then(res => res.json())
  .then(res => {
    const table = document.getElementById("bookingTable");
    table.innerHTML = "";

    res.data.forEach(b => {
      table.innerHTML += `
        <tr>
          <td>${b.name}</td>
          <td>${b.phone}</td>
          <td>${b.service}</td>
          <td>${b.date}</td>
          <td>
            <button onclick="convertToMember('${b.name}')">Add Member</button>
          </td>
        </tr>
      `;
    });
  });
}

// CONVERT BOOKING → MEMBER
function convertToMember(name){
  const fee = prompt("Enter fee:");

  if(!fee) return;

  fetch(`${BASE_URL}/api/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      fee: fee,
      paid: true
    })
  })
  .then(() => {
    alert("Member added!");
    loadMembers();
  });
}

// ADD MEMBER MANUAL
function addMember(){
  const name = document.getElementById('name').value;
  const fee = document.getElementById('fee').value;

  fetch(`${BASE_URL}/api/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, fee, paid: true })
  })
  .then(() => loadMembers());
}

// LOAD MEMBERS
function loadMembers(){
  fetch(`${BASE_URL}/api/members`)
  .then(res => res.json())
  .then(res => {
    const table = document.getElementById('memberTable');
    table.innerHTML = "";

    let revenue = 0;

    res.data.forEach(m => {
      if(m.paid) revenue += Number(m.fee || 0);

      table.innerHTML += `
        <tr>
          <td>${m.name}</td>
          <td>₹${m.fee}</td>
          <td>${m.paid ? 'Paid' : 'Pending'}</td>
        </tr>
      `;
    });

    document.getElementById("totalMembers").innerText = res.data.length;
    document.getElementById("revenue").innerText = revenue;
  });
}

// DEFAULT LOAD
showSection('booking');
