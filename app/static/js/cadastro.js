// cadastro.js - Script para página de cadastro de funcionário

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastro-form');
    const addDocumentBtn = document.getElementById('add-document');
    const documentsContainer = document.getElementById('documents-container');
    const modal = document.getElementById('modal');
    const cpfInput = document.getElementById('cpf');
    const employeeNameInput = document.getElementById('employee_name');
    const companyNameInput = document.getElementById('company_name');
    const zipInput = document.getElementById('zip_code');
    const streetInput = document.getElementById('street');
    const numberInput = document.getElementById('number');

    // Configurar eventos de CEP (função do utils.js)
    configurarEventosCep();
    // Máscara de CPF
    configurarMascaraCpf('cpf');

    addDocumentBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.classList.add('document-entry');
        div.style.marginBottom = "15px";
        div.style.display = "flex";
        div.style.gap = "10px";
        div.innerHTML = `
            <input type="text" class="document-name input_register" required placeholder="Nome do Documento" style="flex: 1;" />
            <input type="date" class="document-expiration input_register" required />
        `;
        documentsContainer.appendChild(div);
    });

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
        if (describedby && describedby.includes('-error')) input.removeAttribute('aria-describedby');
    }

    function setFieldError(input, message) {
        if (!input.id) input.id = `field-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
        const idSuffix = `${input.id}-error`;
        const err = createOrGetErrorEl(input, idSuffix);
        err.textContent = message;
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', idSuffix);
        return err;
    }

    function onlyDigits(v) { return (v || '').replace(/\D/g, ''); }

    cpfInput.addEventListener('input', () => clearFieldError(cpfInput));
    employeeNameInput.addEventListener('input', () => clearFieldError(employeeNameInput));
    companyNameInput.addEventListener('input', () => clearFieldError(companyNameInput));
    zipInput.addEventListener('input', () => clearFieldError(zipInput));
    numberInput.addEventListener('input', () => clearFieldError(numberInput));
    documentsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('document-name') || e.target.classList.contains('document-expiration')) {
            clearFieldError(e.target);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cpf = cpfInput.value;
        const employee_name = employeeNameInput.value;
        const company_name = companyNameInput.value;
        const token = localStorage.getItem('token');

        const documents = Array.from(document.querySelectorAll('.document-entry')).map(entry => {
            const name = entry.querySelector('.document-name').value;
            const expiration_date = entry.querySelector('.document-expiration').value;
            return { name, expiration_date };
        });

        const addressData = coletarDadosEndereco();
        const hasAddress = Object.keys(addressData).length > 0;

        const errors = [];
        const cpfDigits = onlyDigits(cpf);
        if (!cpfDigits || cpfDigits.length !== 11) errors.push({ input: cpfInput, msg: 'Informe um CPF válido com 11 dígitos.' });
        if (!employee_name.trim()) errors.push({ input: employeeNameInput, msg: 'Informe o nome do funcionário.' });
        if (!company_name.trim()) errors.push({ input: companyNameInput, msg: 'Informe o nome da empresa.' });

        const cepDigits = onlyDigits(zipInput.value);
        if (cepDigits && cepDigits.length !== 8) errors.push({ input: zipInput, msg: 'CEP deve ter 8 dígitos.' });
        if (streetInput.value.trim() && !numberInput.value.trim()) errors.push({ input: numberInput, msg: 'Informe o número do endereço.' });

        const entries = Array.from(document.querySelectorAll('.document-entry'));
        entries.forEach((entry, idx) => {
            const nameEl = entry.querySelector('.document-name');
            const dateEl = entry.querySelector('.document-expiration');
            if (!nameEl.value.trim()) errors.push({ input: nameEl, msg: 'Informe o nome do documento.' });
            if (!dateEl.value) errors.push({ input: dateEl, msg: 'Informe a data de vencimento.' });
        });

        if (errors.length) {
            errors.forEach(ei => setFieldError(ei.input, ei.msg));
            errors[0].input.focus();
            return;
        }

        const payload = {
            cpf,
            employee_name,
            company_name,
            documents,
            ...(hasAddress && { address: addressData })
        };

        try {
            const response = await fetch('/employee/register_employee', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                modal.classList.remove("hidden");
                setupAccessibleModal(modal, {
                    onClose: () => {
                        modal.classList.add('hidden');
                        closeAccessibleModal(modal);
                    }
                });
            } else {
                const data = await response.json();
                alert(data.message || "Erro ao cadastrar.");
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    });

    // Funcionalidade de verificar CPF
    document.getElementById('verificar-cpf-link').addEventListener('click', async (e) => {
        e.preventDefault();
        const cpfInput = document.getElementById('cpf');
        const cpfValue = cpfInput.value.trim();
        const statusDiv = document.getElementById('cpf-status');
        
        if (!cpfValue) {
            alert('Por favor, digite um CPF para verificar.');
            cpfInput.focus();
            return;
        }
        
        // Mostra loading
        statusDiv.style.display = 'block';
        statusDiv.style.color = '#666';
        statusDiv.textContent = '🔄 Verificando CPF...';
        
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
                statusDiv.style.color = '#28a745'; // verde
                statusDiv.textContent = '✅ CPF ainda não possui cadastro';
            } else if (response.status === 409) {
                // CPF já cadastrado
                statusDiv.style.color = '#dc3545'; // vermelho
                statusDiv.textContent = '❌ CPF já possui cadastro';
            } else {
                statusDiv.style.color = '#dc3545';
                statusDiv.textContent = '❌ Erro ao verificar CPF';
            }
        } catch (error) {
            statusDiv.style.color = '#dc3545';
            statusDiv.textContent = '❌ Erro ao conectar com o servidor';
        }
    });
    
    // Limpa o status quando o CPF é alterado
    document.getElementById('cpf').addEventListener('input', () => {
        const statusDiv = document.getElementById('cpf-status');
        statusDiv.style.display = 'none';
    });

    // Função global para voltar
    window.goBack = function() {
        window.location.href = "/home";
    };
});
