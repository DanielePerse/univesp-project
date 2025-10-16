// Detalhes do Funcionário - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const employeeId = document.querySelector('script[data-employee-id]')?.getAttribute('data-employee-id') || 
                      document.body.getAttribute('data-employee-id');
    const documentsContainer = document.getElementById("documents-container");

    // Função para criar campo de documento
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

    // Função para carregar dados do funcionário
    async function carregarDados() {
        try {
            const response = await fetch(`http://localhost:5000/employee/${employeeId}`, {
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
            
            // Carrega endereço se existir
            if (data.endereco && document.getElementById("endereco")) {
                document.getElementById("endereco").value = data.endereco;
            }

            data.documents.forEach(doc => createDocumentInput(doc));
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    // Event listener para adicionar documento
    document.getElementById("add-document").addEventListener("click", () => {
        createDocumentInput();
    });

    // Event listener para submeter formulário
    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const cpf = document.getElementById("cpf").value;
        const employee_name = document.getElementById("employee_name").value;
        const company_name = document.getElementById("company_name").value;
        
        // Inclui endereço se o campo existir
        const endereco = document.getElementById("endereco") ? document.getElementById("endereco").value : undefined;

        const documents = Array.from(document.querySelectorAll(".document-entry")).map(entry => ({
            id: entry.querySelector(".document-id").value || undefined,
            name: entry.querySelector(".document-name").value,
            expiration_date: entry.querySelector(".document-expiration").value
        }));

        const payload = {
            cpf,
            employee_name,
            company_name,
            documents
        };
        
        // Adiciona endereço ao payload se existir
        if (endereco !== undefined) {
            payload.endereco = endereco;
        }

        try {
            const response = await fetch(`http://localhost:5000/employee/${employeeId}`, {
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

    // Carrega dados quando a página carrega
    carregarDados();

    // Disponibiliza funções globalmente
    window.createDocumentInput = createDocumentInput;
    window.carregarDados = carregarDados;
});

// Função global para voltar
function voltarParaConsulta() {
    window.location.href = "/consulta";
}