const apiBaseUrl = 'http://localhost:5109/api/v1';
let currentUser = JSON.parse(localStorage.getItem('user')) || {};
let currentPage = 1;
const pageSize = 20; 

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser || (!currentUser.username && !currentUser.idUser && !currentUser.id)) {
        window.location.href = '/Auth/Login';
    } else {
        updateHeaderInfo();
    }
});

function updateHeaderInfo() {
    const rawRole = (currentUser.roleName || currentUser.role || '').toLowerCase();
    const roleDisplay = rawRole === 'admin' ? 'Admin' : 'Cashier';
    const username = currentUser.username || currentUser.fullName || '-';

    document.getElementById('sessionHeaderInfo').innerHTML = 
        `Role: <span class="role-highlight">${roleDisplay}</span> | Login: ${username}`;

    if (rawRole === 'admin') {
        document.getElementById('kasirSubtitle').innerHTML = 
            `Pencarian Data Transaksi <strong>(Menampilkan Semua Kasir)</strong>`;
    } else {
        document.getElementById('kasirSubtitle').innerHTML = 
            `Pencarian Data Transaksi <strong>(Hanya Kasir: ${username})</strong>`;
    }
}

async function searchHistory(page = 1) {
    const selectedDate = document.getElementById('transactionDate').value;
            
    if (!selectedDate) {
        alert('Silakan pilih tanggal transaksi terlebih dahulu.');
        return;
    }

    currentPage = page;
    const rawRole = (currentUser.roleName || currentUser.role || '').toLowerCase();  
    const userId = currentUser.idUser || currentUser.id;

    let endpoint = '';
    if (rawRole === 'admin') {
        endpoint = `${apiBaseUrl}/transactions/history/admin?transactionDate=${selectedDate}&page=${currentPage}`;
    } else {
        endpoint = `${apiBaseUrl}/transactions/history/cashier?idUser=${userId}&transactionDate=${selectedDate}&page=${currentPage}`;
    }

    try {
        const res = await fetch(endpoint);
                
        if (!res.ok) {
            throw new Error(`Server status: ${res.status}`);
        }

        const result = await res.json();
        const data = result.data || result.items || [];
        const totalPages = result.totalPages || 1;

        renderTable(data);
        renderPagination(totalPages);

    } catch (err) {
        console.error("Gagal mengambil data riwayat transaksi:", err);
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #f44336; font-weight: 600;">
                    Gagal mengambil Data Transaksi. Pastikan API Backend Berjalan.
                </td>
            </tr>
        `;
        renderPagination(0);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #888;">
                    Tidak ada data transaksi pada tanggal ini.
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.invoiceNo || '-'}</td>
            <td>${item.transactionDate || '-'}</td>
            <td>${item.cashierName || '-'}</td>
            <td>${item.totalItems || item.totalItem || 0}</td>
            <td>${item.paymentMethod || '-'}</td>
            <td>Rp ${Number(item.totalPrice || 0).toLocaleString('id-ID')}</td>
        `;
        tbody.appendChild(tr);
    });
}
        
function renderPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    container.innerHTML = '';

    if (!totalPages || totalPages < 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => searchHistory(i);
        container.appendChild(btn);
    }
}

function logout() {
    localStorage.removeItem('user');
    currentUser = {};
    window.location.href = '/Auth/Login';
}