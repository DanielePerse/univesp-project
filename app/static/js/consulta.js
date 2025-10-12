// consulta.js - Funcionalidades da página de consulta

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    fetchEmployees();

    async function fetchEmployees() {
        try {
            const response = await fetch('/employee/list', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Erro ao buscar funcionários.");
                return;
            }

            const tbody = document.getElementById('employee-body');
            tbody.innerHTML = '';

            data.forEach(emp => {
                const row = document.createElement('tr');
                
                // Define cor do texto baseado no status
                let statusStyle = '';
                let statusText = '';
                
                switch(emp.status) {
                    case 'expired':
                        statusStyle = 'style="color: #dc3545; font-weight: bold;"'; // Vermelho
                        statusText = 'Vencido';
                        break;
                    case 'expiring':
                        statusStyle = 'style="color: #ffc107; font-weight: bold;"'; // Amarelo
                        statusText = 'A Vencer';
                        break;
                    case 'valid':
                        statusStyle = 'style="color: #28a745; font-weight: bold;"'; // Verde
                        statusText = 'Vigente';
                        break;
                    default:
                        statusStyle = '';
                        statusText = 'Indefinido';
                }

                row.innerHTML = `
                    <td>${emp.employee_name}</td>
                    <td>${emp.cpf}</td>
                    <td>${emp.company_name}</td>
                    <td>${emp.address || 'Não informado'}</td>
                    <td><span ${statusStyle}>${statusText}</span></td>
                    <td><button onclick="consultarFuncionario('${emp.id}')" class="button-table">Ver Detalhes</button></td>
                `;

                tbody.appendChild(row);
            });
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    // Tornar funções globais para uso nos templates
    window.fetchEmployees = fetchEmployees;
});

function consultarFuncionario(id) {
    localStorage.setItem("employee_id", id);
    window.location.href = "/detalhes";
}

function voltarHome() {
    window.location.href = "/home";
}