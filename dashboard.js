const API = "https://backend-4-v4ii.onrender.com"; // change when deployed

let chart;

// LOGIN
function login() {
  fetch(API + "/api/admin/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("token", "loggedin");
      location.reload();
    } else {
      alert("Invalid login");
    }
  });
}

// LOGOUT
function logout(){
  localStorage.removeItem('token');
  location.reload();
}

// SHOW SECTION
function showSection(id){
  document.getElementById('home').style.display='none';
  document.getElementById('members').style.display='none';
  document.getElementById(id).style.display='block';
}

// ADD MEMBER
function addMember(){
  const name = document.getElementById('name').value;
  const fee = document.getElementById('fee').value;

  fetch(API + "/api/members", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, fee })
  })
  .then(() => loadMembers());
}

// LOAD MEMBERS
function loadMembers(){
  fetch(API + "/api/members")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('memberTable');
      table.innerHTML = "";

      let revenue = 0;

      data.forEach(m => {
        if (m.paid) revenue += Number(m.fee);

        table.innerHTML += `
          <tr>
            <td>${m.name}</td>
            <td>₹${m.fee}</td>
            <td>${m.paid ? 'Paid' : 'Pending'}</td>
            <td>
              <button onclick="markPaid(${m.id})">Paid</button>
              <button onclick="deleteMember(${m.id})">Delete</button>
            </td>
          </tr>
        `;
      });

      document.getElementById("totalMembers").innerText = data.length;
      document.getElementById("revenue").innerText = "₹" + revenue;

      updateChart(revenue);
    });
}

// MARK PAID
function markPaid(id){
  fetch(API + `/api/members/${id}/pay`, {
    method: "PUT"
  })
  .then(() => loadMembers());
}

// DELETE
function deleteMember(id){
  fetch(API + `/api/members/${id}`, {
    method: "DELETE"
  })
  .then(() => loadMembers());
}

// CHART
function initChart(){
  const ctx = document.getElementById('chart');

  chart = new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Revenue'],
      datasets:[{
        label:'Revenue',
        data:[0]
      }]
    }
  });
}

function updateChart(value){
  if(chart){
    chart.data.datasets[0].data = [value];
    chart.update();
  }
}

// INIT
if(localStorage.getItem('token')){
  document.getElementById('loginPage').style.display='none';
  document.getElementById('dashboard').style.display='flex';

  initChart();
  loadMembers();
}
