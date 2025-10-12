// home.js - Funcionalidades da página home

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

function goToCadastro() {
    window.location.href = "/cadastro";
}

function goToConsulta() {
    window.location.href = "/consulta";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}