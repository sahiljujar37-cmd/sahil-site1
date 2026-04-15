// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category, advice, color;

    if (bmi < 18.5) {
        category = 'Underweight';
        advice = 'You may need to gain weight. Consider our muscle gain programs!';
        color = '#fbbf24';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        advice = 'Great! Maintain your healthy lifestyle with our fitness programs.';
        color = '#22c55e';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        advice = 'Consider our weight loss programs to achieve a healthier weight.';
        color = '#f97316';
    } else {
        category = 'Obese';
        advice = 'We recommend our comprehensive weight loss program with diet planning.';
        color = '#ef4444';
    }

    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('bmiCategory').style.color = color;
    document.getElementById('bmiAdvice').textContent = advice;
    document.getElementById('bmiResult').style.display = 'block';

    // Scroll to result
    document.getElementById('bmiResult').scrollIntoView({ behavior: 'smooth' });
}

// Membership Plan Selection
let selectedPlanData = {};

function selectPlan(planName, price) {
    selectedPlanData = { plan: planName, price: price };
    document.getElementById('selectedPlan').textContent = planName;
    document.getElementById('selectedPrice').textContent = price;
    document.getElementById('membershipModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('membershipModal').style.display = 'none';
    document.getElementById('membershipForm').reset();
    document.getElementById('membershipMessage').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('membershipModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Membership Form Submission
document.getElementById('membershipForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const membershipData = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        startDate: document.getElementById('startDate').value,
        plan: selectedPlanData.plan,
        price: selectedPlanData.price
    };

    try {
        const response = await fetch("https://backend-4-v4ii.onrender.com/api/membership", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membershipData)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('membershipMessage');

        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.textContent = result.message;
            messageDiv.style.display = 'block';
            document.getElementById('membershipForm').reset();

            // Close modal after 2 seconds
            setTimeout(() => {
                closeModal();
            }, 2000);
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = result.message || 'Failed to process membership';
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        const messageDiv = document.getElementById('membershipMessage');
        messageDiv.className = 'error';
        messageDiv.textContent = 'Error connecting to server. Please try again.';
        messageDiv.style.display = 'block';
        console.error('Error:', error);
    }
});

// Booking Form Submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementyId('service').value,
        date: document.getElementById('date').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch("https://backend-4-v4ii.onrender.com/api/booking", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('formMessage');

        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.textContent = result.message;
            messageDiv.style.display = 'block';
            document.getElementById('bookingForm').reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = result.message || 'Failed to process booking';
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        const messageDiv = document.getElementById('formMessage');
        messageDiv.className = 'error';
        messageDiv.textContent = 'Error connecting to server. Please try again.';
        messageDiv.style.display = 'block';
        console.error('Error:', error);
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(2, 6, 23, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});

// Set minimum date for booking
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);
document.getElementById('startDate').setAttribute('min', today);