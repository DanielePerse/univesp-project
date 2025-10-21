// utils.js

// Função para obter token salvo localmente
function getToken() {
  return localStorage.getItem("token");
}

// Função para verificar autenticação
function checkAuth() {
  const token = getToken();
  if (!token) {
    // Se não há token, redireciona para login
    window.location.href = "/";
    return false;
  }
  return true;
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

// ===== FUNÇÕES DA API VIACEP =====

// Função para aplicar máscara de CEP
function aplicarMascaraCep(valor) {
  return valor.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
}

// Função para limpar campos de endereço
function limparCamposEndereco() {
  document.getElementById('street').value = '';
  document.getElementById('neighborhood').value = '';
  document.getElementById('city').value = '';
}

// Função para buscar CEP na API ViaCEP
async function buscarCep(cepInput, cepStatus) {
  const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  
  // Validação básica do CEP
  if (cep.length !== 8) {
    cepStatus.style.display = 'block';
    cepStatus.style.color = '#dc3545';
    cepStatus.textContent = '❌ CEP deve ter 8 dígitos';
    return;
  }

  // Mostra loading
  cepStatus.style.display = 'block';
  cepStatus.style.color = '#666';
  cepStatus.textContent = '🔄 Buscando endereço...';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      // CEP não encontrado
      cepStatus.style.color = '#dc3545';
      cepStatus.textContent = '❌ CEP não encontrado';
      limparCamposEndereco();
    } else {
      // CEP encontrado - preenche os campos
      document.getElementById('street').value = data.logradouro || '';
      document.getElementById('neighborhood').value = data.bairro || '';
      document.getElementById('city').value = data.localidade || '';
      
      cepStatus.style.color = '#28a745';
      cepStatus.textContent = '✅ Endereço encontrado';
      
      // Foca no campo número para o usuário continuar
      const numberField = document.getElementById('number');
      if (numberField) numberField.focus();
    }
  } catch (error) {
    cepStatus.style.color = '#dc3545';
    cepStatus.textContent = '❌ Erro ao buscar CEP';
    limparCamposEndereco();
  }
}

// Função para configurar eventos de CEP em uma página
function configurarEventosCep() {
  const buscarCepBtn = document.getElementById('buscar-cep-btn');
  const cepInput = document.getElementById('zip_code');
  const cepStatus = document.getElementById('cep-status');

  if (!buscarCepBtn || !cepInput || !cepStatus) {
    console.warn('Elementos de CEP não encontrados na página');
    return;
  }

  // Aplicar máscara no CEP enquanto digita
  cepInput.addEventListener('input', (e) => {
    e.target.value = aplicarMascaraCep(e.target.value);
    // Limpa status e campos quando CEP é alterado
    cepStatus.style.display = 'none';
    limparCamposEndereco();
  });

  // Event listener para o link de buscar CEP
  buscarCepBtn.addEventListener('click', (e) => {
    e.preventDefault();
    buscarCep(cepInput, cepStatus);
  });

  // Permite buscar CEP pressionando Enter no campo
  cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarCep(cepInput, cepStatus);
    }
  });
}

// Função para coletar dados de endereço do formulário
function coletarDadosEndereco() {
  const addressData = {};
  
  // Só adiciona campos que não estão vazios
  const street = document.getElementById('street').value.trim();
  const number = document.getElementById('number').value.trim();
  const neighborhood = document.getElementById('neighborhood').value.trim();
  const city = document.getElementById('city').value.trim();
  const complement = document.getElementById('complement').value.trim();
  const zip_code = document.getElementById('zip_code').value.replace(/\D/g, '');

  if (street) addressData.street = street;
  if (number) addressData.number = number;
  if (neighborhood) addressData.neighborhood = neighborhood;
  if (city) addressData.city = city;
  if (complement) addressData.complement = complement;
  if (zip_code) addressData.zip_code = zip_code;

  return addressData;
}

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

function setupAccessibleModal(modal, options = {}) {
  const previouslyFocused = document.activeElement;
  modal.dataset.prevFocus = previouslyFocused ? previouslyFocused.id || 'prev-focus-element' : '';
  const focusables = getFocusableElements(modal);
  if (focusables.length) focusables[0].focus();

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (options.onClose) options.onClose();
      e.stopPropagation();
      return;
    }
    if (e.key === 'Tab') {
      const list = getFocusableElements(modal);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  modal.__a11yKeydownHandler = onKeyDown;
  document.addEventListener('keydown', onKeyDown, true);
}

function closeAccessibleModal(modal) {
  if (modal && modal.__a11yKeydownHandler) {
    document.removeEventListener('keydown', modal.__a11yKeydownHandler, true);
    delete modal.__a11yKeydownHandler;
  }
  const prevId = modal && modal.dataset.prevFocus;
  if (prevId) {
    const prev = document.getElementById(prevId);
    if (prev) prev.focus();
  }
}

document.addEventListener('keydown', function(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.closest('[role="button"]')) {
    e.preventDefault();
    e.target.click();
  }
}, true);
