// ================= MOBILE MENU =================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ================= PLAN =================
let selectedPlanData = {};

// ================= SELECT PLAN =================
window.selectPlan = function (plan, price) {
    selectedPlanData = { plan, price };
    document.getElementById('membershipModal').style.display = 'flex';
};

window.closeModal = function () {
    document.getElementById('membershipModal').style.display = 'none';
};

// ================= SAVE MEMBERSHIP (LOCALSTORAGE) =================
document.getElementById('membershipForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const newMember = {
        id: Date.now(),
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        startDate: document.getElementById('startDate').value,
        plan: selectedPlanData.plan || "Basic",
        status: "Pending"
    };

    let members = JSON.parse(localStorage.getItem("memberships")) || [];
    members.push(newMember);

    localStorage.setItem("memberships", JSON.stringify(members));

    alert("Membership Added ✅");

    document.getElementById('membershipForm').reset();
    closeModal();
});
