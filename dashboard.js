
   // ===== AUTH GUARD =====
var adminEmail    = localStorage.getItem("adminEmail");
var adminPassword = localStorage.getItem("adminPassword");
 
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
    document.querySelectorAll('.nav-item').forEach(function (n) {
        n.classList.remove('active');
    });
    el.classList.add('active');
 
    var titles = {
        overview: 'Dashboard Overview',
        bookings: 'Bookings',
        members:  'Members',
        reviews:  'Member Reviews'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
 
    document.getElementById('statsGrid').style.display       = (section === 'overview') ? 'grid'  : 'none';
    document.getElementById('membersSection').style.display  = (section === 'overview' || section === 'members')  ? 'block' : 'none';
    document.getElementById('bookingsSection').style.display = (section === 'overview' || section === 'bookings') ? 'block' : 'none';
    document.getElementById('reviewsSection').style.display  = (section === 'overview' || section === 'reviews')  ? 'block' : 'none';
}
 
// ===== TABS =====
function switchTab(el, paneId) {
    el.closest('.tabs').querySelectorAll('.tab').forEach(function (t) {
        t.classList.remove('active');
    });
    el.classList.add('active');
    el.closest('.section').querySelectorAll('.tab-pane').forEach(function (p) {
        p.classList.remove('active');
    });
    document.getElementById(paneId).classList.add('active');
}
 
// ===== STATUS BADGE =====
function statusBadge(s) {
    var map = { Active: 'badge-green', Pending: 'badge-amber', Cancelled: 'badge-red', Rejected: 'badge-red' };
    return '<span class="badge ' + (map[s] || 'badge-blue') + '">' + (s || '—') + '</span>';
}
 
// ===== MEMBER ACTIONS =====
function approveMember(id) {
    var members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.map(function (m) {
        return m.id === id ? Object.assign({}, m, { status: 'Active' }) : m;
    });
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
}
 
function deleteMember(id) {
    if (!confirm('Delete this member?')) return;
    var members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.filter(function (m) { return m.id !== id; });
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
}
 
// ===== BOOKING ACTIONS =====
function deleteBooking(id) {
    if (!confirm('Delete this booking?')) return;
    var bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings = bookings.filter(function (b) { return b.id !== id; });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadDashboard();
}
 
// ===== REVIEW ACTIONS =====
function deleteReviewFromDashboard(id) {
    if (!confirm('Delete this review permanently?')) return;
    var reviews = JSON.parse(localStorage.getItem('memberReviews') || '[]');
    reviews = reviews.filter(function (r) { return r.id !== id; });
    localStorage.setItem('memberReviews', JSON.stringify(reviews));
    loadDashboard();
}
 
// ===== RENDER MEMBER TABLE =====
function renderMemberTable(members, wrapId) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    if (!members.length) {
        wrap.innerHTML = '<div class="empty-state">No records found</div>';
        return;
    }
    var rows = members.map(function (m) {
        return '<tr>' +
            '<td>' + (m.name      || '—') + '</td>' +
            '<td>' + (m.email     || '—') + '</td>' +
            '<td>' + (m.phone     || '—') + '</td>' +
            '<td><span class="badge badge-blue">' + (m.plan || '—') + '</span></td>' +
            '<td>₹' + (m.price || 0) + '</td>' +
            '<td>' + (m.startDate || '—') + '</td>' +
            '<td>' + statusBadge(m.status) + '</td>' +
            '<td>' +
                (m.status !== 'Active'
                    ? '<button class="action-btn btn-approve" onclick="approveMember(' + m.id + ')">Approve</button>'
                    : '') +
                '<button class="action-btn btn-delete" onclick="deleteMember(' + m.id + ')">Delete</button>' +
            '</td>' +
        '</tr>';
    }).join('');
    wrap.innerHTML =
        '<table><thead><tr>' +
        '<th>Name</th><th>Email</th><th>Phone</th>' +
        '<th>Plan</th><th>Price</th><th>Start Date</th>' +
        '<th>Status</th><th>Actions</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
}
 
