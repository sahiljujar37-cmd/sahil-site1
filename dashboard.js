import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let membersData = [];
let bookingsData = [];

/* ================= LOADER ================= */
function showLoader() {
    document.getElementById("loader").style.display = "flex";
}
function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

/* ================= POPUP ================= */
function showPopup(msg, type="success") {
    const popup = document.getElementById("popup");
    popup.innerText = msg;
    popup.style.display = "block";
    popup.style.background = type === "error" ? "red" : "#22c55e";

    setTimeout(() => popup.style.display = "none", 3000);
}

/* ================= LOAD MEMBERS ================= */
async function loadMembers() {
    showLoader();

    const querySnapshot = await getDocs(collection(db, "memberships"));

    membersData = [];
    querySnapshot.forEach(docSnap => {
        membersData.push({ id: docSnap.id, ...docSnap.data() });
    });

    renderMembers(membersData);
    updateStats();

    hideLoader();
}

/* ================= LOAD BOOKINGS ================= */
async function loadBookings() {
    showLoader();

    const querySnapshot = await getDocs(collection(db, "bookings"));

    bookingsData = [];
    querySnapshot.forEach(docSnap => {
        bookingsData.push({ id: docSnap.id, ...docSnap.data() });
    });

    document.getElementById("totalBookings").innerText = bookingsData.length;

    const table = document.getElementById("bookingTable");
    table.innerHTML = "";

    bookingsData.forEach(b => {
        table.innerHTML += `
        <tr>
            <td>${b.name}</td>
            <td>${b.email}</td>
            <td>${b.phone}</td>
            <td>${b.service}</td>
            <td>${b.date}</td>
            <td>
                <button class="delete-btn" onclick="deleteBooking('${b.id}')">Delete</button>
            </td>
        </tr>`;
    });

    hideLoader();
}

/* ================= UPDATE STATS ================= */
function updateStats() {
    document.getElementById("totalMembers").innerText = membersData.length;

    const active = membersData.filter(m => m.status === "Active").length;
    document.getElementById("activeMembers").innerText = active;

    document.getElementById("revenue").innerText = active * 500;
}

/* ================= RENDER ================= */
function renderMembers(data) {
    const table = document.getElementById("membershipTable");
    table.innerHTML = "";

    data.forEach(m => {
        const status = m.status || "Pending";

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td>${m.phone}</td>
            <td>${m.plan}</td>
            <td>${m.startDate}</td>
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

/* ================= TOGGLE ================= */
async function toggleStatus(id) {
    const member = membersData.find(m => m.id === id);
    const newStatus = member.status === "Active" ? "Pending" : "Active";

    await updateDoc(doc(db, "memberships", id), {
        status: newStatus
    });

    showPopup("Status updated ✅");
    loadMembers();
}

/* ================= DELETE ================= */
async function deleteMember(id) {
    await deleteDoc(doc(db, "memberships", id));
    showPopup("Member deleted ✅");
    loadMembers();
}

async function deleteBooking(id) {
    await deleteDoc(doc(db, "bookings", id));
    showPopup("Booking deleted ✅");
    loadBookings();
}

/* ================= INIT ================= */
loadMembers();
loadBookings();
