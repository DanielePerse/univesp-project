document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const msg = document.getElementById('register-msg');
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
        return /.+@.+\..+/.test(value);
    }

    emailInput.addEventListener('input', () => clearFieldError(emailInput));
    passwordInput.addEventListener('input', () => clearFieldError(passwordInput));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.textContent = '';
        msg.removeAttribute('style');

        clearFieldError(emailInput);
        clearFieldError(passwordInput);

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const errors = [];
        if (!email) {
            errors.push({ input: emailInput, msg: 'Informe seu email.' });
        } else if (!isValidEmail(email)) {
            errors.push({ input: emailInput, msg: 'Informe um email válido.' });
        }

        if (!password) {
            errors.push({ input: passwordInput, msg: 'Informe uma senha.' });
        } else if (password.length < 6) {
            errors.push({ input: passwordInput, msg: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        if (errors.length) {
            errors.forEach(ei => setFieldError(ei.input, ei.msg));
            errors[0].input.focus();
            return;
        }

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
                const backendMsg = (data && (data.message || data.error)) || '';
                msg.style.color = 'red';
                msg.textContent = backendMsg || "Erro ao cadastrar usuário.";
            }
        } catch (err) {
            msg.style.color = 'red';
            msg.textContent = "Erro na conexão com o servidor.";
        }
    });
});
