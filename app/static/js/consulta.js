document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

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
                
                let statusStyle = '';
                let statusText = '';
                
                switch(emp.status) {
                    case 'expired':
                        statusStyle = 'style="color: red;"';
                        statusText = 'Vencido';
                        break;
                    case 'expiring':
                        statusStyle = 'style="color: orange;"';
                        statusText = 'Próximo a vencer';
                        break;
                    case 'valid':
                        statusStyle = 'style="color: green;"';
                        statusText = 'Vigente';
                        break;
                    default:
                        statusStyle = '';
                        statusText = 'Desconhecido';
                }

                row.innerHTML = `
                    <td>${emp.employee_name}</td>
                    <td>${emp.cpf}</td>
                    <td>${emp.company_name}</td>
                    <td ${statusStyle}><strong>${statusText}</strong></td>
                    <td><button onclick="consultarFuncionario('${emp.id}')" class="button-table" aria-label="Ver detalhes do funcionário ${emp.employee_name}" title="Ver detalhes de ${emp.employee_name}">Ver Detalhes</button></td>
                `;

                tbody.appendChild(row);
            });
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    window.consultarFuncionario = function(id) {
        window.location.href = `/detalhes/${id}`;
    };

    window.voltarHome = function() {
        window.location.href = "/home";
    };

    fetchEmployees();
});
