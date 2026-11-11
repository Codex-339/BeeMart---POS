async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    if (!username || !password) {
        alert('Username dan Password Wajib Diisi.');
        return;
    }

    try {
        const res = await fetch('http://localhost:5109/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({
                idUser: data.idUser,
                username: data.username,
                role: data.role
            }));
            window.location.href = '/POS/Index';
        } else {
            alert('Invalid login');
        }
    } catch (err) {
        alert('Gagal terhubung ke API Backend.');
    }
}