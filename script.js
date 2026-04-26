
// ================= GLOBAL =================
let selectedPlan = {};

// ================= NAVBAR MENU =================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// ================= SELECT PLAN =================
window.selectPlan = function (plan, price) {
    selectedPlan = { plan, price };

    document.getElementById("selectedPlan").innerText = plan;
    document.getElementById("selectedPrice").innerText = price;

    document.getElementById("membershipModal").style.display = "flex";
};

// ================= CLOSE MODAL =================
window.closeModal = function () {
    document.getElementById("membershipModal").style.display = "none";
};

// ================= CLOSE ON OUTSIDE CLICK =================
window.addEventListener("click", (e) => {
    const modal = document.getElementById("membershipModal");
    if (e.target === modal) {
        closeModal();
    }
});

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
        price: selectedPlan.price || 0,
        status: "Pending"
    };

    members.push(newMember);
    localStorage.setItem("memberships", JSON.stringify(members));

    alert("Membership Registered ✅");

    document.getElementById("membershipForm").reset();
    closeModal();
});

// ================= SAVE BOOKING =================
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

    alert("Booking Successful ✅");

    document.getElementById("bookingForm").reset();
});

// ================= BMI CALCULATOR =================
window.calculateBMI = function () {
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;

    if (!height || !weight) {
        alert("Enter valid values");
        return;
    }

    const h = height / 100;
    const bmi = (weight / (h * h)).toFixed(1);

    let category = "";
    let color = "";

    if (bmi < 18.5) {
        category = "Underweight";
        color = "orange";
    } else if (bmi < 25) {
        category = "Normal";
        color = "green";
    } else if (bmi < 30) {
        category = "Overweight";
        color = "orange";
    } else {
        category = "Obese";
        color = "red";
    }

    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("bmiCategory").innerText = category;
    document.getElementById("bmiCategory").style.color = color;

    document.getElementById("bmiResult").style.display = "block";
};

// ================= NAVBAR SCROLL EFFECT =================
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = "rgba(0,0,0,0.95)";
        } else {
            navbar.style.background = "rgba(0,0,0,0.7)";
        }
    }
});

// ================= SET MIN DATE =================
window.addEventListener("load", () => {
    const dateInput = document.getElementById("date");
    const startDate = document.getElementById("startDate");

    const today = new Date().toISOString().split("T")[0];

    if (dateInput) dateInput.setAttribute("min", today);
    if (startDate) startDate.setAttribute("min", today);
});
