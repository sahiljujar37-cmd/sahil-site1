
Copy

// ================= FIREBASE IMPORTS =================
import { db } from './firebase.js';
import {
    collection, getDocs, deleteDoc,
    doc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
 
// ===== AUTH GUARD =====
const adminEmail = localStorage.getItem("adminEmail");
const adminPassword = localStorage.getItem("adminPassword");
 
if (!adminEmail || !adminPassword) {
    window.location.href = "admin.html";
}
 
// ===== LOGOUT =====
window.logout = function () {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    window.location.href = "admin.html";
};
 
// ===== SIDEBAR NAV =====
window.setNav = function (el, section) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
 
    const titles = {
        overview: 'Dashboard Overview',
        bookings: 'Bookings',
        members: 'Members',
        reviews: 'Member Reviews'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
 
    document.getElementById('statsGrid').style.display         = section === 'overview' ? 'grid' : 'none';
    document.getElementById('membersSection').style.display    = (section === 'overview' || section === 'members')  ? 'block' : 'none';
    document.getElementById('bookingsSection').style.display   = (section === 'overview' || section === 'bookings') ? 'block' : 'none';
    document.getElementById('reviewsSection').style.display    = (section === 'overview' || section === 'reviews')  ? 'block' : 'none';
};
 
// ===== TABS =====
window.switchTab = function (el, paneId) {
    el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    el.closest('.section').querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(paneId).classList.add('active');
};
 
// ===== STATUS BADGE =====
function statusBadge(s) {
    const map = { Active: 'badge-green', Pending: 'badge-amber', Cancelled: 'badge-red', Rejected: 'badge-red' };
    return `<span class="badge ${map[s] || 'badge-blue'}">${s || '—'}</span>`;
}
 
// ===== MEMBER ACTIONS =====
window.approveMember = function (id) {
    let members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.map(m => m.id === id ? { ...m, status: 'Active' } : m);
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
};
 
window.deleteMember = function (id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    let members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.filter(m => m.id !== id);
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
};
 
// ===== BOOKING ACTIONS =====
window.deleteBooking = function (id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadDashboard();
};
 
// ===== REVIEW ACTIONS (FIRESTORE) =====
window.deleteReviewFromDashboard = async function (firestoreId) {
    if (!confirm("Delete this review? It will be permanently removed for everyone.")) return;
 
    const btn = document.querySelector(`[data-rev-id="${firestoreId}"]`);
    if (btn) { btn.disabled = true; btn.textContent = 'Deleting...'; }
 
    try {
        await deleteDoc(doc(db, 'reviews', firestoreId));
        loadDashboard(); // Refresh table
    } catch (err) {
        console.error("Error deleting review:", err);
        alert("Could not delete review. Please try again.");
        if (btn) { btn.disabled = false; btn.textContent = 'Delete Review'; }
    }
};
 
// ===== RENDER MEMBER TABLE =====
function renderMemberTable(members, wrapId) {
    const wrap = document.getElementById(wrapId);
    if (!members.length) {
        wrap.innerHTML = '<div class="empty-state">No records found</div>';
        return;
    }
    wrap.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th><th>Email</th><th>Phone</th>
                    <th>Plan</th><th>Price</th><th>Start Date</th>
                    <th>Status</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${members.map(m => `
                <tr>
                    <td>${m.name || '—'}</td>
                    <td>${m.email || '—'}</td>
                    <td>${m.phone || '—'}</td>
                    <td><span class="badge badge-blue">${m.plan || '—'}</span></td>
                    <td>₹${m.price || 0}</td>
                    <td>${m.startDate || '—'}</td>
                    <td>${statusBadge(m.status)}</td>
                    <td>
                        ${m.status !== 'Active' ? `<button class="action-btn btn-approve" onclick="approveMember(${m.id})">Approve</button>` : ''}
                        <button class="action-btn btn-delete" onclick="deleteMember(${m.id})">Delete</button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>`;
}
 
// ===== RENDER REVIEW TABLE (Firestore) =====
async function renderReviewTable(wrapId) {
    const wrap = document.getElementById(wrapId);
    wrap.innerHTML = '<div class="empty-state">Loading reviews...</div>';
 
    try {
        const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
 
        // Update the badge count
        const badge = document.getElementById('reviewBadge');
        if (badge) badge.textContent = snapshot.size + ' total';
 
        if (snapshot.empty) {
            wrap.innerHTML = '<div class="empty-state">No reviews yet</div>';
            return;
        }
 
        wrap.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Member Name</th><th>Rating</th><th>Review</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${snapshot.docs.map(docSnap => {
                        const r = docSnap.data();
                        const id = docSnap.id;
                        return `
                        <tr>
                            <td><strong>${r.name || '—'}</strong></td>
                            <td><span style="color:#f59e0b;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></td>
                            <td style="max-width:300px; white-space:normal;">${r.msg || '—'}</td>
                            <td>
                                <button class="action-btn btn-delete"
                                    data-rev-id="${id}"
                                    onclick="deleteReviewFromDashboard('${id}')">
                                    Delete Review
                                </button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    } catch (err) {
        console.error("Error loading reviews:", err);
        wrap.innerHTML = '<div class="empty-state" style="color:#f87171;">Error loading reviews. Check Firebase config.</div>';
    }
}
 
// ===== MAIN LOAD DASHBOARD =====
async function loadDashboard() {
    const members  = JSON.parse(localStorage.getItem('memberships') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
 
    document.getElementById('adminBadge').textContent = adminEmail.split('@')[0] || 'Admin';
 
    const active  = members.filter(m => m.status === 'Active');
    const pending = members.filter(m => m.status !== 'Active');
    const revenue = members.reduce((sum, m) => sum + (parseFloat(m.price) || 0), 0);
 
    document.getElementById('totalMembers').textContent  = members.length;
    document.getElementById('activeMembers').textContent = active.length + ' active';
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('pendingCount').textContent  = pending.length;
    document.getElementById('totalRevenue').textContent  = '₹' + revenue.toLocaleString();
 
    if (document.getElementById('memberBadge'))  document.getElementById('memberBadge').textContent  = members.length + ' total';
    if (document.getElementById('bookingBadge')) document.getElementById('bookingBadge').textContent = bookings.length + ' total';
 
    // Render member tables
    renderMemberTable(members, 'memberTableWrap');
    renderMemberTable(pending, 'pendingTableWrap');
    renderMemberTable(active,  'activeTableWrap');
 
    // Render reviews from Firestore
    await renderReviewTable('reviewTableWrap');
 
    // Render bookings table
    const bWrap = document.getElementById('bookingTableWrap');
    if (!bookings.length) {
        bWrap.innerHTML = '<div class="empty-state">No bookings yet</div>';
    } else {
        bWrap.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th><th>Email</th><th>Phone</th>
                        <th>Service</th><th>Date</th><th>Message</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(b => `
                    <tr>
                        <td>${b.name || '—'}</td>
                        <td>${b.email || '—'}</td>
                        <td>${b.phone || '—'}</td>
                        <td><span class="badge badge-blue">${b.service || '—'}</span></td>
                        <td>${b.date || '—'}</td>
                        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${b.message || ''}">${b.message || '—'}</td>
                        <td><button class="action-btn btn-delete" onclick="deleteBooking(${b.id})">Delete</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>`;
    }
}
 
// Initial Load
document.addEventListener('DOMContentLoaded', loadDashboard);
 
