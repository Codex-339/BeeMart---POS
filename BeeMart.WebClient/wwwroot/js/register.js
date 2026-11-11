async function register() {
    const username = document.getElementById('username').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const password = document.getElementById('password').value.trim();
    const rePassword = document.getElementById('rePassword').value.trim();
    const role = document.getElementById('role').value;

    if (!username || !fullName || !password || !rePassword) {
        alert('Username, Full Name, Password & Re-Password wajib diisi.');
        return;
    }

    if (password !== rePassword) {
        alert('Password tidak sama dengan Re-Password!');
        return;
    }

    try {
        const res = await fetch('http://localhost:5109/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, fullName, password, role })
        });

        const data = await res.json();
        if (res.ok) {
            alert('Registration Successful!');
            window.location.href = '/Auth/Login';
        } else {
            alert(data.message || 'Registrasi Akun Gagal!');
        }
    } catch (err) {
        alert('Gagal terhubung ke API Backend.');
    }
}