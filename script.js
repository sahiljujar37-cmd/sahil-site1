Script · JS
Copy

// ============================================================
//  FITNESS CLUB - script.js  (works with server.js)
// ============================================================
 
// ── Global ────────────────────────────────────────────────────
let selectedPlan = {};
 
// ── SUCCESS POPUP ─────────────────────────────────────────────
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
            font-family: 'Segoe UI', sans-serif; font-size: 16px;
            font-weight: 600; z-index: 99999; opacity: 0;
            transition: opacity 0.35s ease, transform 0.35s ease;
            min-width: 280px; max-width: 90vw;
        ">
            <span style="font-size:26px">✅</span>
            <span>${message}</span>
        </div>`;
    document.body.appendChild(popup);
 
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const box = popup.firstElementChild;
        box.style.opacity = "1";
        box.style.transform = "translateX(-50%) translateY(0)";
    }));
 
    setTimeout(() => {
        const box = popup.firstElementChild;
        if (!box) return;
        box.style.opacity = "0";
        box.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(() => popup.remove(), 400);
    }, 3000);
}
 
function showErrorPopup(message) {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="
            position: fixed; top: 30px; left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: linear-gradient(135deg, #7a1a1a, #ef4444);
            color: #fff; padding: 18px 36px; border-radius: 12px;
            box-shadow: 0 8px 32px rgba(239,68,68,0.35);
            display: flex; align-items: center; gap: 14px;
            font-family: 'Segoe UI', sans-serif; font-size: 16px;
            font-weight: 600; z-index: 99999; opacity: 0;
            transition: opacity 0.35s ease, transform 0.35s ease;
            min-width: 280px; max-width: 90vw;
        ">
            <span style="font-size:26px">❌</span>
            <span>${message}</span>
        </div>`;
    document.body.appendChild(popup);
 
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const box = popup.firstElementChild;
        box.style.opacity = "1";
        box.style.transform = "translateX(-50%) translateY(0)";
    }));
 
    setTimeout(() => {
        const box = popup.firstElementChild;
        if (!box) return;
        box.style.opacity = "0";
        box.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(() => popup.remove(), 400);
    }, 3000);
}
 
// ── NAVBAR MENU ───────────────────────────────────────────────
const menuToggle = document.getElementById("menuToggle");
const navLinks   = document.getElementById("navLinks");
 
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => navLinks.classList.remove("active"));
    });
}
 
// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});
 
// ── SELECT MEMBERSHIP PLAN ────────────────────────────────────
window.selectPlan = function (plan, price) {
    selectedPlan = { plan, price };
    document.getElementById("selectedPlan").innerText  = plan;
    document.getElementById("selectedPrice").innerText = price;
    document.getElementById("membershipModal").style.display = "flex";
};
 
// ── CLOSE MODAL ───────────────────────────────────────────────
window.closeModal = function () {
    document.getElementById("membershipModal").style.display = "none";
};
window.addEventListener("click", (e) => {
    const modal = document.getElementById("membershipModal");
    if (e.target === modal) closeModal();
});
 
// ── MEMBERSHIP FORM → POST to server ─────────────────────────
const membershipForm = document.getElementById("membershipForm");
if (membershipForm) {
    membershipForm.addEventListener("submit", async function (e) {
        e.preventDefault();
 
        const submitBtn = this.querySelector("button[type=submit]");
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
 
        const data = {
            name:      document.getElementById("memberName").value,
            email:     document.getElementById("memberEmail").value,
            phone:     document.getElementById("memberPhone").value,
            startDate: document.getElementById("startDate").value,
            plan:      selectedPlan.plan  || "Basic",
            price:     selectedPlan.price || 0
        };
 
        try {
            const res  = await fetch("/api/membership", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(data)
            });
            const json = await res.json();
 
            if (json.success) {
                showSuccessPopup(json.message);
                membershipForm.reset();
                closeModal();
            } else {
                showErrorPopup(json.message || "Something went wrong.");
            }
        } catch (err) {
            showErrorPopup("Server error. Is server.js running?");
            console.error(err);
        }
 
        submitBtn.disabled    = false;
        submitBtn.textContent = "SUBMIT";
    });
}
 
// ── BOOKING FORM → POST to server ────────────────────────────
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", async function (e) {
        e.preventDefault();
 
        const submitBtn = this.querySelector("button[type=submit]");
        submitBtn.disabled    = true;
        submitBtn.textContent = "Booking...";
 
        const data = {
            name:    document.getElementById("name").value,
            email:   document.getElementById("email").value,
            phone:   document.getElementById("phone").value,
            service: document.getElementById("service").value,
            date:    document.getElementById("date").value,
            message: document.getElementById("message").value
        };
 
        try {
            const res  = await fetch("/api/booking", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(data)
            });
            const json = await res.json();
 
            if (json.success) {
                showSuccessPopup(json.message);
                bookingForm.reset();
            } else {
                showErrorPopup(json.message || "Booking failed.");
            }
        } catch (err) {
            showErrorPopup("Server error. Is server.js running?");
            console.error(err);
        }
 
        submitBtn.disabled    = false;
        submitBtn.textContent = "BOOK NOW";
    });
}
 
