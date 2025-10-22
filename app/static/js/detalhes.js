document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const employeeId = window.employeeId; // Será definido no HTML
    const documentsContainer = document.getElementById("documents-container");
    const form = document.getElementById('edit-form');
    const cpfInput = document.getElementById('cpf');
    const employeeNameInput = document.getElementById('employee_name');
    const companyNameInput = document.getElementById('company_name');
    const zipInput = document.getElementById('zip_code');
    const streetInput = document.getElementById('street');
    const numberInput = document.getElementById('number');

    configurarEventosCep();
    configurarMascaraCpf('cpf');

    function createDocumentInput(doc = {}) {
        const div = document.createElement("div");
        div.classList.add("document-entry");
        div.style.display = "flex";
        div.style.gap = "10px";
        div.style.marginBottom = "15px";

        div.innerHTML = `
            <input type="hidden" class="document-id" value="${doc.id || ''}" />
            <input type="text" class="document-name input_register" placeholder="Nome do Documento" value="${doc.name || ''}" required style="flex: 1;" />
            <input type="date" class="document-expiration input_register" value="${doc.expiration_date || ''}" required style="width: 150px;" />
        `;

        documentsContainer.appendChild(div);
    }

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

    async function carregarDados() {
        try {
            const response = await fetch(`/employee/${employeeId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.message || "Erro ao buscar dados do funcionário.");
                return;
            }

            document.getElementById("cpf").value = aplicarMascaraCpf(data.cpf || '');
            document.getElementById("employee_name").value = data.employee_name;
            document.getElementById("company_name").value = data.company_name;

            // Carrega dados de endereço se existirem
            if (data.address) {
                // Se o endereço vier como string JSON, faz o parse
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

            data.documents.forEach(doc => createDocumentInput(doc));
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    document.getElementById("add-document").addEventListener("click", () => {
        createDocumentInput();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cpf = cpfInput.value;
        const employee_name = employeeNameInput.value;
        const company_name = companyNameInput.value;

        const documents = Array.from(document.querySelectorAll(".document-entry")).map(entry => ({
            id: entry.querySelector(".document-id").value || undefined,
            name: entry.querySelector(".document-name").value,
            expiration_date: entry.querySelector(".document-expiration").value
        }));

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
        entries.forEach((entry) => {
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
                const modal = document.getElementById("modal");
                modal.classList.remove("hidden");
                setupAccessibleModal(modal, {
                    onClose: () => {
                        modal.classList.add('hidden');
                        closeAccessibleModal(modal);
                    }
                });
            } else {
                alert(data.message || "Erro ao atualizar funcionário.");
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    });

    window.voltarParaConsulta = function() {
        window.location.href = "/consulta";
    };

    carregarDados();
});
