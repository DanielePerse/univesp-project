/**
 * detalhes.js - Script acessível para página de detalhes do funcionário
 * Implementa funcionalidades completas de acessibilidade seguindo WCAG 2.1
 */

// Global variables
let documentCount = 0;

/**
 * Announces messages to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

/**
 * Shows field error with accessibility support
 * @param {HTMLElement} field - The input field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    
    const errorId = field.getAttribute('aria-describedby');
    if (errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('error');
        }
    }
    
    announceToScreenReader(`Erro no campo ${field.labels[0]?.textContent || field.name}: ${message}`, 'assertive');
}

/**
 * Clears field error with accessibility support
 * @param {HTMLElement} field - The input field
 */
function clearFieldError(field) {
    field.classList.remove('invalid');
    field.setAttribute('aria-invalid', 'false');
    
    const errorId = field.getAttribute('aria-describedby');
    if (errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('error');
        }
    }
}

/**
 * Creates accessible document input with proper labeling
 * @param {Object} doc - Document object with id, name, expiration_date
 */
function createDocumentInput(doc = {}) {
    documentCount++;
    const div = document.createElement("div");
    div.classList.add("document-entry");
    div.setAttribute('role', 'group');
    div.setAttribute('aria-label', `Documento ${documentCount}`);
    div.style.display = "flex";
    div.style.gap = "10px";
    div.style.marginBottom = "15px";
    div.style.padding = "15px";
    div.style.border = "1px solid var(--border-color, #ddd)";
    div.style.borderRadius = "8px";
    div.style.backgroundColor = "var(--background-light, #f9f9f9)";

    const docId = `doc-${documentCount}`;
    
    div.innerHTML = `
        <input type="hidden" class="document-id" value="${doc.id || ''}" />
        
        <div style="flex: 1;">
            <label for="${docId}-name" class="form-label">Nome do Documento:</label>
            <input 
                type="text" 
                id="${docId}-name"
                class="document-name input_register" 
                value="${doc.name || ''}" 
                required 
                aria-describedby="${docId}-name-error"
                aria-invalid="false"
            />
            <div id="${docId}-name-error" class="error-message" aria-live="polite"></div>
        </div>
        
        <div style="min-width: 200px;">
            <label for="${docId}-expiration" class="form-label">Data de Vencimento:</label>
            <input 
                type="date" 
                id="${docId}-expiration"
                class="document-expiration input_register" 
                value="${doc.expiration_date || ''}" 
                required
                aria-describedby="${docId}-expiration-error"
                aria-invalid="false"
            />
            <div id="${docId}-expiration-error" class="error-message" aria-live="polite"></div>
        </div>
        
        <div style="align-self: flex-end;">
            <button 
                type="button" 
                class="btn-remove-document" 
                onclick="removeDocumentEntry(this)"
                aria-label="Remover documento ${documentCount}"
                title="Remover este documento"
            >
                🗑️ Remover
            </button>
        </div>
    `;

    const documentsContainer = document.getElementById("documents-container");
    documentsContainer.appendChild(div);
    
    // Add validation events
    const nameInput = div.querySelector('.document-name');
    const expirationInput = div.querySelector('.document-expiration');
    
    nameInput.addEventListener('blur', function() {
        if (!this.value.trim()) {
            showFieldError(this, 'Nome do documento é obrigatório');
        } else {
            clearFieldError(this);
        }
    });
    
    expirationInput.addEventListener('blur', function() {
        if (!this.value) {
            showFieldError(this, 'Data de vencimento é obrigatória');
        } else {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(this, 'Data de vencimento não pode ser anterior a hoje');
            } else {
                clearFieldError(this);
            }
        }
    });
    
    announceToScreenReader(`Novo campo de documento adicionado: Documento ${documentCount}`, 'polite');
    
    // Focus on the name input
    nameInput.focus();
}

/**
 * Removes document entry with accessibility support
 * @param {HTMLElement} button - Remove button that was clicked
 */
