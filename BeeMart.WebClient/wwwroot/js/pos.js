const apiBaseUrl = 'http://localhost:5109/api/v1'; 
let currentUser = JSON.parse(localStorage.getItem('user')) || {};
let cart = [];
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser || (!currentUser.username && !currentUser.idUser && !currentUser.id)) {
        window.location.href = '/Auth/Login';
    } else {
        updateHeaderInfo();
        setInterval(updateHeaderInfo, 1000);
        loadInvoicePreview();
        loadPaymentMethods();
    }
});

function updateHeaderInfo() {
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '.');

    const loginUser = JSON.parse(localStorage.getItem('user')) || {};
    const roleName = (loginUser.roleName || loginUser.role || '').toLowerCase();
    const displayName = loginUser.username || loginUser.fullName || loginUser.name || '-';

    let roleLabel = '';
    if (roleName === 'admin') {
        roleLabel = `Admin: ${displayName}`;
    } else {
        roleLabel = `Kasir: ${displayName}`;
    }

    document.getElementById('sessionHeaderInfo').innerText = `${dateStr}, ${timeStr} | ${roleLabel}`;
}

async function loadInvoicePreview() {
    try {
        const userId = currentUser.idUser || currentUser.id || 1;
        const res = await fetch(`${apiBaseUrl}/transactions/preview-invoice?idUser=${userId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        document.getElementById('invoiceNoDisplay').innerText = `Invoice No: ${data.invoiceNo || data.invoiceNumber}`;
    } catch (e) {
        console.error('Gagal Memuat Invoice:', e);
        document.getElementById('invoiceNoDisplay').innerText = 'Invoice No: -';
    }
}

async function loadPaymentMethods() {
    try {
        const res = await fetch(`${apiBaseUrl}/paymentmethods`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const select = document.getElementById('paymentMethodSelect');
        select.innerHTML = '';
                
        data.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.idPaymentMethod || m.id;
            opt.innerText = m.methodName || m.name || m.method;
            select.appendChild(opt);
        });
    } catch (e) {
        const select = document.getElementById('paymentMethodSelect');
        select.innerHTML = `
            <option value="1">Cash</option>
            <option value="2">Debit</option>
            <option value="3">Credit</option>
        `;
    }
}

async function handleSearchKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const keyword = document.getElementById('searchInput').value.trim();
        if (!keyword) return;

        try {
            const res = await fetch(`${apiBaseUrl}/products/search?query=${encodeURIComponent(keyword)}`);
            const products = await res.json();
                    
            const tbody = document.getElementById('searchResultsTable');
            tbody.innerHTML = '';

            if (!products || products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#777;">Barang tidak ditemukan</td></tr>';
            } else {
                products.forEach(p => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${p.name}</td>
                        <td>${p.weight || '1 Kg'}</td>
                        <td>${p.stock}</td>
                        <td>Rp ${p.price.toLocaleString('id-ID')}</td>
                        <td>${p.discount}%</td>
                        <td class="column_aksi">
                            <button class="btn-pilih" onclick='selectProductForInput(${JSON.stringify(p)})'>Pilih</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
            document.getElementById('searchResultSection').style.display = 'block';
        } catch (err) {
            alert('Gagal Mengambil Data Produk. Pastikan API Backend Berjalan.');
        }
    }
}

function selectProductForInput(product) {
    selectedProduct = product;
    document.getElementById('selectedItemTitle').innerText = `Barang Terpilih: ${product.name}`;
    document.getElementById('selectedItemPrice').innerText = `Rp ${product.price.toLocaleString('id-ID')}`;
    document.getElementById('selectedItemStock').innerText = product.stock;
    document.getElementById('inputQty').value = 1;
    document.getElementById('qtyErrorMsg').style.display = 'none';
    document.getElementById('selectedItemBox').style.display = 'block';
}

function confirmAddToCart() {
    const qtyInput = parseInt(document.getElementById('inputQty').value) || 0;
    const errDiv = document.getElementById('qtyErrorMsg');

    if (qtyInput <= 0) {
        errDiv.innerText = 'Jumlah barang minimal harus 1.';
        errDiv.style.display = 'block';
        return;
    }

    const existing = cart.find(i => i.idProduct === selectedProduct.idProduct);
    const currentCartQty = existing ? existing.qty : 0;
    const totalRequestedQty = currentCartQty + qtyInput;

    if (totalRequestedQty > selectedProduct.stock) {
        errDiv.innerText = "Jumlah barang yang dimasukkan melebihi sisa stok.";
        errDiv.style.display = 'block';
        return;
    }

    if (existing) {
        existing.qty = totalRequestedQty;
    } else {
        cart.push({
            idProduct: selectedProduct.idProduct,
            name: selectedProduct.name,
            price: selectedProduct.price,
            discount: selectedProduct.discount,
            stock: selectedProduct.stock,
            qty: qtyInput
        });
    }

    document.getElementById('selectedItemBox').style.display = 'none';
    document.getElementById('searchResultSection').style.display = 'none';
    document.getElementById('searchInput').value = '';
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const effectivePrice = item.price * (1 - (item.discount / 100));
        const subtotal = effectivePrice * item.qty;
        grandTotal += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
            <td>${item.discount}%</td>
            <td>${item.qty}</td>
            <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
            <td class="col-aksi">
                <button class="btn-delete" onclick="removeFromCart(${index})">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('grandTotalDisplay').innerText = `Total: Rp ${grandTotal.toLocaleString('id-ID')}`;
}

async function submitTransaction() {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong.');
        return;
    }

    const paymentMethodSelect = document.getElementById('paymentMethodSelect');
    const paymentMethodId = parseInt(paymentMethodSelect.value) || 1; 
    const userId = currentUser.idUser || currentUser.id;

    const dto = {
        idUser: String(userId),
        idPaymentMethod: paymentMethodId,
        items: cart.map(i => ({ 
            idProduct: String(i.idProduct), 
            qty: parseInt(i.qty)
        }))
    };

    try {
        const res = await fetch(`${apiBaseUrl}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });

        const data = await res.json();
        if (res.ok) {
            alert(`Transaksi Berhasil! Invoice: ${data.invoiceNo || data.invoiceNumber || 'Sukses'}`);
            cart = [];
            selectedProduct = null;
            renderCart();

            document.getElementById('searchInput').value = '';
            document.getElementById('searchResultSection').style.display = 'none';
            document.getElementById('selectedItemBox').style.display = 'none';

            if (paymentMethodSelect && paymentMethodSelect.options.length > 0) {
                paymentMethodSelect.selectedIndex = 0;
            }

            loadInvoicePreview();
        } else {
            alert(data.message || 'Transaksi gagal.');
        }
    } catch (err) {
        console.error("Error submit transaction:", err);
        alert('Gagal Memproses Transaksi. Pastikan API Backend Berjalan.');
    }
}

function logout() {
    localStorage.removeItem('user');
    currentUser = {};
    window.location.href = '/Auth/Login'; 
}