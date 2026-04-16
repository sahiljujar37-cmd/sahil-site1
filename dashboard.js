let members = [];
}

function logout(){
  localStorage.removeItem('token');
  location.reload();
}

function showSection(id){
  document.getElementById('home').style.display='none';
  document.getElementById('members').style.display='none';
  document.getElementById(id).style.display='block';
}

function addMember(){
  const name = document.getElementById('name').value;
  const fee = Number(document.getElementById('fee').value);

  members.push({name, fee, paid:false});
  render();
}

function markPaid(index){
  members[index].paid = true;
  render();
}

function deleteMember(index){
  members.splice(index,1);
  render();
}

function render(){
  const table = document.getElementById('memberTable');
  table.innerHTML='';

  let revenue = 0;

  members.forEach((m,i)=>{
    if(m.paid) revenue += m.fee;

    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>₹${m.fee}</td>
        <td>${m.paid ? 'Paid' : 'Pending'}</td>
        <td>
          <button class='action paid' onclick='markPaid(${i})'>Paid</button>
          <button class='action delete' onclick='deleteMember(${i})'>Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById('totalMembers').innerText = members.length;
  document.getElementById('revenue').innerText = '₹' + revenue;

  updateChart();
}

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

function updateChart(){
  if(chart){
    chart.data.datasets[0].data = [
      members.filter(m=>m.paid).reduce((a,b)=>a+b.fee,0)
    ];
    chart.update();
  }
}

if(localStorage.getItem('token')){
  document.getElementById('loginPage').style.display='none';
  document.getElementById('dashboard').style.display='flex';
  initChart();
}
