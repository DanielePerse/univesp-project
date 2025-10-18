// home.js - Script para página home

document.addEventListener('DOMContentLoaded', function() {
    // Verifica autenticação ao carregar a página
    checkAuth();

    // Funções de navegação
    window.goToCadastro = function() {
        window.location.href = "/cadastro";
    };

    window.goToConsulta = function() {
        window.location.href = "/consulta";
    };
    
    window.logout = function() {
        localStorage.removeItem("token");
        window.location.href = "/";
    };
});
