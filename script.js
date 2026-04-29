 · JS
Copy

// ================= GLOBAL =================
let selectedPlan = {};
 
// ================= SUCCESS POPUP =================
function showSuccessPopup(message) {
    const existing = document.getElementById("successPopup");
    if (existing) existing.remove();
 
    const popup = document.createElement("div");
    popup.id = "successPopup";
    popup.innerHTML = `
        <div style="
            position: fixed; top: 30px; left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: linear-gradient(135deg, #1a7a4a, #22c55e);
            color: #fff; padding: 18px 36px; border-radius: 12px;
            box-shadow: 0 8px 32px rgba(34,197,94,0.35);
            display: flex; align-items: center; gap: 14px;
            font-family: 'Segoe UI', sans-serif; font-size: 16px; font-weight: 600;
            z-index: 99999; opacity: 0;
            transition: opacity 0.35s ease, transform 0.35s ease;
            min-width: 280px; max-width: 90vw;">
            <span style="font-size:26px;">✅</span>
            <span>${message}</span>
        </div>`;
    document.body.appendChild(popup);
 
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const box = popup.firstElementChild;
            box.style.opacity = "1";
            box.style.transform = "translateX(-50%) translateY(0)";
        });
    });
 
    setTimeout(() => {
        const box = popup.firstElementChild;
        box.style.opacity = "0";
        box.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(() => popup.remove(), 400);
    }, 3000);
}
 
// ================= NAVBAR MENU =================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
 
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}
 
// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
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
 
window.addEventListener("click", (e) => {
    const modal = document.getElementById("membershipModal");
    if (e.target === modal) closeModal();
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
    showSuccessPopup("Membership Registered Successfully!");
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
    showSuccessPopup("Booking Confirmed Successfully!");
    document.getElementById("bookingForm").reset();
});
 
// ================= BMI CALCULATOR =================
window.calculateBMI = function () {
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    if (!height || !weight) { alert("Enter valid values"); return; }
    const h = height / 100;
    const bmi = (weight / (h * h)).toFixed(1);
    let category = "", color = "";
    if (bmi < 18.5)    { category = "Underweight"; color = "orange"; }
    else if (bmi < 25) { category = "Normal";      color = "green";  }
    else if (bmi < 30) { category = "Overweight";  color = "orange"; }
    else               { category = "Obese";        color = "red";   }
    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("bmiCategory").innerText = category;
    document.getElementById("bmiCategory").style.color = color;
    document.getElementById("bmiResult").style.display = "block";
};
 
// ================= NAVBAR SCROLL =================
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.style.background = window.scrollY > 100
            ? "rgba(0,0,0,0.95)"
            : "rgba(0,0,0,0.7)";
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
 
 
// ======================================================
// ================= REVIEW SYSTEM (localStorage) =======
// ======================================================
 
// Load all saved reviews from localStorage and show them
function loadReviewsOnPage() {
    const reviewFeed = document.getElementById('liveFeed');
    if (!reviewFeed) return;
 
    reviewFeed.innerHTML = ''; // Clear hardcoded demo cards
 
    const saved = JSON.parse(localStorage.getItem('memberReviews')) || [];
 
    if (saved.length === 0) {
        reviewFeed.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No reviews yet. Be the first!</p>';
        return;
    }
 
    // Newest first
    saved.slice().reverse().forEach(review => {
        const stars   = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const initial = review.name.charAt(0).toUpperCase();
        const card = document.createElement('div');
        card.className = 'feed-card';
        card.id = review.id;
        card.innerHTML = `
            <div class="feed-header">
                <div class="feed-avatar">${initial}</div>
                <div>
                    <h4>${review.name}</h4>
                    <div class="feed-stars">${stars}</div>
                </div>
            </div>
            <p>"${review.msg}"</p>
        `;
        reviewFeed.appendChild(card);
    });
}
 
// Submit a new review
const reviewForm = document.getElementById('clientReviewForm');
 
if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();
 
        const newReview = {
            id:     'rev-' + Date.now(),
            name:   document.getElementById('userName').value.trim(),
            rating: parseInt(document.getElementById('userRating').value),
            msg:    document.getElementById('userMsg').value.trim()
        };
 
        // Save to localStorage so dashboard and page refresh can see it
        let allReviews = JSON.parse(localStorage.getItem('memberReviews')) || [];
        allReviews.push(newReview);
        localStorage.setItem('memberReviews', JSON.stringify(allReviews));
 
        // Instantly add to the feed on screen
        const reviewFeed = document.getElementById('liveFeed');
        const emptyMsg = reviewFeed.querySelector('p');
        if (emptyMsg) emptyMsg.remove();
 
        const stars   = '★'.repeat(newReview.rating) + '☆'.repeat(5 - newReview.rating);
        const initial = newReview.name.charAt(0).toUpperCase();
        const card = document.createElement('div');
        card.className = 'feed-card';
        card.id = newReview.id;
        card.innerHTML = `
            <div class="feed-header">
                <div class="feed-avatar">${initial}</div>
                <div>
                    <h4>${newReview.name}</h4>
                    <div class="feed-stars">${stars}</div>
                </div>
            </div>
            <p>"${newReview.msg}"</p>
        `;
        reviewFeed.prepend(card);
 
        showSuccessPopup("Review Posted Successfully!");
        reviewForm.reset();
    });
}
 
// Run on page load
document.addEventListener('DOMContentLoaded', loadReviewsOnPage);
