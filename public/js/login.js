document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerHTML;

        // Loading State
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        btn.disabled = true;
        errorMsg.style.opacity = '0';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // Success Animation
                btn.innerHTML = '<i class="fas fa-check"></i> Success!';
                btn.style.background = '#22c55e';

                setTimeout(() => {
                    window.location.href = '/admin.html';
                }, 800);
            } else {
                showError(data.error || 'Invalid credentials');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }

        } catch (err) {
            console.error(err);
            showError('Server connection failed');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    function showError(msg) {
        errorMsg.innerText = msg;
        errorMsg.style.opacity = '1';

        // Shake animation
        const card = document.querySelector('.login-card');
        card.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 300,
            iterations: 1
        });
    }
});
