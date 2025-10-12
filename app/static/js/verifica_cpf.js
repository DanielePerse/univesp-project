// verifica_cpf.js - Funcionalidades da página de verificação de CPF

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cpf-form');
    const messageDiv = document.getElementById('message');
    const cpfInput = document.getElementById('cpf');

    // Preenche o CPF se veio da página de cadastro
    window.onload = function() {
        const cpfParaVerificar = localStorage.getItem('cpf_para_verificar');
        if (cpfParaVerificar) {
            cpfInput.value = cpfParaVerificar;
            localStorage.removeItem('cpf_para_verificar');
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cpf = cpfInput.value;
        const token = localStorage.getItem('token');
        const origemVerificacao = localStorage.getItem('origem_verificacao');

        try {
            const response = await fetch(`/employee/check_register/${cpf}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // CPF não encontrado - pode prosseguir com cadastro
                messageDiv.textContent = "CPF disponível para cadastro!";
                messageDiv.style.color = "green";
                
                // Se veio da página de cadastro, salva o CPF e retorna
                if (origemVerificacao === '/cadastro') {
                    localStorage.setItem('cpf_verificado', cpf);
                    localStorage.removeItem('origem_verificacao');
                    setTimeout(() => {
                        window.location.href = "/cadastro";
                    }, 1500);
                } else {
                    // Comportamento original - vai para cadastro
                    localStorage.setItem("cpf", cpf);
                    setTimeout(() => {
                        window.location.href = "/cadastro";
                    }, 1500);
                }
            } else if (response.status === 409) {
                messageDiv.textContent = "Este CPF já está cadastrado!";
                messageDiv.style.color = "red";
                
                // Se veio da página de cadastro, oferece opção de retornar
                if (origemVerificacao === '/cadastro') {
                    setTimeout(() => {
                        const retornar = confirm("CPF já cadastrado. Deseja retornar ao cadastro para digitar outro CPF?");
                        if (retornar) {
                            localStorage.removeItem('origem_verificacao');
                            window.location.href = "/cadastro";
                        }
                    }, 2000);
                }
            } else {
                messageDiv.textContent = data.message || "Erro ao verificar CPF.";
                messageDiv.style.color = "red";
            }
        } catch (err) {
            messageDiv.textContent = "Erro na conexão com o servidor.";
            messageDiv.style.color = "red";
        }
    });
});

function goBack() {
    const origemVerificacao = localStorage.getItem('origem_verificacao');
    
    if (origemVerificacao === '/cadastro') {
        localStorage.removeItem('origem_verificacao');
        window.location.href = "/cadastro";
    } else {
        window.location.href = "/home";
    }
}