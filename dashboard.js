// ===== AUTH GUARD =====
const adminEmail = localStorage.getItem("adminEmail");
const adminPassword = localStorage.getItem("adminPassword");

if (!adminEmail || !adminPassword) {
    window.location.href = "admin.html";
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    window.location.href = "admin.html";
}

// ===== SIDEBAR NAV =====
function setNav(el, section) {
    // 1. Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');

    // 2. Update Page Title
    const titles = { 
        overview: 'Dashboard Overview', 
        bookings: 'Bookings', 
        members: 'Members', 
        reviews: 'Member Reviews' 
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

    // 3. Toggle Visibility of Sections
    // Overview shows everything, specific tabs show only their section
    document.getElementById('statsGrid').style.display = section === 'overview' ? 'grid' : 'none';
    
    document.getElementById('membersSection').style.display = 
        (section === 'overview' || section === 'members') ? 'block' : 'none';
    
    document.getElementById('bookingsSection').style.display = 
        (section === 'overview' || section === 'bookings') ? 'block' : 'none';
        
    document.getElementById('reviewsSection').style.display = 
        (section === 'overview' || section === 'reviews') ? 'block' : 'none';
}

// ===== TABS (For Members Section) =====
function switchTab(el, paneId) {
    el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    el.closest('.section').querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(paneId).classList.add('active');
}

// ===== STATUS BADGE HELPER =====
function statusBadge(s) {
    const map = { Active: 'badge-green', Pending: 'badge-amber', Cancelled: 'badge-red', Rejected: 'badge-red' };
    return `<span class="badge ${map[s] || 'badge-blue'}">${s || '—'}</span>`;
}

// ===== MEMBER ACTIONS =====
function approveMember(id) {
    let members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.map(m => m.id === id ? { ...m, status: 'Active' } : m);
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
}

function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    let members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.filter(m => m.id !== id);
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
}

// ===== BOOKING ACTIONS =====
function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadDashboard();
}

// ===== REVIEW ACTIONS =====
function deleteReviewFromDashboard(id) {
    if (confirm("Are you sure you want to delete this review? It will be removed for everyone.")) {
        let reviews = JSON.parse(localStorage.getItem('memberReviews')) || [];
        reviews = reviews.filter(rev => rev.id !== id);
        localStorage.setItem('memberReviews', JSON.stringify(reviews));
        loadDashboard(); // Refresh the UI
    }
}

// ===== RENDER TABLES =====

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

function renderReviewTable(reviews, wrapId) {
    const wrap = document.getElementById(wrapId);
    if (!reviews.length) {
        wrap.innerHTML = '<div class="empty-state">No reviews found</div>';
        return;
    }
    wrap.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Member Name</th><th>Rating</th><th>Message</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${reviews.map(rev => `
                <tr>
                    <td><strong>${rev.name}</strong></td>
                    <td><span style="color: #f59e0b;">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</span></td>
                    <td style="max-width: 300px; white-space: normal;">${rev.msg}</td>
                    <td>
                        <button class="action-btn btn-delete" onclick="deleteReviewFromDashboard('${rev.id}')">Delete Review</button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>`;
}

// ===== MAIN LOAD DASHBOARD =====
function loadDashboard() {
    const members = JSON.parse(localStorage.getItem('memberships') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const reviews = JSON.parse(localStorage.getItem('memberReviews') || '[]');

    document.getElementById('adminBadge').textContent = adminEmail.split('@')[0] || 'Admin';

    // Stats Calculation
    const active = members.filter(m => m.status === 'Active');
    const pending = members.filter(m => m.status !== 'Active');
    const revenue = members.reduce((sum, m) => sum + (parseFloat(m.price) || 0), 0);

    // Update Dashboard UI
    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('activeMembers').textContent = active.length + ' active';
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('pendingCount').textContent = pending.length;
    document.getElementById('totalRevenue').textContent = '₹' + revenue.toLocaleString();
    
    // Update Badges
    if(document.getElementById('memberBadge')) document.getElementById('memberBadge').textContent = members.length + ' total';
    if(document.getElementById('bookingBadge')) document.getElementById('bookingBadge').textContent = bookings.length + ' total';
    if(document.getElementById('reviewBadge')) document.getElementById('reviewBadge').textContent = reviews.length + ' total';

    // Render Tables
    renderMemberTable(members, 'memberTableWrap');
    renderMemberTable(pending, 'pendingTableWrap');
    renderMemberTable(active, 'activeTableWrap');
    renderReviewTable(reviews, 'reviewTableWrap');

    // Render Bookings Table
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

loadDashboard();
