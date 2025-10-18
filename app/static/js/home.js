// home.js - Script acessível para página inicial

// Função para anunciar mudanças para screen readers
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica autenticação ao carregar a página
    checkAuth();

    // Adicionar eventos de teclado para navegação
    document.addEventListener('keydown', function(e) {
        // Atalhos de teclado
        if (e.altKey) {
            switch(e.key) {
                case 'c':
                case 'C':
                    e.preventDefault();
                    goToCadastro();
                    break;
                case 'l':
                case 'L':
                    e.preventDefault();
                    goToConsulta();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    logout();
                    break;
            }
        }
    });

    // Funções de navegação acessíveis
    window.goToCadastro = function() {
        announceToScreenReader('Navegando para cadastro de funcionário...');
        window.location.href = "/cadastro";
    };

    window.goToConsulta = function() {
        announceToScreenReader('Navegando para consulta de funcionários...');
        window.location.href = "/consulta";
    };
    
    window.logout = function() {
        const confirmLogout = confirm('Tem certeza que deseja sair do sistema?');
        if (confirmLogout) {
            localStorage.removeItem("token");
            announceToScreenReader('Logout realizado com sucesso. Redirecionando...', 'assertive');
            window.location.href = "/";
        }
    };

    // Anunciar página carregada
    announceToScreenReader('Página inicial carregada. Use Alt+C para cadastrar, Alt+L para consultar, ou Alt+S para sair.');
});
