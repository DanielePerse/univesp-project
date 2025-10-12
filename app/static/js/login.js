// login.js - Funcionalidades da página de login

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                window.location.href = "/home";
            } else {
                errorMsg.textContent = data.message || "Erro ao fazer login.";
            }
        } catch (err) {
            errorMsg.textContent = "Erro na conexão com o servidor.";
        }
    });
});