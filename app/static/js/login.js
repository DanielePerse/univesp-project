// login.js - Script acessível para página de login

// Função para anunciar mudanças para screen readers
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Função para mostrar erros acessíveis
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`${fieldId}-error`);
    
    if (field && errorDiv) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('data-touched', 'true');
        errorDiv.textContent = message;
        announceToScreenReader(`Erro no campo ${field.labels[0]?.textContent}: ${message}`, 'assertive');
    }
}

// Função para limpar erros
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`${fieldId}-error`);
    
    if (field && errorDiv) {
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('data-touched');
        errorDiv.textContent = '';
    }
}

// Função para mostrar loading
function setLoadingState(isLoading) {
    const button = document.querySelector('button[type="submit"]');
    const loadingStatus = document.getElementById('loading-status');
    
    if (isLoading) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.innerHTML = '<span>Entrando...</span>';
        loadingStatus.textContent = 'Fazendo login, aguarde...';
        announceToScreenReader('Fazendo login, aguarde...');
    } else {
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
        button.innerHTML = '<span>Entrar</span>';
        loadingStatus.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    // Limpar erros quando usuário começa a digitar
    [emailField, passwordField].forEach(field => {
        field.addEventListener('input', function() {
            clearFieldError(this.id);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpar erros anteriores
        clearFieldError('email');
        clearFieldError('password');

        const email = emailField.value.trim();
        const password = passwordField.value;

        // Validação básica
        let hasErrors = false;
        
        if (!email) {
            showFieldError('email', 'Email é obrigatório');
            hasErrors = true;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showFieldError('email', 'Email deve ter um formato válido');
            hasErrors = true;
        }
        
        if (!password) {
            showFieldError('password', 'Senha é obrigatória');
            hasErrors = true;
        }
        
        if (hasErrors) {
            // Focar no primeiro campo com erro
            const firstError = form.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        setLoadingState(true);

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
                announceToScreenReader('Login realizado com sucesso! Redirecionando...', 'assertive');
                setTimeout(() => {
                    window.location.href = "/home";
                }, 500);
            } else {
                setLoadingState(false);
                if (response.status === 401) {
                    showFieldError('password', 'Email ou senha incorretos');
                    passwordField.focus();
                } else {
                    showFieldError('email', data.message || "Erro ao fazer login.");
                }
            }
        } catch (err) {
            errorMsg.textContent = "Erro na conexão com o servidor.";
        }
    });
});
