// ================= PLAN =================
let selectedPlan = {};

// ================= SELECT PLAN =================
window.selectPlan = function (plan, price) {
    selectedPlan = { plan, price };

    document.getElementById("selectedPlan").innerText = plan;
    document.getElementById("selectedPrice").innerText = price;

    document.getElementById("membershipModal").style.display = "flex";
};

window.closeModal = function () {
    document.getElementById("membershipModal").style.display = "none";
};

// ================= SAVE MEMBERSHIP =================
document.getElementById("membershipForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let members = JSON.parse(localStorage.getItem("memberships")) || [];

    const newMember = {
        id: Date.now(),
        name: document.getElementById("memberName").value,
        email: document.getElementById("memberEmail").value,
        phone: document.getElementById("memberPhone").value,
        startDate: document.getElementById("startDate").value,
        plan: selectedPlan.plan || "Basic",
        status: "Pending"
    };

    members.push(newMember);
    localStorage.setItem("memberships", JSON.stringify(members));

    alert("Membership Added ✅");

    document.getElementById("membershipForm").reset();
    closeModal();
});

// ================= BOOKING =================
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const newBooking = {
        id: Date.now(),
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        service: document.getElementById("service").value,
        date: document.getElementById("date").value,
        message: document.getElementById("message").value
    };

    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Booking Done ✅");

    document.getElementById("bookingForm").reset();
});

// ================= BMI =================
window.calculateBMI = function () {
    const h = document.getElementById("height").value;
    const w = document.getElementById("weight").value;

    const bmi = (w / ((h / 100) ** 2)).toFixed(1);

    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("bmiResult").style.display = "block";
};
