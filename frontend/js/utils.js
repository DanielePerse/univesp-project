// utils.js

// Função para obter token salvo localmente
function getToken() {
  return localStorage.getItem("token");
}

// Função para configurar headers da requisição com Authorization
function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Função para exibir modais simples de confirmação
function showModal(message, redirectTo = null) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <p>${message}</p>
      <button onclick="closeModal('${redirectTo}')">OK</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeModal(redirectTo) {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
  if (redirectTo) {
    window.location.href = redirectTo;
  }
}
