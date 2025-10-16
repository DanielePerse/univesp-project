// Home - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Verifica autenticação assim que a página carrega
    checkAuth();
});

// Função para ir para página de cadastro
function goToCadastro() {
    window.location.href = "/cadastro";
}

// Função para ir para página de consulta
function goToConsulta() {
    window.location.href = "/consulta";
}

// Função para fazer logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}