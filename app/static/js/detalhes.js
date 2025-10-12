// detalhes.js - Funcionalidades da página de detalhes

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const employeeId = localStorage.getItem("employee_id");
    const documentsContainer = document.getElementById("documents-container");

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
            <button type="button" onclick="this.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">×</button>
        `;

        documentsContainer.appendChild(div);
    }

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
            document.getElementById("address").value = data.address || '';

            data.documents.forEach(doc => createDocumentInput(doc));
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    document.getElementById("add-document").addEventListener("click", () => {
        createDocumentInput();
    });

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const cpf = document.getElementById("cpf").value;
        const employee_name = document.getElementById("employee_name").value;
        const company_name = document.getElementById("company_name").value;
        const address = document.getElementById("address").value;

        const documents = Array.from(document.querySelectorAll(".document-entry")).map(entry => ({
            id: entry.querySelector(".document-id").value || undefined,
            name: entry.querySelector(".document-name").value,
            expiration_date: entry.querySelector(".document-expiration").value
        }));

        const payload = {
            cpf,
            employee_name,
            company_name,
            address,
            documents
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

    // Funções de deleção
    window.confirmarDelecao = function() {
        document.getElementById("delete-modal").classList.remove("hidden");
        document.getElementById("delete-email").focus();
    }

    window.cancelarDelecao = function() {
        document.getElementById("delete-modal").classList.add("hidden");
        document.getElementById("delete-email").value = "";
        document.getElementById("delete-password").value = "";
    }

    window.executarDelecao = async function() {
        const email = document.getElementById("delete-email").value;
        const password = document.getElementById("delete-password").value;
        
        if (!email || !password) {
            alert("Por favor, preencha email e senha para confirmar a deleção.");
            return;
        }

        try {
            // Primeiro, verificar as credenciais do usuário
            const authResponse = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!authResponse.ok) {
                alert("Email ou senha incorretos. Tente novamente.");
                document.getElementById("delete-password").value = "";
                return;
            }

            // Se as credenciais estiverem corretas, proceder com a deleção
            const deleteResponse = await fetch(`/employee/${employeeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const deleteData = await deleteResponse.json();

            if (deleteResponse.ok) {
                alert("Funcionário deletado com sucesso!");
                window.location.href = "/consulta";
            } else {
                alert(deleteData.message || "Erro ao deletar funcionário.");
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    carregarDados();
});

function voltarParaConsulta() {
    window.location.href = "/consulta";
}