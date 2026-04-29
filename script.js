cript · JS
Copy

// ================= GLOBAL =================
let selectedPlan = {};
 
// ================= SUCCESS TOAST (renamed to avoid conflict with popup div in HTML) =================
function showToast(message) {
    const existing = document.getElementById("toastMsg");
    if (existing) existing.remove();
 
    const toast = document.createElement("div");
    toast.id = "toastMsg";
    toast.style.cssText = `
        position: fixed; top: 30px; left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: linear-gradient(135deg, #1a7a4a, #22c55e);
        color: #fff; padding: 18px 36px; border-radius: 12px;
        box-shadow: 0 8px 32px rgba(34,197,94,0.35);
        display: flex; align-items: center; gap: 14px;
        font-family: 'Segoe UI', sans-serif; font-size: 16px; font-weight: 600;
        z-index: 99999; opacity: 0;
        transition: opacity 0.35s ease, transform 0.35s ease;
        min-width: 280px; max-width: 90vw;
    `;
    toast.innerHTML = `<span style="font-size:26px;">✅</span><span>${message}</span>`;
    document.body.appendChild(toast);
 
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });
    });
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
 
// ================= NAVBAR MENU =================
const menuToggle = document.getElementById("menuToggle");
const navLinks   = document.getElementById("navLinks");
 
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => navLinks.classList.remove("active"));
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
    if (modal && e.target === modal) closeModal();
});
 
// ================= SAVE MEMBERSHIP =================
var membershipForm = document.getElementById("membershipForm");
if (membershipForm) {
    membershipForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var members = JSON.parse(localStorage.getItem("memberships")) || [];
        members.push({
            id: Date.now(),
            name:      document.getElementById("memberName").value,
            email:     document.getElementById("memberEmail").value,
            phone:     document.getElementById("memberPhone").value,
            startDate: document.getElementById("startDate").value,
            plan:      selectedPlan.plan  || "Basic",
            price:     selectedPlan.price || 0,
            status:    "Pending"
        });
        localStorage.setItem("memberships", JSON.stringify(members));
        showToast("Membership Registered Successfully!");
        membershipForm.reset();
        closeModal();
    });
}
 
// ================= SAVE BOOKING =================
var bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push({
            id:      Date.now(),
            name:    document.getElementById("name").value,
            email:   document.getElementById("email").value,
            phone:   document.getElementById("phone").value,
            service: document.getElementById("service").value,
            date:    document.getElementById("date").value,
            message: document.getElementById("message").value
        });
        localStorage.setItem("bookings", JSON.stringify(bookings));
        showToast("Booking Confirmed Successfully!");
        bookingForm.reset();
    });
}
 
// ================= BMI CALCULATOR =================
window.calculateBMI = function () {
    var height = document.getElementById("height").value;
    var weight = document.getElementById("weight").value;
    if (!height || !weight) { alert("Enter valid values"); return; }
    var h   = height / 100;
    var bmi = (weight / (h * h)).toFixed(1);
    var category = "", color = "";
    if      (bmi < 18.5) { category = "Underweight"; color = "orange"; }
    else if (bmi < 25)   { category = "Normal";      color = "green";  }
    else if (bmi < 30)   { category = "Overweight";  color = "orange"; }
    else                 { category = "Obese";        color = "red";    }
    document.getElementById("bmiValue").innerText    = bmi;
    document.getElementById("bmiCategory").innerText = category;
    document.getElementById("bmiCategory").style.color = color;
    document.getElementById("bmiResult").style.display = "block";
};
 
// ================= NAVBAR SCROLL =================
window.addEventListener("scroll", function () {
    var navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.style.background = window.scrollY > 100
            ? "rgba(0,0,0,0.95)"
            : "rgba(0,0,0,0.7)";
    }
});
 
// ================= SET MIN DATE =================
(function () {
    var today     = new Date().toISOString().split("T")[0];
    var dateInput = document.getElementById("date");
    var startDate = document.getElementById("startDate");
    if (dateInput) dateInput.setAttribute("min", today);
    if (startDate) startDate.setAttribute("min", today);
})();
 
 
// ============================================================
// =================== REVIEW SYSTEM =========================
// ============================================================
 
// Build a review card element
function buildReviewCard(review) {
    var stars   = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    var initial = review.name.charAt(0).toUpperCase();
    var card    = document.createElement('div');
    card.className = 'feed-card';
    card.id        = review.id;
    card.innerHTML =
        '<div class="feed-header">' +
            '<div class="feed-avatar">' + initial + '</div>' +
            '<div>' +
                '<h4>' + review.name + '</h4>' +
                '<div class="feed-stars">' + stars + '</div>' +
            '</div>' +
        '</div>' +
        '<p>"' + review.msg + '"</p>';
    return card;
}
 
// Load all reviews from localStorage into the feed
function loadReviews() {
    var feed = document.getElementById('liveFeed');
    if (!feed) return;
 
    feed.innerHTML = '';
 
    var saved = JSON.parse(localStorage.getItem('memberReviews') || '[]');
    if (saved.length === 0) {
        feed.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No reviews yet. Be the first!</p>';
        return;
    }
 
    // Newest first
    saved.slice().reverse().forEach(function (review) {
        feed.appendChild(buildReviewCard(review));
    });
}
 
// Attach review form submit — runs after everything is loaded
window.addEventListener('load', function () {
 
    // Load existing reviews into feed
    loadReviews();
 
    // Handle new review submission
    var form = document.getElementById('clientReviewForm');
    if (!form) return;
 
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // STOP page from going anywhere
 
        var name   = document.getElementById('userName').value.trim();
        var rating = parseInt(document.getElementById('userRating').value);
        var msg    = document.getElementById('userMsg').value.trim();
 
        if (!name || !msg) return;
 
        var newReview = {
            id:     'rev-' + Date.now(),
            name:   name,
            rating: rating,
            msg:    msg
        };
 
        // Save to localStorage (so dashboard can see it too)
        var allReviews = JSON.parse(localStorage.getItem('memberReviews') || '[]');
        allReviews.push(newReview);
        localStorage.setItem('memberReviews', JSON.stringify(allReviews));
 
        // Add card to top of feed immediately
        var feed    = document.getElementById('liveFeed');
        var emptyP  = feed.querySelector('p');
        if (emptyP) emptyP.remove();
        feed.prepend(buildReviewCard(newReview));
 
        // Show success
        showToast("Review Posted Successfully!");
        form.reset();
    });
});
 
