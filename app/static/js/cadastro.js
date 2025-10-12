// cadastro.js - Funcionalidades da página de cadastro

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastro-form');
    const addDocumentBtn = document.getElementById('add-document');
    const documentsContainer = document.getElementById('documents-container');
    const modal = document.getElementById('modal');

    addDocumentBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.classList.add('document-entry');
        div.style.marginBottom = "15px";
        div.style.display = "flex";
        div.style.gap = "10px";
        div.innerHTML = `
            <input type="text" class="document-name input_register" required placeholder="Nome do Documento" style="flex: 1;" />
            <input type="date" class="document-expiration input_register" required style="width: 150px;" />
        `;
        documentsContainer.appendChild(div);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cpf = document.getElementById('cpf').value;
        const employee_name = document.getElementById('employee_name').value;
        const company_name = document.getElementById('company_name').value;
        const address = document.getElementById('address').value;
        const token = localStorage.getItem('token');
        
        // Verificar se o usuário está logado
        if (!token) {
            alert('Você precisa estar logado para cadastrar funcionários.');
            window.location.href = '/login';
            return;
        }

        // Verificar campos obrigatórios
        if (!cpf || !employee_name || !company_name) {
            alert('Por favor, preencha todos os campos obrigatórios (CPF, Nome do funcionário e Nome da empresa).');
            return;
        }

        const documents = Array.from(document.querySelectorAll('.document-entry')).map(entry => {
            const name = entry.querySelector('.document-name').value;
            const expiration_date = entry.querySelector('.document-expiration').value;
            return { name, expiration_date };
        });
        
        // Verificar se pelo menos um documento foi preenchido
        if (documents.length === 0 || !documents[0].name || !documents[0].expiration_date) {
            alert('Por favor, preencha pelo menos um documento com nome e data de expiração.');
            return;
        }

        const payload = {
            cpf,
            employee_name,
            company_name,
            address,
            documents
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

    // Funcionalidade do botão do modal
    const voltarBtn = document.getElementById('voltar-btn');
    if (voltarBtn) {
        voltarBtn.addEventListener('click', () => {
            window.location.href = "/home";
        });
    }
});

function goBack() {
    window.location.href = "/home";
}