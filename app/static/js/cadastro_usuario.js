// cadastro_usuario.js - Script acessível para página de cadastro de usuário

// Função para anunciar mudanças para screen readers
function announceToScreenReader(message, priority = 'polite') {
    const targetDiv = priority === 'assertive' ? 
        document.getElementById('error-announcements') : 
        document.getElementById('status-announcements');
    
    if (targetDiv) {
        targetDiv.textContent = message;
        
        setTimeout(() => {
            targetDiv.textContent = '';
        }, 3000);
    }
}

// Função para mostrar erro em campo específico
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    
    if (field && errorDiv) {
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Foco no primeiro campo com erro
        if (!document.querySelector('.error:focus')) {
            field.focus();
        }
    }
}

/**
 * Validates field content and shows error messages
 * @param {HTMLElement} field - The input field to validate
 * @param {boolean} isValid - Whether the field content is valid
 * @param {string} message - Error message to display
 * @returns {boolean} - Validation result
 */
function validateField(field, isValid, message) {
    const errorId = field.getAttribute('aria-describedby');
    const errorElement = errorId ? document.getElementById(errorId) : null;
    
    if (!isValid) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('error');
            announceToScreenReader(`Erro no campo ${field.labels[0]?.textContent || field.name}: ${message}`, 'assertive');
        }
        return false;
    } else {
        field.classList.remove('invalid');
        field.setAttribute('aria-invalid', 'false');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('error');
        }
        return true;
    }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Calculates password strength
 * @param {string} password - Password to analyze
 * @returns {Object} - Object with strength level and score
 */
function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    let level = 'weak';
    if (score >= 4) level = 'strong';
    else if (score >= 3) level = 'medium';
    
    return { level, score, checks };
}

/**
 * Updates password strength indicator
 * @param {string} password - Current password
 */
function updatePasswordStrength(password) {
    const indicator = document.getElementById('password-strength');
    const feedback = document.getElementById('password-feedback');
    
    if (!password) {
        indicator.className = 'password-strength';
        feedback.textContent = '';
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    indicator.className = `password-strength ${strength.level}`;
    
    const messages = [];
    if (!strength.checks.length) messages.push('pelo menos 8 caracteres');
    if (!strength.checks.uppercase) messages.push('uma letra maiúscula');
    if (!strength.checks.lowercase) messages.push('uma letra minúscula');
    if (!strength.checks.numbers) messages.push('um número');
    if (!strength.checks.symbols) messages.push('um símbolo especial');
    
    if (messages.length === 0) {
        feedback.textContent = 'Senha forte! ✓';
        feedback.className = 'password-feedback valid';
    } else {
        feedback.textContent = `Adicione: ${messages.join(', ')}`;
        feedback.className = 'password-feedback';
    }
}

/**
 * Toggles password visibility
 * @param {string} fieldId - ID of the password field
 */
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const button = document.querySelector(`[onclick="togglePasswordVisibility('${fieldId}')"]`);
    
    if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
        button.setAttribute('aria-label', 'Ocultar senha');
        announceToScreenReader('Senha visível', 'polite');
    } else {
        field.type = 'password';
        button.textContent = '👁️';
        button.setAttribute('aria-label', 'Mostrar senha');
        announceToScreenReader('Senha oculta', 'polite');
    }
}

/**
 * Validates form before submission
 * @param {Event} event - Form submission event
 */
function validateForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    let isValid = true;
    let firstInvalidField = null;
    
    // Validate name
    const name = formData.get('name')?.trim();
    const nameField = form.querySelector('[name="name"]');
    if (!name) {
        isValid = false;
        validateField(nameField, false, 'Nome é obrigatório');
        if (!firstInvalidField) firstInvalidField = nameField;
    } else if (name.length < 2) {
        isValid = false;
        validateField(nameField, false, 'Nome deve ter pelo menos 2 caracteres');
        if (!firstInvalidField) firstInvalidField = nameField;
    } else {
        validateField(nameField, true, '');
    }
    
    // Validate email
    const email = formData.get('email')?.trim();
    const emailField = form.querySelector('[name="email"]');
    if (!email) {
        isValid = false;
        validateField(emailField, false, 'Email é obrigatório');
        if (!firstInvalidField) firstInvalidField = emailField;
    } else if (!isValidEmail(email)) {
        isValid = false;
        validateField(emailField, false, 'Digite um email válido');
        if (!firstInvalidField) firstInvalidField = emailField;
    } else {
        validateField(emailField, true, '');
    }
    
    // Validate password
    const password = formData.get('password');
    const passwordField = form.querySelector('[name="password"]');
    const strength = calculatePasswordStrength(password);
    if (!password) {
        isValid = false;
        validateField(passwordField, false, 'Senha é obrigatória');
        if (!firstInvalidField) firstInvalidField = passwordField;
    } else if (strength.level === 'weak') {
        isValid = false;
        validateField(passwordField, false, 'Senha muito fraca. Use pelo menos 8 caracteres com maiúsculas, minúsculas, números e símbolos');
        if (!firstInvalidField) firstInvalidField = passwordField;
    } else {
        validateField(passwordField, true, '');
    }
    
    // Validate password confirmation
    const confirmPassword = formData.get('confirm_password');
    const confirmField = form.querySelector('[name="confirm_password"]');
    if (!confirmPassword) {
        isValid = false;
        validateField(confirmField, false, 'Confirmação de senha é obrigatória');
        if (!firstInvalidField) firstInvalidField = confirmField;
    } else if (password !== confirmPassword) {
        isValid = false;
        validateField(confirmField, false, 'Senhas não coincidem');
        if (!firstInvalidField) firstInvalidField = confirmField;
    } else {
        validateField(confirmField, true, '');
    }
    
    // Check terms acceptance
    const termsCheckbox = form.querySelector('[name="terms"]');
    if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false;
        validateField(termsCheckbox, false, 'Você deve aceitar os termos de uso');
        if (!firstInvalidField) firstInvalidField = termsCheckbox;
    }
    
    if (isValid) {
        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Cadastrando...';
        submitButton.disabled = true;
        
        announceToScreenReader('Enviando formulário...', 'assertive');
        
        // Submit form
        form.submit();
    } else {
        // Focus first invalid field
        if (firstInvalidField) {
            firstInvalidField.focus();
            announceToScreenReader(`Formulário contém erros. Corrija o campo ${firstInvalidField.labels[0]?.textContent || firstInvalidField.name}`, 'assertive');
        }
    }
}

