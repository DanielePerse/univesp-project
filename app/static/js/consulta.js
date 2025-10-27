document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    let allEmployees = [];

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

            allEmployees = data;
            displayEmployees(data);
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        }
    }

    function displayEmployees(employees) {
        const tbody = document.getElementById('employee-body');
        tbody.innerHTML = '';

        employees.forEach(emp => {
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
    }

    function filterEmployees(searchTerm) {
        const filteredEmployees = allEmployees.filter(emp => 
            emp.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayEmployees(filteredEmployees);
    }

    window.consultarFuncionario = function(id) {
        window.location.href = `/detalhes/${id}`;
    };

    window.voltarHome = function() {
        window.location.href = "/home";
    };

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function(e) {
        filterEmployees(e.target.value);
    });

    fetchEmployees();
});
