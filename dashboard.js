const BASE_URL = "https://backend-4-v4ii.onrender.com";

// 🔐 CHECK LOGIN
if(localStorage.getItem("adminLogin") !== "true"){
  window.location.href = "admin.html";
}

// 🚪 LOGOUT
function logout(){
  localStorage.removeItem("adminLogin");
  window.location.href = "admin.html";
}

// 📂 SECTION SWITCH
function showSection(id){
  document.getElementById('home').style.display='none';
  document.getElementById('members').style.display='none';
  document.getElementById('booking').style.display='none';

  document.getElementById(id).style.display='block';

  if(id === 'booking') loadBookings();
}

// ➕ ADD MEMBER
function addMember(){
  const name = document.getElementById('name').value;
  const fee = document.getElementById('fee').value;
  const plan = document.getElementById('plan').value;

  fetch(`${BASE_URL}/api/members`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name, fee, plan})
  })
  .then(()=> {
    document.getElementById('name').value="";
    document.getElementById('fee').value="";
    document.getElementById('plan').value="";
    loadMembers();
  });
}

// 📋 LOAD MEMBERS
function loadMembers(){
  fetch(`${BASE_URL}/api/members`)
  .then(res=>res.json())
  .then(data=>{
    const table = document.getElementById("memberTable");
    table.innerHTML="";

    let revenue = 0;

    data.forEach(m=>{
      if(m.paid) revenue += Number(m.fee);

      table.innerHTML += `
        <tr>
          <td>${m.name}</td>
          <td>₹${m.fee}</td>
          <td>${m.plan || '-'}</td>
          <td>${m.paid ? 'Paid':'Pending'}</td>
          <td>
            <button onclick="markPaid(${m.id})">Paid</button>
            <button onclick="deleteMember(${m.id})">Delete</button>
          </td>
        </tr>
      `;
    });

    document.getElementById("totalMembers").innerText = data.length;
    document.getElementById("revenue").innerText = revenue;
  });
}

// 🔍 SEARCH MEMBER
function searchMember(){
  const value = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(row=>{
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
}

// 💰 MARK PAID
function markPaid(id){
  if(confirm("Confirm payment?")){
    fetch(`${BASE_URL}/api/members/${id}/pay`, {method:"PUT"})
    .then(()=>loadMembers());
  }
}

// ❌ DELETE MEMBER
function deleteMember(id){
  fetch(`${BASE_URL}/api/members/${id}`, {method:"DELETE"})
  .then(()=>loadMembers());
}

// 📅 LOAD BOOKINGS
function loadBookings(){
  fetch(`${BASE_URL}/api/bookings`)
  .then(res=>res.json())
  .then(data=>{
    console.log(data); // debug

    const table = document.getElementById("bookingTable");
    table.innerHTML="";

    data.forEach(b=>{
      table.innerHTML += `
        <tr>
          <td>${b.name}</td>
          <td>${b.date}</td>
          <td>${b.slot}</td>
        </tr>
      `;
    });
  });
}

// 🚀 INIT
loadMembers();
loadBookings();
