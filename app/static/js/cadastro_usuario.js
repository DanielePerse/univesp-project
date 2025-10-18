// cadastro_usuario.js - Script para página de cadastro de usuário

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const msg = document.getElementById('register-msg');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                msg.style.color = 'green';
                msg.textContent = "Usuário cadastrado com sucesso! Faça login.";
            } else {
                msg.style.color = 'red';
                msg.textContent = data.message || "Erro ao cadastrar usuário.";
            }
        } catch (err) {
            msg.style.color = 'red';
            msg.textContent = "Erro na conexão com o servidor.";
        }
    });
});
