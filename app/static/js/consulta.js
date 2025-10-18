// consulta.js - Script acessível para página de consulta de funcionários

let allEmployees = []; // Armazena todos os funcionários
let filteredEmployees = []; // Armazena funcionários filtrados
let currentSort = { column: null, direction: 'asc' };

// Função para anunciar mudanças para screen readers
function announceToScreenReader(message, priority = 'polite') {
    const targetDiv = priority === 'assertive' ? 
        document.getElementById('error-announcements') : 
        document.getElementById('status-announcements');
    
    if (targetDiv) {
        targetDiv.textContent = message;
        
        setTimeout(() => {
            targetDiv.textContent = '';
        }, 3000);
    }
}

// Função para mostrar/esconder loading
function toggleLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    const tableSection = document.querySelector('.table-section');
    
    if (show) {
        loadingIndicator.classList.remove('hidden');
        tableSection.style.opacity = '0.5';
        announceToScreenReader('Carregando dados dos funcionários...', 'polite');
    } else {
        loadingIndicator.classList.add('hidden');
        tableSection.style.opacity = '1';
    }
}

// Função para atualizar estatísticas
function updateStats() {
    const totalCount = document.getElementById('total-count');
    const filteredCount = document.getElementById('filtered-count');
    
    totalCount.textContent = allEmployees.length;
    filteredCount.textContent = filteredEmployees.length;
    
    // Atualizar aria-labels para screen readers
    totalCount.setAttribute('aria-label', `${allEmployees.length} funcionários no total`);
    filteredCount.setAttribute('aria-label', `${filteredEmployees.length} funcionários sendo exibidos`);
}

// Função para filtrar funcionários
function filterEmployees() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredEmployees = allEmployees.filter(emp => {
        const matchesSearch = !searchTerm || 
            emp.employee_name.toLowerCase().includes(searchTerm) ||
            emp.cpf.includes(searchTerm) ||
            emp.company_name.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilter || emp.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    updateStats();
    renderTable();
    
    // Anunciar resultados
    if (searchTerm || statusFilter) {
        const resultsMessage = `${filteredEmployees.length} funcionário(s) encontrado(s) com os filtros aplicados.`;
        announceToScreenReader(resultsMessage, 'polite');
    }
}

// Função para ordenar dados
function sortData(column) {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    filteredEmployees.sort((a, b) => {
        let valueA, valueB;
        
        switch (column) {
            case 'name':
                valueA = a.employee_name.toLowerCase();
                valueB = b.employee_name.toLowerCase();
                break;
            case 'cpf':
                valueA = a.cpf;
                valueB = b.cpf;
                break;
            case 'company':
                valueA = a.company_name.toLowerCase();
                valueB = b.company_name.toLowerCase();
                break;
            case 'status':
                // Ordem de prioridade: expired, expiring, valid
                const statusOrder = { expired: 0, expiring: 1, valid: 2 };
                valueA = statusOrder[a.status] || 3;
                valueB = statusOrder[b.status] || 3;
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderTable();
    updateSortIndicators();
    
    const directionText = currentSort.direction === 'asc' ? 'crescente' : 'decrescente';
    announceToScreenReader(`Tabela ordenada por ${column} em ordem ${directionText}.`, 'polite');
}

// Função para atualizar indicadores de ordenação
function updateSortIndicators() {
    // Limpar todos os indicadores
    document.querySelectorAll('.sort-button').forEach(btn => {
        const th = btn.closest('th');
        const indicator = btn.querySelector('.sort-indicator');
        
        th.setAttribute('aria-sort', 'none');
        indicator.textContent = '';
        
        if (btn.dataset.column === currentSort.column) {
            const direction = currentSort.direction;
            th.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
            indicator.textContent = direction === 'asc' ? ' ↑' : ' ↓';
        }
    });
}

// Função para renderizar a tabela
function renderTable() {
    const tbody = document.getElementById('employee-body');
    const noResults = document.getElementById('no-results');
    
    tbody.innerHTML = '';
    
    if (filteredEmployees.length === 0) {
        noResults.classList.remove('hidden');
        noResults.focus();
        return;
    }
    
    noResults.classList.add('hidden');
    
    filteredEmployees.forEach((emp, index) => {
        const row = document.createElement('tr');
        row.setAttribute('role', 'row');
        row.setAttribute('data-employee-id', emp.id);
        row.setAttribute('tabindex', '0');
        
        // Definir status com classes CSS apropriadas
        let statusClass, statusText, statusAriaLabel;
        
        switch(emp.status) {
            case 'expired':
                statusClass = 'status-expired';
                statusText = 'Vencido';
                statusAriaLabel = 'Status: Documentos vencidos - requer atenção urgente';
                break;
            case 'expiring':
                statusClass = 'status-expiring';
                statusText = 'Próximo a vencer';
                statusAriaLabel = 'Status: Documentos próximos ao vencimento - requer atenção';
                break;
            case 'valid':
                statusClass = 'status-valid';
                statusText = 'Vigente';
                statusAriaLabel = 'Status: Documentos vigentes - em conformidade';
                break;
            default:
                statusClass = 'status-unknown';
                statusText = 'Desconhecido';
                statusAriaLabel = 'Status: Status desconhecido';
        }
        
        row.innerHTML = `
            <td role="cell">
                <span class="employee-name">${emp.employee_name}</span>
            </td>
            <td role="cell">
                <span class="employee-cpf">${emp.cpf}</span>
            </td>
            <td role="cell">
                <span class="company-name">${emp.company_name}</span>
            </td>
            <td role="cell" class="${statusClass}">
                <span 
                    class="status-indicator" 
                    aria-label="${statusAriaLabel}"
                    title="${statusAriaLabel}"
                >
                    <strong>${statusText}</strong>
                </span>
            </td>
            <td role="cell">
                <button 
                    type="button"
                    onclick="consultarFuncionario('${emp.id}')" 
                    class="button-table"
                    aria-label="Ver detalhes de ${emp.employee_name}"
                    title="Acessar página de detalhes do funcionário"
                >
                    Ver Detalhes
                </button>
            </td>
        `;
        
        // Adicionar eventos de teclado para navegação
        row.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                consultarFuncionario(emp.id);
            }
            
            // Navegação com setas
            const currentIndex = Array.from(tbody.children).indexOf(this);
            let targetRow = null;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    targetRow = tbody.children[currentIndex - 1];
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    targetRow = tbody.children[currentIndex + 1];
                    break;
                case 'Home':
                    e.preventDefault();
                    targetRow = tbody.children[0];
                    break;
                case 'End':
                    e.preventDefault();
                    targetRow = tbody.children[tbody.children.length - 1];
                    break;
            }
            
            if (targetRow) {
                targetRow.focus();
            }
        });
        
        // Adicionar evento de foco para anúncio
        row.addEventListener('focus', function() {
            const position = Array.from(tbody.children).indexOf(this) + 1;
            const total = tbody.children.length;
            announceToScreenReader(
                `Linha ${position} de ${total}: ${emp.employee_name}, CPF ${emp.cpf}, ${emp.company_name}, ${statusText}`, 
                'polite'
            );
        });
        
        tbody.appendChild(row);
    });
}

