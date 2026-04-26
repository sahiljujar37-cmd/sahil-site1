// ================= IMPORT =================
import { db } from "./firebase.js";
import {
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let membersData = [];

// ================= REALTIME MEMBERS =================
function loadMembers() {
    onSnapshot(collection(db, "memberships"), snapshot => {
        membersData = [];

        snapshot.forEach(docSnap => {
            membersData.push({ id: docSnap.id, ...docSnap.data() });
        });

        renderMembers(membersData);
        updateStats();
    });
}

// ================= RENDER =================
function renderMembers(data) {
    const table = document.getElementById("membershipTable");
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
            <td>${status}</td>
            <td>
                <button onclick="toggleStatus('${m.id}')">
                    ${status === "Active" ? "Unpaid" : "Paid"}
                </button>
                <button onclick="deleteMember('${m.id}')">Delete</button>
            </td>
        </tr>`;
    });
}

// ================= STATS =================
function updateStats() {
    document.getElementById("totalMembers").innerText = membersData.length;

    const active = membersData.filter(m => m.status === "Active").length;
    document.getElementById("activeMembers").innerText = active;
    document.getElementById("revenue").innerText = active * 500;
}

// ================= ACTIONS =================
window.toggleStatus = async function (id) {
    const member = membersData.find(m => m.id === id);

    await updateDoc(doc(db, "memberships", id), {
        status: member.status === "Active" ? "Pending" : "Active"
    });
};

window.deleteMember = async function (id) {
    await deleteDoc(doc(db, "memberships", id));
};

// ================= LOGOUT =================
window.logout = function () {
    localStorage.clear();
    window.location.href = "admin.html";
};

// ================= INIT =================
loadMembers();
