document.addEventListener('DOMContentLoaded', function() {
    checkAuth();

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