// Função para buscar funcionários do servidor
async function fetchEmployees() {
    const token = localStorage.getItem('token');
    
    toggleLoading(true);
    
    try {
        const response = await fetch('/employee/list', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar funcionários.");
        }

        allEmployees = data;
        filteredEmployees = [...allEmployees];
        
        updateStats();
        renderTable();
        
        announceToScreenReader(`${allEmployees.length} funcionário(s) carregado(s) com sucesso.`, 'polite');
        
    } catch (err) {
        const errorMessage = err.message || "Erro ao conectar com o servidor.";
        announceToScreenReader(`Erro: ${errorMessage}`, 'assertive');
        console.error('Erro ao carregar funcionários:', err);
        
        // Mostrar mensagem de erro na interface
        const tbody = document.getElementById('employee-body');
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="error-message" style="text-align: center; padding: 20px;">
                    <strong>Erro ao carregar funcionários:</strong><br>
                    ${errorMessage}
                    <br><br>
                    <button type="button" onclick="fetchEmployees()" class="button-secondary">
                        Tentar novamente
                    </button>
                </td>
            </tr>
        `;
    } finally {
        toggleLoading(false);
    }
}

// Função para limpar filtros
function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('status-filter').value = '';
    
    filteredEmployees = [...allEmployees];
    updateStats();
    renderTable();
    
    announceToScreenReader('Todos os filtros foram removidos. Exibindo todos os funcionários.', 'polite');
    
    // Focar no campo de busca
    document.getElementById('search-input').focus();
}

// Função para exportar dados (simulação)
function exportData() {
    if (filteredEmployees.length === 0) {
        announceToScreenReader('Nenhum funcionário para exportar.', 'assertive');
        return;
    }
    
    // Simulação de exportação
    const csvContent = [
        'Nome,CPF,Empresa,Status',
        ...filteredEmployees.map(emp => 
            `"${emp.employee_name}","${emp.cpf}","${emp.company_name}","${emp.status}"`
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `funcionarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    announceToScreenReader(`Lista de ${filteredEmployees.length} funcionário(s) exportada com sucesso.`, 'polite');
}

document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos de filtro
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const clearSearchBtn = document.getElementById('clear-search');
    
    // Debounce para busca
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterEmployees();
        }, 300);
        
        // Mostrar/esconder botão de limpar
        clearSearchBtn.style.display = this.value ? 'block' : 'none';
    });
    
    // Filtro de status
    statusFilter.addEventListener('change', filterEmployees);
    
    // Botão de limpar busca
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.focus();
        this.style.display = 'none';
        filterEmployees();
    });
    
    // Configurar eventos de ordenação
    document.querySelectorAll('.sort-button').forEach(button => {
        button.addEventListener('click', function() {
            sortData(this.dataset.column);
        });
        
        // Suporte para teclado
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sortData(this.dataset.column);
            }
        });
    });
    
    // Configurar botões de ação
    document.getElementById('refresh-data').addEventListener('click', function() {
        announceToScreenReader('Atualizando dados...', 'polite');
        fetchEmployees();
    });
    
    document.getElementById('export-data').addEventListener('click', exportData);
    
    document.getElementById('clear-filters').addEventListener('click', clearAllFilters);
    
    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl + F para focar na busca
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // F5 para atualizar dados
        if (e.key === 'F5') {
            e.preventDefault();
            fetchEmployees();
        }
        
        // Escape para limpar filtros
        if (e.key === 'Escape') {
            clearAllFilters();
        }
    });
    
    // Carrega os funcionários ao inicializar
    fetchEmployees();
    
    announceToScreenReader('Página de consulta carregada. Use Ctrl+F para buscar, F5 para atualizar, ou Escape para limpar filtros.');
});

// Funções globais
window.consultarFuncionario = function(id) {
    announceToScreenReader('Abrindo detalhes do funcionário...', 'polite');
    window.location.href = `/detalhes/${id}`;
};

window.voltarHome = function() {
    announceToScreenReader('Retornando à página inicial...', 'polite');
    window.location.href = "/home";
};
