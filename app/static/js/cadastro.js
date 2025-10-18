// cadastro.js - Script acessível para página de cadastro de funcionário

let documentCounter = 1; // Contador para IDs únicos dos documentos

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

// Função para validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastro-form');
    const addDocumentBtn = document.getElementById('add-document');
    const documentsContainer = document.getElementById('documents-container');

    // Configurar eventos de CEP (função do utils.js)
    configurarEventosCep();

    // Validação em tempo real para CPF
    const cpfField = document.getElementById('cpf');
    cpfField.addEventListener('input', function() {
        clearFieldError('cpf');
        const statusDiv = document.getElementById('cpf-status');
        if (statusDiv) statusDiv.style.display = 'none';
        
        // Formatação automática do CPF
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 4 && value.length <= 6) {
            value = value.replace(/(\d{3})(\d+)/, '$1.$2');
        } else if (value.length >= 7 && value.length <= 9) {
            value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        } else if (value.length >= 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        this.value = value;
    });

    cpfField.addEventListener('blur', function() {
        const cpf = this.value.replace(/\D/g, '');
        if (cpf && !validateCPF(cpf)) {
            showFieldError('cpf', 'CPF inválido. Verifique os números digitados.');
        }
    });

    // Validação para outros campos
    ['employee_name', 'company_name', 'number'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => clearFieldError(fieldId));
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    showFieldError(fieldId, 'Este campo é obrigatório.');
                }
            });
        }
    });

    // Adicionar documento com acessibilidade
    addDocumentBtn.addEventListener('click', () => {
        const newDocumentDiv = document.createElement('div');
        newDocumentDiv.classList.add('document-entry');
        newDocumentDiv.setAttribute('data-document-index', documentCounter);
        
        newDocumentDiv.innerHTML = `
            <div class="form-row">
                <div class="form-group form-group-large">
                    <label for="document-name-${documentCounter}" class="form-label">
                        <span class="label-text">Nome do Documento</span>
                        <span class="required" aria-label="campo obrigatório">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="document-name-${documentCounter}"
                        name="document-name-${documentCounter}"
                        class="document-name input_register" 
                        required 
                        placeholder="Ex: RG, CNH, Carteira de Trabalho"
                        aria-describedby="document-name-${documentCounter}-help document-name-${documentCounter}-error"
                        aria-invalid="false"
                    />
                    <div id="document-name-${documentCounter}-help" class="help-text">Digite o tipo do documento</div>
                    <div id="document-name-${documentCounter}-error" class="error-message" role="alert" aria-live="assertive"></div>
                </div>
                
                <div class="form-group form-group-small">
                    <label for="document-expiration-${documentCounter}" class="form-label">
                        <span class="label-text">Data de Vencimento</span>
                        <span class="required" aria-label="campo obrigatório">*</span>
                    </label>
                    <input 
                        type="date" 
                        id="document-expiration-${documentCounter}"
                        name="document-expiration-${documentCounter}"
                        class="document-expiration input_register" 
                        required
                        aria-describedby="document-expiration-${documentCounter}-help document-expiration-${documentCounter}-error"
                        aria-invalid="false"
                    />
                    <div id="document-expiration-${documentCounter}-help" class="help-text">Data de validade do documento</div>
                    <div id="document-expiration-${documentCounter}-error" class="error-message" role="alert" aria-live="assertive"></div>
                </div>
                
                <div class="form-group">
                    <button 
                        type="button" 
                        class="button-remove-document"
                        onclick="removeDocument(${documentCounter})"
                        aria-label="Remover este documento"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
            </div>
        `;
        
        documentsContainer.appendChild(newDocumentDiv);
        
        // Foco no novo campo
        const newNameField = newDocumentDiv.querySelector(`#document-name-${documentCounter}`);
        if (newNameField) {
            newNameField.focus();
        }
        
        announceToScreenReader(`Documento ${documentCounter + 1} adicionado. Preencha os campos do novo documento.`);
        documentCounter++;
    });

    // Função para validar formulário completo
    function validateForm() {
        let isValid = true;
        const errors = [];

        // Validar CPF
        const cpf = document.getElementById('cpf').value.trim();
        if (!cpf) {
            showFieldError('cpf', 'CPF é obrigatório.');
            errors.push('CPF');
            isValid = false;
        } else if (!validateCPF(cpf)) {
            showFieldError('cpf', 'CPF inválido.');
            errors.push('CPF');
            isValid = false;
        }

        // Validar nome
        const employeeName = document.getElementById('employee_name').value.trim();
        if (!employeeName) {
            showFieldError('employee_name', 'Nome do funcionário é obrigatório.');
            errors.push('Nome do funcionário');
            isValid = false;
        }

        // Validar empresa
        const companyName = document.getElementById('company_name').value.trim();
        if (!companyName) {
            showFieldError('company_name', 'Nome da empresa é obrigatório.');
            errors.push('Nome da empresa');
            isValid = false;
        }

        // Validar endereço
        const zipCode = document.getElementById('zip_code').value.trim();
        const street = document.getElementById('street').value.trim();
        const number = document.getElementById('number').value.trim();

        if (!zipCode) {
            showFieldError('zip_code', 'CEP é obrigatório.');
            errors.push('CEP');
            isValid = false;
        }

        if (!street) {
            showFieldError('street', 'Logradouro é obrigatório. Busque o CEP primeiro.');
            errors.push('Logradouro');
            isValid = false;
        }

        if (!number) {
            showFieldError('number', 'Número do endereço é obrigatório.');
            errors.push('Número');
            isValid = false;
        }

        // Validar documentos
        const documentEntries = document.querySelectorAll('.document-entry');
        documentEntries.forEach((entry, index) => {
            const nameField = entry.querySelector('.document-name');
            const dateField = entry.querySelector('.document-expiration');
            
            if (nameField && !nameField.value.trim()) {
                const fieldId = nameField.id || `document-name-${index}`;
                showFieldError(fieldId, 'Nome do documento é obrigatório.');
                errors.push(`Nome do documento ${index + 1}`);
                isValid = false;
            }
            
            if (dateField && !dateField.value) {
                const fieldId = dateField.id || `document-expiration-${index}`;
                showFieldError(fieldId, 'Data de vencimento é obrigatória.');
                errors.push(`Data de vencimento ${index + 1}`);
                isValid = false;
            }
        });

        if (!isValid) {
            announceToScreenReader(`Formulário possui ${errors.length} erro(s): ${errors.join(', ')}.`, 'assertive');
        }

        return isValid;
    }

    // Submit do formulário com validação acessível
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpar erros anteriores
        document.querySelectorAll('.error-message').forEach(div => {
            div.textContent = '';
            div.style.display = 'none';
        });
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        });

        if (!validateForm()) {
            return;
        }

        const submitButton = document.getElementById('submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');

        // Estado de loading
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        buttonText.textContent = 'Cadastrando...';
        loadingSpinner.classList.remove('sr-only');
        
        announceToScreenReader('Enviando dados do funcionário...', 'polite');

        try {
            const cpf = document.getElementById('cpf').value;
            const employee_name = document.getElementById('employee_name').value;
            const company_name = document.getElementById('company_name').value;
            const token = localStorage.getItem('token');

            const documents = Array.from(document.querySelectorAll('.document-entry')).map(entry => {
                const name = entry.querySelector('.document-name').value;
                const expiration_date = entry.querySelector('.document-expiration').value;
                return { name, expiration_date };
            });

            // Coleta dados de endereço
            const addressData = coletarDadosEndereco();
            const hasAddress = Object.keys(addressData).length > 0;

            const payload = {
                cpf,
                employee_name,
                company_name,
                documents,
                ...(hasAddress && { address: addressData })
            };

            const response = await fetch('/employee/register_employee', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                announceToScreenReader('Funcionário cadastrado com sucesso!', 'assertive');
                showSuccessModal();
            } else {
                const data = await response.json();
                const errorMessage = data.message || "Erro ao cadastrar funcionário.";
                announceToScreenReader(`Erro: ${errorMessage}`, 'assertive');
                alert(errorMessage);
            }
        } catch (err) {
            const errorMessage = "Erro ao conectar com o servidor.";
            announceToScreenReader(`Erro: ${errorMessage}`, 'assertive');
            alert(errorMessage);
        } finally {
            // Restaurar estado do botão
            submitButton.disabled = false;
            submitButton.setAttribute('aria-busy', 'false');
            buttonText.textContent = 'Cadastrar Funcionário';
            loadingSpinner.classList.add('sr-only');
        }
    });

    // Funcionalidade acessível de verificar CPF
    document.getElementById('verificar-cpf-link').addEventListener('click', async (e) => {
        e.preventDefault();
        const cpfInput = document.getElementById('cpf');
        const cpfValue = cpfInput.value.trim();
        const statusDiv = document.getElementById('cpf-status');
        const button = e.target;
        
        if (!cpfValue) {
            announceToScreenReader('Por favor, digite um CPF para verificar.', 'assertive');
            showFieldError('cpf', 'Digite um CPF antes de verificar.');
            cpfInput.focus();
            return;
        }
        
        if (!validateCPF(cpfValue)) {
            announceToScreenReader('CPF inválido. Corrija antes de verificar.', 'assertive');
            showFieldError('cpf', 'CPF inválido. Verifique os números digitados.');
            cpfInput.focus();
            return;
        }
        
        // Estado de loading
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        statusDiv.style.display = 'block';
        statusDiv.className = 'status-message loading';
        statusDiv.textContent = '🔄 Verificando CPF...';
        statusDiv.setAttribute('aria-live', 'polite');
        
        announceToScreenReader('Verificando se CPF já está cadastrado...', 'polite');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/employee/check_register/${encodeURIComponent(cpfValue)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                // CPF disponível (não cadastrado)
                statusDiv.className = 'status-message success';
                statusDiv.textContent = '✅ CPF disponível para cadastro';
                announceToScreenReader('CPF disponível para cadastro.', 'polite');
            } else if (response.status === 409) {
                // CPF já cadastrado
                statusDiv.className = 'status-message error';
                statusDiv.textContent = '❌ CPF já possui cadastro no sistema';
                announceToScreenReader('CPF já cadastrado no sistema.', 'assertive');
            } else {
                statusDiv.className = 'status-message error';
                statusDiv.textContent = '❌ Erro ao verificar CPF';
                announceToScreenReader('Erro ao verificar CPF.', 'assertive');
            }
        } catch (error) {
            statusDiv.className = 'status-message error';
            statusDiv.textContent = '❌ Erro ao conectar com o servidor';
            announceToScreenReader('Erro ao conectar com o servidor.', 'assertive');
        } finally {
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
        }
    });

    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl + S para submeter formulário
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
        
        // Escape para voltar
        if (e.key === 'Escape') {
            if (confirm('Tem certeza que deseja sair? Os dados não salvos serão perdidos.')) {
                goBack();
            }
        }
    });

    announceToScreenReader('Formulário de cadastro carregado. Use Ctrl+S para salvar ou Escape para voltar.');
});

// Funções globais
window.removeDocument = function(documentIndex) {
    const documentEntry = document.querySelector(`[data-document-index="${documentIndex}"]`);
    if (documentEntry) {
        const documentEntries = document.querySelectorAll('.document-entry');
        if (documentEntries.length > 1) {
            documentEntry.remove();
            announceToScreenReader('Documento removido da lista.', 'polite');
        } else {
            announceToScreenReader('É necessário manter pelo menos um documento.', 'assertive');
        }
    }
};

window.showSuccessModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.focus();
        
        // Trap do foco no modal
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
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
            
            if (e.key === 'Escape') {
                goBack();
            }
        });
    }
};

window.goBack = function() {
    announceToScreenReader('Retornando à página inicial...', 'polite');
    window.location.href = "/home";
};