function removeDocumentEntry(button) {
    const documentEntry = button.closest('.document-entry');
    const documentLabel = documentEntry.getAttribute('aria-label');
    
    if (confirm(`Tem certeza que deseja remover ${documentLabel}?`)) {
        documentEntry.remove();
        announceToScreenReader(`${documentLabel} removido`, 'assertive');
        
        // Focus management - move to add document button or previous document
        const addButton = document.getElementById('add-document');
        const remainingDocs = document.querySelectorAll('.document-entry');
        
        if (remainingDocs.length > 0) {
            const lastDoc = remainingDocs[remainingDocs.length - 1];
            const lastNameInput = lastDoc.querySelector('.document-name');
            lastNameInput.focus();
        } else {
            addButton.focus();
        }
    }
}

/**
 * Validates all form fields
 * @returns {boolean} - Whether form is valid
 */
function validateAllFields() {
    let isValid = true;
    let firstInvalidField = null;
    
    // Validate employee fields
    const requiredFields = [
        { element: document.getElementById("cpf"), message: "CPF é obrigatório" },
        { element: document.getElementById("employee_name"), message: "Nome do funcionário é obrigatório" },
        { element: document.getElementById("company_name"), message: "Nome da empresa é obrigatório" }
    ];
    
    requiredFields.forEach(field => {
        if (!field.element.value.trim()) {
            showFieldError(field.element, field.message);
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field.element;
        } else {
            clearFieldError(field.element);
        }
    });
    
    // Validate documents
    const documentEntries = document.querySelectorAll('.document-entry');
    if (documentEntries.length === 0) {
        announceToScreenReader('Atenção: Nenhum documento foi adicionado', 'assertive');
    }
    
    documentEntries.forEach(entry => {
        const nameInput = entry.querySelector('.document-name');
        const expirationInput = entry.querySelector('.document-expiration');
        
        if (!nameInput.value.trim()) {
            showFieldError(nameInput, 'Nome do documento é obrigatório');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = nameInput;
        }
        
        if (!expirationInput.value) {
            showFieldError(expirationInput, 'Data de vencimento é obrigatória');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = expirationInput;
        } else {
            const selectedDate = new Date(expirationInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(expirationInput, 'Data de vencimento não pode ser anterior a hoje');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = expirationInput;
            }
        }
    });
    
    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        announceToScreenReader(`Formulário contém erros. Corrija o campo ${firstInvalidField.labels[0]?.textContent || firstInvalidField.id}`, 'assertive');
    }
    
    return isValid;
}

/**
 * Loads employee data with loading states and error handling
 */
