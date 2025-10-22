// login.js - Script para página de login

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    function createOrGetErrorEl(input, idSuffix) {
        const group = input.closest('.form-group') || input.parentElement;
        let el = group.querySelector(`#${idSuffix}`);
        if (!el) {
            el = document.createElement('div');
            el.id = idSuffix;
            el.className = 'error-text';
            group.appendChild(el);
        }
        return el;
    }

    function clearFieldError(input) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        const group = input.closest('.form-group') || input.parentElement;
        const err = group.querySelector('.error-text');
        if (err) err.textContent = '';
        const describedby = input.getAttribute('aria-describedby');
        if (describedby && describedby.includes('-error')) {
            input.removeAttribute('aria-describedby');
        }
    }

    function setFieldError(input, message) {
        const idSuffix = `${input.id}-error`;
        const err = createOrGetErrorEl(input, idSuffix);
        err.textContent = message;
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', idSuffix);
        return err;
    }

    function isValidEmail(value) {
        // Regex simples para email
        return /.+@.+\..+/.test(value);
    }

    // Limpa erros ao digitar
    emailInput.addEventListener('input', () => clearFieldError(emailInput));
    passwordInput.addEventListener('input', () => clearFieldError(passwordInput));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpar mensagem geral
        errorMsg.textContent = '';
        // Limpar estados dos campos
        clearFieldError(emailInput);
        clearFieldError(passwordInput);

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validações acessíveis
        const errors = [];
        if (!email) {
            errors.push({ input: emailInput, msg: 'Informe seu email.' });
        } else if (!isValidEmail(email)) {
            errors.push({ input: emailInput, msg: 'Informe um email válido.' });
        }

        if (!password) {
            errors.push({ input: passwordInput, msg: 'Informe sua senha.' });
        }

        if (errors.length) {
            // Aplica mensagens e foca o primeiro inválido
            errors.forEach(ei => setFieldError(ei.input, ei.msg));
            errors[0].input.focus();
            return;
        }

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/home';
            } else {
                const backendMsg = (data && (data.message || data.error)) || '';
                if (response.status === 401 || /invalid credentials/i.test(backendMsg)) {
                    errorMsg.textContent = 'Credenciais inválidas. Verifique email e senha.';
                } else {
                    errorMsg.textContent = backendMsg || 'Erro ao fazer login.';
                }
            }
        } catch (err) {
            errorMsg.textContent = 'Erro na conexão com o servidor.';
        }
    });
});
