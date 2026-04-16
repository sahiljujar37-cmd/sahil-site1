
let members = [];
let chart;

// LOGIN
function login(){
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if(email && pass){
    localStorage.setItem("token","admin");
    showDashboard();
  }
}

// LOGOUT
function logout(){
  localStorage.removeItem("token");
  location.reload();
}

// SHOW DASHBOARD
function showDashboard(){
  document.getElementById("loginPage").style.display="none";
  document.getElementById("dashboard").style.display="flex";
  initChart();
  render();
}

// SECTION SWITCH
function showSection(id){
  document.getElementById("home").style.display="none";
  document.getElementById("members").style.display="none";
  document.getElementById(id).style.display="block";
}

// ADD MEMBER
function addMember(){
  const name = document.getElementById("name").value;
  const fee = Number(document.getElementById("fee").value);

  if(!name || !fee) return;

  members.push({name, fee, paid:false});
  render();
}

// MARK PAID
function markPaid(i){
  members[i].paid = true;
  render();
}

// DELETE
function deleteMember(i){
  members.splice(i,1);
  render();
}

// RENDER TABLE + STATS
function render(){
  const table = document.getElementById("memberTable");
  table.innerHTML = "";

  let revenue = 0;

  members.forEach((m,i)=>{
    if(m.paid) revenue += m.fee;

    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>₹${m.fee}</td>
        <td>${m.paid ? "Paid" : "Pending"}</td>
        <td>
          <button class="action paid" onclick="markPaid(${i})">Paid</button>
          <button class="action delete" onclick="deleteMember(${i})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalMembers").innerText = members.length;
  document.getElementById("revenue").innerText = "₹" + revenue;

  updateChart(revenue);
}

// CHART
function initChart(){
  const ctx = document.getElementById("chart");

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:["Revenue"],
      datasets:[{
        label:"Revenue",
        data:[0]
      }]
    }
  });
}

function updateChart(revenue){
  chart.data.datasets[0].data = [revenue];
  chart.update();
}

// AUTO LOGIN CHECK
if(localStorage.getItem("token")){
  showDashboard();
}