// ===== RENDER REVIEW TABLE =====
function renderReviewTable(reviews, wrapId) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    if (!reviews.length) {
        wrap.innerHTML = '<div class="empty-state">No reviews yet</div>';
        return;
    }
    var rows = reviews.slice().reverse().map(function (rev) {
        var stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
        return '<tr>' +
            '<td><strong>' + (rev.name || '—') + '</strong></td>' +
            '<td><span style="color:#f59e0b;">' + stars + '</span></td>' +
            '<td style="max-width:300px;white-space:normal;">' + (rev.msg || '—') + '</td>' +
            '<td><button class="action-btn btn-delete" onclick="deleteReviewFromDashboard(\'' + rev.id + '\')">Delete</button></td>' +
        '</tr>';
    }).join('');
    wrap.innerHTML =
        '<table><thead><tr>' +
        '<th>Member Name</th><th>Rating</th><th>Review</th><th>Actions</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
}
 
// ===== MAIN LOAD DASHBOARD =====
function loadDashboard() {
    var members  = JSON.parse(localStorage.getItem('memberships')   || '[]');
    var bookings = JSON.parse(localStorage.getItem('bookings')       || '[]');
    var reviews  = JSON.parse(localStorage.getItem('memberReviews') || '[]');
 
    document.getElementById('adminBadge').textContent = adminEmail.split('@')[0] || 'Admin';
 
    var active  = members.filter(function (m) { return m.status === 'Active'; });
    var pending = members.filter(function (m) { return m.status !== 'Active'; });
    var revenue = members.reduce(function (sum, m) { return sum + (parseFloat(m.price) || 0); }, 0);
 
    document.getElementById('totalMembers').textContent  = members.length;
    document.getElementById('activeMembers').textContent = active.length + ' active';
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('pendingCount').textContent  = pending.length;
    document.getElementById('totalRevenue').textContent  = '₹' + revenue.toLocaleString();
 
    var mb = document.getElementById('memberBadge');
    var bb = document.getElementById('bookingBadge');
    var rb = document.getElementById('reviewBadge');
    if (mb) mb.textContent = members.length  + ' total';
    if (bb) bb.textContent = bookings.length + ' total';
    if (rb) rb.textContent = reviews.length  + ' total';
 
    renderMemberTable(members, 'memberTableWrap');
    renderMemberTable(pending, 'pendingTableWrap');
    renderMemberTable(active,  'activeTableWrap');
    renderReviewTable(reviews, 'reviewTableWrap');
 
    // Bookings table
    var bWrap = document.getElementById('bookingTableWrap');
    if (!bWrap) return;
    if (!bookings.length) {
        bWrap.innerHTML = '<div class="empty-state">No bookings yet</div>';
        return;
    }
    var bRows = bookings.map(function (b) {
        return '<tr>' +
            '<td>' + (b.name    || '—') + '</td>' +
            '<td>' + (b.email   || '—') + '</td>' +
            '<td>' + (b.phone   || '—') + '</td>' +
            '<td><span class="badge badge-blue">' + (b.service || '—') + '</span></td>' +
            '<td>' + (b.date    || '—') + '</td>' +
            '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + (b.message || '') + '">' + (b.message || '—') + '</td>' +
            '<td><button class="action-btn btn-delete" onclick="deleteBooking(' + b.id + ')">Delete</button></td>' +
        '</tr>';
    }).join('');
    bWrap.innerHTML =
        '<table><thead><tr>' +
        '<th>Name</th><th>Email</th><th>Phone</th>' +
        '<th>Service</th><th>Date</th><th>Message</th><th>Actions</th>' +
        '</tr></thead><tbody>' + bRows + '</tbody></table>';
}
 
// ===== RUN =====
loadDashboard();
