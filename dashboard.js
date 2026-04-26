// ================= IMPORT =================
import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    addDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= GLOBAL DATA =================
let membersData = [];
let bookingsData = [];

// ================= LOADER =================
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

// ================= POPUP =================
function showPopup(msg, type = "success") {
    const popup = document.getElementById("popup");
    if (!popup) return;

    popup.innerText = msg;
    popup.style.display = "block";
    popup.style.background = type === "error" ? "red" : "#22c55e";

    setTimeout(() => (popup.style.display = "none"), 3000);
}

// ================= REALTIME MEMBERS =================
function listenMembers() {
    showLoader();

    onSnapshot(collection(db, "memberships"), snapshot => {
        membersData = [];

        snapshot.forEach(docSnap => {
            membersData.push({ id: docSnap.id, ...docSnap.data() });
        });

        renderMembers(membersData);
        updateStats();
        hideLoader();
    });
}

// ================= LOAD BOOKINGS =================
async function loadBookings() {
    showLoader();

    const querySnapshot = await getDocs(collection(db, "bookings"));

    bookingsData = [];
    querySnapshot.forEach(docSnap => {
        bookingsData.push({ id: docSnap.id, ...docSnap.data() });
    });

    const total = document.getElementById("totalBookings");
    if (total) total.innerText = bookingsData.length;

    const table = document.getElementById("bookingTable");
    if (!table) return;

    table.innerHTML = "";

    bookingsData.forEach(b => {
        table.innerHTML += `
        <tr>
            <td>${b.name || "-"}</td>
            <td>${b.email || "-"}</td>
            <td>${b.phone || "-"}</td>
            <td>${b.service || "-"}</td>
            <td>${b.date || "-"}</td>
            <td>
                <button class="delete-btn" onclick="deleteBooking('${b.id}')">
                    Delete
                </button>
            </td>
        </tr>`;
    });

    hideLoader();
}

// ================= UPDATE STATS =================
function updateStats() {
    const total = document.getElementById("totalMembers");
    const activeEl = document.getElementById("activeMembers");
    const revenueEl = document.getElementById("revenue");

    if (total) total.innerText = membersData.length;

    const active = membersData.filter(m => m.status === "Active").length;

    if (activeEl) activeEl.innerText = active;
    if (revenueEl) revenueEl.innerText = active * 500;
}

// ================= RENDER MEMBERS =================
function renderMembers(data) {
    const table = document.getElementById("membershipTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach(m => {
        const status = m.status || "Pending";

        table.innerHTML += `
        <tr>
            <td>${m.name || "-"}</td>
            <td>${m.email || "-"}</td>
            <td>${m.phone || "-"}</td>
            <td>${m.plan || "-"}</td>
            <td>${m.startDate || "-"}</td>
            <td class="${status === 'Active' ? 'status-active' : 'status-pending'}">
                ${status}
            </td>
            <td>
                <button class="paid-btn" onclick="toggleStatus('${m.id}')">
                    ${status === "Active" ? "Make Unpaid" : "Mark Paid"}
                </button>

                <button class="delete-btn" onclick="deleteMember('${m.id}')">
                    Delete
                </button>
            </td>
        </tr>`;
    });
}

// ================= ADD MEMBER =================
window.addMember = async function () {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const phone = document.getElementById("phone")?.value;
    const plan = document.getElementById("plan")?.value;

    if (!name || !phone) {
        showPopup("Name & Phone required", "error");
        return;
    }

    await addDoc(collection(db, "memberships"), {
        name,
        email,
        phone,
        plan,
        startDate: new Date().toISOString().split("T")[0],
        status: "Pending"
    });

    showPopup("Member Added ✅");
};

// ================= TOGGLE STATUS =================
window.toggleStatus = async function (id) {
    const member = membersData.find(m => m.id === id);
    if (!member) return;

    const newStatus = member.status === "Active" ? "Pending" : "Active";

    await updateDoc(doc(db, "memberships", id), {
        status: newStatus
    });

    showPopup("Status updated ✅");
};

// ================= DELETE =================
window.deleteMember = async function (id) {
    await deleteDoc(doc(db, "memberships", id));
    showPopup("Member deleted ✅");
};

window.deleteBooking = async function (id) {
    await deleteDoc(doc(db, "bookings", id));
    showPopup("Booking deleted ✅");
    loadBookings();
};

// ================= SEARCH =================
window.searchMember = function () {
    const value = document.getElementById("search").value.toLowerCase();

    const filtered = membersData.filter(m =>
        (m.name && m.name.toLowerCase().includes(value)) ||
        (m.phone && m.phone.includes(value))
    );

    renderMembers(filtered);
};

// ================= LOGOUT (FIXED) =================
window.logout = function () {
    localStorage.clear();
    window.location.href = "admin.html";
};

// ================= INIT =================
listenMembers();
loadBookings();