/**
 * Opens modal dialog
 * @param {string} modalId - ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Store current focus
    modal.dataset.previousFocus = document.activeElement.id || '';
    
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus first focusable element in modal
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    
    announceToScreenReader('Modal aberto', 'assertive');
}

/**
 * Closes modal dialog
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore previous focus
    const previousFocusId = modal.dataset.previousFocus;
    if (previousFocusId) {
        const previousElement = document.getElementById(previousFocusId);
        if (previousElement) {
            previousElement.focus();
        }
    }
    
    announceToScreenReader('Modal fechado', 'assertive');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    
    // Real-time field validation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                switch(this.type) {
                    case 'email':
                        validateField(this, isValidEmail(this.value), 'Digite um email válido');
                        break;
                    case 'password':
                        if (this.name === 'password') {
                            updatePasswordStrength(this.value);
                            const strength = calculatePasswordStrength(this.value);
                            validateField(this, strength.level !== 'weak', 'Senha muito fraca');
                        }
                        break;
                    case 'text':
                        if (this.name === 'name') {
                            validateField(this, this.value.length >= 2, 'Nome deve ter pelo menos 2 caracteres');
                        }
                        break;
                }
            }
        });
        
        // Password strength real-time update
        if (input.name === 'password') {
            input.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
        
        // Password confirmation validation
        if (input.name === 'confirm_password') {
            input.addEventListener('input', function() {
                const password = document.querySelector('[name="password"]').value;
                validateField(this, this.value === password, 'Senhas não coincidem');
            });
        }
    });
    
    // Form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', validateForm);
    }
    
    // Modal keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
        
        // Keyboard shortcuts
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const submitButton = document.querySelector('[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    });
    
    // Trap focus in modals
    document.addEventListener('keydown', function(e) {
        const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (openModal && e.key === 'Tab') {
            const focusableElements = openModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    announceToScreenReader('Página de cadastro carregada. Use Alt+S para enviar o formulário', 'polite');
});

// Função para limpar erro de campo
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    
    if (field && errorDiv) {
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

// Função para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar força da senha
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
        requirements,
        isValid: Object.values(requirements).every(req => req)
    };
}

// Função para atualizar indicadores de requisitos da senha
function updatePasswordRequirements(password) {
    const { requirements } = validatePassword(password);
    
    Object.entries(requirements).forEach(([key, met]) => {
        const element = document.getElementById(`req-${key}`);
        if (element) {
            element.classList.toggle('met', met);
            const icon = element.querySelector('.req-icon');
            if (icon) {
                icon.textContent = met ? '✅' : '❌';
            }
        }
    });
}

// Função para mostrar/ocultar senha
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (input && button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? '🙈' : '👁️';
        button.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        
        announceToScreenReader(
            isPassword ? 'Senha visível' : 'Senha oculta',
            'polite'
        );
    }
}

// Função para mostrar feedback
function showFeedback(message, type = 'info') {
    const feedbackContainer = document.getElementById('register-msg');
    if (feedbackContainer) {
        feedbackContainer.className = `feedback-container ${type}`;
        feedbackContainer.textContent = message;
        feedbackContainer.style.display = 'block';
        feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');
    
    // Configurar toggles de senha
    document.getElementById('toggle-password').addEventListener('click', () => {
        togglePasswordVisibility('password', 'toggle-password');
    });
    
    document.getElementById('toggle-confirm-password').addEventListener('click', () => {
        togglePasswordVisibility('confirm-password', 'toggle-confirm-password');
    });
    
    // Validação em tempo real do email
    emailField.addEventListener('input', function() {
        clearFieldError('email');
        const email = this.value.trim();
        
        if (email && !validateEmail(email)) {
            showFieldError('email', 'Por favor, digite um email válido.');
        }
    });
    
    emailField.addEventListener('blur', function() {
        const email = this.value.trim();
        if (!email) {
            showFieldError('email', 'Email é obrigatório.');
        } else if (!validateEmail(email)) {
            showFieldError('email', 'Por favor, digite um email válido.');
        }
    });
    
    // Validação em tempo real da senha
    passwordField.addEventListener('input', function() {
        clearFieldError('password');
        const password = this.value;
        
        updatePasswordRequirements(password);
        
        // Verificar confirmação se já foi preenchida
        const confirmPassword = confirmPasswordField.value;
        if (confirmPassword) {
            clearFieldError('confirm-password');
            if (password !== confirmPassword) {
                showFieldError('confirm-password', 'As senhas não coincidem.');
            }
        }
    });
    
    // Validação da confirmação de senha
    confirmPasswordField.addEventListener('input', function() {
        clearFieldError('confirm-password');
        const password = passwordField.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showFieldError('confirm-password', 'As senhas não coincidem.');
        }
    });
    
    confirmPasswordField.addEventListener('blur', function() {
        const password = passwordField.value;
        const confirmPassword = this.value;
        
        if (!confirmPassword) {
            showFieldError('confirm-password', 'Confirmação de senha é obrigatória.');
        } else if (password !== confirmPassword) {
            showFieldError('confirm-password', 'As senhas não coincidem.');
        }
    });
    
    
    announceToScreenReader('Página de cadastro carregada. Use Alt+S para enviar o formulário', 'polite');
});
