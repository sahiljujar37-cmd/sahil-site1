// ================= IMPORT =================
import { db } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= MOBILE MENU =================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ================= BMI =================
window.calculateBMI = function () {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!height || !weight) return alert("Enter valid values");

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    document.getElementById('bmiValue').innerText = bmi;
    document.getElementById('bmiResult').style.display = 'block';
};

// ================= PLAN SELECT =================
let selectedPlanData = {};

window.selectPlan = function (plan, price) {
    selectedPlanData = { plan, price };

    document.getElementById('selectedPlan').innerText = plan;
    document.getElementById('selectedPrice').innerText = price;

    document.getElementById('membershipModal').style.display = 'flex';
};

window.closeModal = function () {
    document.getElementById('membershipModal').style.display = 'none';
};

// ================= MEMBERSHIP SAVE (MAIN FIX) =================
document.getElementById('membershipForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        startDate: document.getElementById('startDate').value,
        plan: selectedPlanData.plan,
        status: "Pending"
    };

    try {
        await addDoc(collection(db, "memberships"), data);

        alert("Membership Added ✅");

        document.getElementById('membershipForm').reset();

        setTimeout(() => closeModal(), 1500);

    } catch (err) {
        console.error(err);
        alert("Error saving ❌");
    }
});

// ================= BOOKING (OPTIONAL KEEP BACKEND) =================
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value
    };

    try {
        await fetch("https://backend-4-v4ii.onrender.com/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        alert("Booking done ✅");

    } catch {
        alert("Error ❌");
    }
});
