// ================= GLOBAL =================
let selectedPlan = {};

// ================= SUCCESS POPUP =================
function showSuccessPopup(message) {
    // Remove existing popup if any
    const existing = document.getElementById("successPopup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "successPopup";
    popup.innerHTML = `
        <div style="
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: linear-gradient(135deg, #1a7a4a, #22c55e);
            color: #fff;
            padding: 18px 36px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(34,197,94,0.35), 0 2px 8px rgba(0,0,0,0.18);
            display: flex;
            align-items: center;
            gap: 14px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.35s ease, transform 0.35s ease;
            min-width: 280px;
            max-width: 90vw;
        ">
            <span style="font-size: 26px; line-height: 1;">✅</span>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(popup);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const box = popup.firstElementChild;
            box.style.opacity = "1";
            box.style.transform = "translateX(-50%) translateY(0)";
        });
    });

    // Animate out after 3s
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


// ===== TESTIMONIALS CAROUSEL =====

document.getElementById('reviewForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // 1. Get Form Values
  const name = document.getElementById('reviewerName').value;
  const text = document.getElementById('reviewText').value;
  const ratingValue = document.getElementById('reviewRating').value;
  const stars = '★'.repeat(ratingValue) + '☆'.repeat(5 - ratingValue);
  
  // Create initials for avatar
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  // 2. Create the New Card Element
  const newCard = document.createElement('div');
  newCard.className = 't-card';
  newCard.innerHTML = `
    <div class="t-quote">"</div>
    <div class="t-stars">${stars}</div>
    <p class="t-text">"${text}"</p>
    <div class="t-author">
      <div class="t-avatar" style="background:rgba(100,116,139,0.15); color:#64748b">${initials}</div>
      <div>
        <div class="t-name">${name}</div>
        <div class="t-role">Verified Member · Just Now</div>
      </div>
    </div>
  `;

  // 3. Add to the Track (prepend puts it at the beginning)
  const track = document.getElementById('tTrack');
  track.prepend(newCard);

  // 4. Reset Form and Alert
  this.reset();
  alert("Thank you for your review! It has been added to the wall.");
  
  // Optional: If you have a slider function, re-initialize it here
  // updateSlider(); 
});
(function () {
    const track = document.getElementById('tTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.t-card');
    const dotsEl = document.getElementById('tDots');
    const total = cards.length;
    let current = 0;
    let autoTimer;

    const visible = () => window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
    const cardWidth = () => cards[0].getBoundingClientRect().width + 24;

    function goTo(idx) {
        const max = total - visible();
        current = Math.max(0, Math.min(idx, max));
        track.style.transform = `translateX(-${current * cardWidth()}px)`;
        dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        const max = total - visible();
        for (let i = 0; i <= max; i++) {
            const d = document.createElement('div');
            d.className = 'dot' + (i === 0 ? ' active' : '');
            d.onclick = () => { goTo(i); resetAuto(); };
            dotsEl.appendChild(d);
        }
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            goTo(current >= total - visible() ? 0 : current + 1);
        }, 3500);
    }

    document.getElementById('tNext').onclick = () => { goTo(current + 1); resetAuto(); };
    document.getElementById('tPrev').onclick = () => { goTo(current - 1); resetAuto(); };

    buildDots();
    goTo(0);
    resetAuto();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
})();

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