async function carregarDados() {
    // Show loading state
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.setAttribute('aria-live', 'polite');
    loadingIndicator.textContent = 'Carregando dados do funcionário...';
    loadingIndicator.className = 'loading-message';
    document.body.appendChild(loadingIndicator);
    
    announceToScreenReader('Carregando dados do funcionário...', 'assertive');
    
    try {
        const token = localStorage.getItem("token");
        const employeeId = window.employeeId;
        
        const response = await fetch(`/employee/${employeeId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        // Remove loading indicator
        if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
        
        if (!response.ok) {
            announceToScreenReader(`Erro ao carregar dados: ${data.message || "Erro desconhecido"}`, 'assertive');
            showErrorModal(data.message || "Erro ao buscar dados do funcionário.");
            return;
        }

        // Populate form fields
        document.getElementById("cpf").value = data.cpf || '';
        document.getElementById("employee_name").value = data.employee_name || '';
        document.getElementById("company_name").value = data.company_name || '';

        // Load address data if exists
        if (data.address) {
            let addressObj = data.address;
            if (typeof data.address === 'string') {
                try {
                    addressObj = JSON.parse(data.address);
                } catch (e) {
                    console.error("Erro ao fazer parse do endereço:", e);
                    addressObj = {};
                }
            }
            
            document.getElementById("zip_code").value = addressObj.zip_code ? aplicarMascaraCep(addressObj.zip_code) : '';
            document.getElementById("street").value = addressObj.street || '';
            document.getElementById("number").value = addressObj.number || '';
            document.getElementById("complement").value = addressObj.complement || '';
            document.getElementById("neighborhood").value = addressObj.neighborhood || '';
            document.getElementById("city").value = addressObj.city || '';
        }

        // Load documents
        if (data.documents && data.documents.length > 0) {
            data.documents.forEach(doc => createDocumentInput(doc));
            announceToScreenReader(`${data.documents.length} documento(s) carregado(s)`, 'polite');
        } else {
            announceToScreenReader('Nenhum documento encontrado', 'polite');
        }
        
        announceToScreenReader('Dados do funcionário carregados com sucesso', 'polite');
        
    } catch (err) {
        // Remove loading indicator
        if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
        
        console.error('Erro ao carregar dados:', err);
        announceToScreenReader('Erro de conexão com o servidor', 'assertive');
        showErrorModal("Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.");
    }
}

/**
 * Shows error modal with accessibility support
 * @param {string} message - Error message to display
 */
function showErrorModal(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('error-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'error-modal';
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'error-title');
        modal.setAttribute('aria-describedby', 'error-message');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2 id="error-title">Erro</h2>
                <p id="error-message"></p>
                <div class="modal-actions">
                    <button type="button" onclick="closeErrorModal()" class="btn-primary">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    document.getElementById('error-message').textContent = message;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('button').focus();
}

/**
 * Closes error modal
 */
function closeErrorModal() {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const employeeId = window.employeeId;
    
    // Configure CEP events (from utils.js)
    if (typeof configurarEventosCep === 'function') {
        configurarEventosCep();
    }

    // Add document button event
    document.getElementById("add-document").addEventListener("click", () => {
        createDocumentInput();
    });

    // Form submission with validation
    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateAllFields()) {
            return;
        }

        const submitButton = e.target.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Salvando...';
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        
        announceToScreenReader('Salvando alterações...', 'assertive');

        try {
            const cpf = document.getElementById("cpf").value.trim();
            const employee_name = document.getElementById("employee_name").value.trim();
            const company_name = document.getElementById("company_name").value.trim();

            const documents = Array.from(document.querySelectorAll(".document-entry")).map(entry => ({
                id: entry.querySelector(".document-id").value || undefined,
                name: entry.querySelector(".document-name").value.trim(),
                expiration_date: entry.querySelector(".document-expiration").value
            }));

            // Collect address data (from utils.js)
            let addressData = {};
            if (typeof coletarDadosEndereco === 'function') {
                addressData = coletarDadosEndereco();
            }
            const hasAddress = Object.keys(addressData).length > 0;

            const payload = {
                cpf,
                employee_name,
                company_name,
                documents,
                ...(hasAddress && { address: addressData })
            };

            const response = await fetch(`/employee/${employeeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                announceToScreenReader('Funcionário atualizado com sucesso!', 'assertive');
                
                // Show success modal
                const modal = document.getElementById("modal");
                if (modal) {
                    modal.classList.remove("hidden");
                    modal.setAttribute('aria-hidden', 'false');
                    
                    // Focus on modal button
                    const modalButton = modal.querySelector('button');
                    if (modalButton) {
                        modalButton.focus();
                    }
                }
            } else {
                announceToScreenReader(`Erro ao atualizar: ${data.message}`, 'assertive');
                showErrorModal(data.message || "Erro ao atualizar funcionário.");
            }
        } catch (err) {
            console.error('Erro ao salvar:', err);
            announceToScreenReader('Erro de conexão com o servidor', 'assertive');
            showErrorModal("Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.");
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.setAttribute('aria-busy', 'false');
        }
    });

    // Global function for modal
    window.voltarParaConsulta = function() {
        announceToScreenReader('Redirecionando para página de consulta', 'polite');
        window.location.href = "/consulta";
    };

    // Global function for closing error modal
    window.closeErrorModal = closeErrorModal;
    
    // Global function for removing document entries
    window.removeDocumentEntry = removeDocumentEntry;

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + A to add document
        if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            document.getElementById('add-document').click();
        }
        
        // Alt + S to save (submit form)
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            const form = document.getElementById('edit-form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
            if (openModal) {
                if (openModal.id === 'error-modal') {
                    closeErrorModal();
                } else {
                    openModal.style.display = 'none';
                    openModal.setAttribute('aria-hidden', 'true');
                }
            }
        }
    });

    // Load initial data
    carregarDados();
    
    // Announce page ready
    announceToScreenReader('Página de detalhes carregada. Use Alt+A para adicionar documento, Alt+S para salvar', 'polite');
});
