// detalhes.js - Script para página de detalhes do funcionário

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const employeeId = window.employeeId; // Será definido no HTML
    const documentsContainer = document.getElementById("documents-container");

    // Configurar eventos de CEP (função do utils.js)
    configurarEventosCep();

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

            document.getElementById("cpf").value = data.cpf;
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

    // Adicionar documento
    document.getElementById("add-document").addEventListener("click", () => {
        createDocumentInput();
    });

    // Submit do formulário
    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const cpf = document.getElementById("cpf").value;
        const employee_name = document.getElementById("employee_name").value;
        const company_name = document.getElementById("company_name").value;

        const documents = Array.from(document.querySelectorAll(".document-entry")).map(entry => ({
            id: entry.querySelector(".document-id").value || undefined,
            name: entry.querySelector(".document-name").value,
            expiration_date: entry.querySelector(".document-expiration").value
        }));

        // Coleta dados de endereço (função do utils.js)
        const addressData = coletarDadosEndereco();
        const hasAddress = Object.keys(addressData).length > 0;

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
                document.getElementById("modal").classList.remove("hidden");
            } else {
                alert(data.message || "Erro ao atualizar funcionário.");
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    });

    // Função global
    window.voltarParaConsulta = function() {
        window.location.href = "/consulta";
    };

    // Carrega os dados ao inicializar
    carregarDados();
});
