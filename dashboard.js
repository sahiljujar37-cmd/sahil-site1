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
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');

    const titles = { overview: 'Dashboard Overview', bookings: 'Bookings', members: 'Members' };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

    document.getElementById('membersSection').style.display  = section === 'bookings' ? 'none' : 'block';
    document.getElementById('bookingsSection').style.display = section === 'members'  ? 'none' : 'block';
    document.getElementById('statsGrid').style.display       = section === 'overview' ? 'grid' : 'none';
}

// ===== TABS =====
function switchTab(el, paneId) {
    el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    el.closest('.section').querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(paneId).classList.add('active');
}

// ===== STATUS BADGE =====
function statusBadge(s) {
    const map = { Active: 'badge-green', Pending: 'badge-amber', Cancelled: 'badge-red', Rejected: 'badge-red' };
    return `<span class="badge ${map[s] || 'badge-blue'}">${s || '—'}</span>`;
}

// ===== APPROVE MEMBER =====
function approveMember(id) {
    let members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.map(m => m.id === id ? { ...m, status: 'Active' } : m);
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
}

// ===== DELETE MEMBER =====
function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    let members = JSON.parse(localStorage.getItem('memberships') || '[]');
    members = members.filter(m => m.id !== id);
    localStorage.setItem('memberships', JSON.stringify(members));
    loadDashboard();
}

// ===== DELETE BOOKING =====
function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadDashboard();
}

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

// ===== LOAD DASHBOARD =====
function loadDashboard() {
    const members  = JSON.parse(localStorage.getItem('memberships') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings')    || '[]');

    document.getElementById('adminBadge').textContent = adminEmail.split('@')[0] || 'Admin';

    const active  = members.filter(m => m.status === 'Active');
    const pending = members.filter(m => m.status !== 'Active');
    const revenue = members.reduce((sum, m) => sum + (parseFloat(m.price) || 0), 0);

    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('activeMembers').textContent = active.length + ' active';
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('pendingCount').textContent  = pending.length;
    document.getElementById('totalRevenue').textContent  = '₹' + revenue.toLocaleString();
    document.getElementById('memberBadge').textContent   = members.length + ' total';
    document.getElementById('bookingBadge').textContent  = bookings.length + ' total';

    renderMemberTable(members,  'memberTableWrap');
    renderMemberTable(pending,  'pendingTableWrap');
    renderMemberTable(active,   'activeTableWrap');

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

loadDashboard();