// ── BMI CALCULATOR ────────────────────────────────────────────
window.calculateBMI = function () {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
 
    if (!height || !weight || height <= 0 || weight <= 0) {
        showErrorPopup("Please enter valid height and weight.");
        return;
    }
 
    const h   = height / 100;
    const bmi = (weight / (h * h)).toFixed(1);
 
    let category, color, advice;
 
    if (bmi < 18.5) {
        category = "Underweight 🥗";
        color    = "orange";
        advice   = "Consider increasing calorie intake with nutritious foods.";
    } else if (bmi < 25) {
        category = "Normal Weight ✅";
        color    = "#22c55e";
        advice   = "Great job! Maintain your healthy lifestyle.";
    } else if (bmi < 30) {
        category = "Overweight ⚠️";
        color    = "orange";
        advice   = "Regular cardio and a balanced diet can help.";
    } else {
        category = "Obese 🔴";
        color    = "red";
        advice   = "Please consult a doctor and consider our personal training sessions.";
    }
 
    document.getElementById("bmiValue").innerText    = bmi;
    document.getElementById("bmiCategory").innerText = category;
    document.getElementById("bmiCategory").style.color = color;
    document.getElementById("bmiAdvice").innerText   = advice;
    document.getElementById("bmiResult").style.display = "block";
};
 
// ── NAVBAR SCROLL EFFECT ──────────────────────────────────────
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.style.background = window.scrollY > 100
            ? "rgba(0,0,0,0.95)"
            : "rgba(0,0,0,0.7)";
    }
});
 
// ── SET MIN DATE ──────────────────────────────────────────────
window.addEventListener("load", () => {
    const today = new Date().toISOString().split("T")[0];
    const dateInput  = document.getElementById("date");
    const startDate  = document.getElementById("startDate");
    if (dateInput) dateInput.setAttribute("min", today);
    if (startDate) startDate.setAttribute("min", today);
});
 
// ── REVIEWS: Load from server on page start ───────────────────
async function loadReviews() {
    const feed = document.getElementById("liveFeed");
    if (!feed) return;
 
    try {
        const res     = await fetch("/api/reviews");
        const reviews = await res.json();
 
        feed.innerHTML = "";
 
        if (reviews.length === 0) {
            feed.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No reviews yet. Be the first!</p>';
            return;
        }
 
        reviews.forEach(review => {
            const stars   = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            const initial = review.name.charAt(0).toUpperCase();
            const card    = document.createElement("div");
            card.className = "feed-card";
            card.id        = review.id;
            card.innerHTML = `
                <div class="feed-header">
                    <div class="feed-avatar">${initial}</div>
                    <div>
                        <h4>${review.name}</h4>
                        <div class="feed-stars">${stars}</div>
                    </div>
                </div>
                <p>"${review.msg}"</p>`;
            feed.appendChild(card);
        });
    } catch (err) {
        console.error("Could not load reviews:", err);
    }
}
 
// ── REVIEWS: Submit new review → POST to server ───────────────
const reviewForm = document.getElementById("clientReviewForm");
if (reviewForm) {
    reviewForm.addEventListener("submit", async function (e) {
        e.preventDefault();
 
        const name   = document.getElementById("userName").value.trim();
        const rating = parseInt(document.getElementById("userRating").value);
        const msg    = document.getElementById("userMsg").value.trim();
 
        if (!name || !msg) {
            showErrorPopup("Please fill in your name and review.");
            return;
        }
 
        const submitBtn = this.querySelector("button[type=submit]");
        submitBtn.disabled    = true;
        submitBtn.textContent = "Posting...";
 
        try {
            const res  = await fetch("/api/review", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ name, rating, msg })
            });
            const json = await res.json();
 
            if (json.success) {
                // Add to feed instantly
                const feed    = document.getElementById("liveFeed");
                const emptyP  = feed.querySelector("p");
                if (emptyP) emptyP.remove();
 
                const stars   = "★".repeat(rating) + "☆".repeat(5 - rating);
                const initial = name.charAt(0).toUpperCase();
                const card    = document.createElement("div");
                card.className = "feed-card";
                card.id        = json.review.id;
                card.innerHTML = `
                    <div class="feed-header">
                        <div class="feed-avatar">${initial}</div>
                        <div>
                            <h4>${name}</h4>
                            <div class="feed-stars">${stars}</div>
                        </div>
                    </div>
                    <p>"${msg}"</p>`;
                feed.prepend(card);
 
                showSuccessPopup("Review Posted Successfully!");
                reviewForm.reset();
            } else {
                showErrorPopup(json.message || "Failed to post review.");
            }
        } catch (err) {
            showErrorPopup("Server error. Is server.js running?");
            console.error(err);
        }
 
        submitBtn.disabled    = false;
        submitBtn.textContent = "Post Review";
    });
}
 
// Load reviews when page loads
loadReviews();
 
