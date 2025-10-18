# 🌟 Plano de Implementação - Acessibilidade

## 📋 Melhorias Prioritárias

### 🎯 **FASE 1: Fundamentos (1-2 semanas)**

#### 1. **HTML Semântico e ARIA**
```html
<!-- Antes -->
<html lang="en">
<div class="form-container">

<!-- Depois -->
<html lang="pt-BR">
<main class="form-container" role="main" aria-labelledby="main-title">
```

#### 2. **Labels e Descrições**
```html
<!-- Melhorar labels -->
<label for="cpf" id="cpf-label">
  <strong>CPF</strong>
  <span class="sr-only">(obrigatório, formato: 000.000.000-00)</span>
</label>
<input 
  type="text" 
  id="cpf" 
  required 
  placeholder="000.000.000-00"
  aria-labelledby="cpf-label"
  aria-describedby="cpf-help cpf-status"
  aria-invalid="false"
/>
<div id="cpf-help" class="form-help">
  Digite apenas números, formatação automática
</div>
```

#### 3. **Navegação por Teclado**
```css
/* Focus visível */
input:focus, button:focus, a:focus {
  outline: 3px solid #4CAF50;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
}
.skip-link:focus {
  top: 6px;
}
```

### 🎨 **FASE 2: Visual e Interação (2-3 semanas)**

#### 4. **Contraste e Cores**
```css
/* Melhorar contraste - WCAG AA */
:root {
  --primary-green: #2E7D2E;    /* Mais escuro */
  --error-red: #C62828;        /* Contraste AA */
  --warning-orange: #F57C00;   /* Contraste AA */
  --success-green: #2E7D2E;    /* Contraste AA */
  --text-primary: #212121;     /* Contraste AAA */
  --text-secondary: #757575;   /* Contraste AA */
}

/* Estados de erro mais acessíveis */
.error-input {
  border-color: var(--error-red);
  background-color: #FFEBEE;
}

.error-message {
  color: var(--error-red);
  display: flex;
  align-items: center;
}

.error-message::before {
  content: "⚠️";
  margin-right: 4px;
}
```

#### 5. **Feedback Visual e Sonoro**
```html
<!-- Status com ícones e texto -->
<div id="cpf-status" class="status-message" role="alert" aria-live="polite">
  <span class="status-icon" aria-hidden="true">✅</span>
  <span>CPF disponível para cadastro</span>
</div>
```

### 📱 **FASE 3: Responsividade e Mobile (1-2 semanas)**

#### 6. **Touch e Mobile**
```css
/* Targets de toque maiores */
button, .btn, input[type="submit"] {
  min-height: 44px; /* iOS guidelines */
  min-width: 44px;
  padding: 12px 16px;
}

/* Melhor espaçamento mobile */
@media (max-width: 768px) {
  .form-group {
    margin-bottom: 24px;
  }
  
  input, textarea, select {
    font-size: 16px; /* Evita zoom no iOS */
  }
}
```

### 🔊 **FASE 4: Screen Readers e Assistivas (2-3 semanas)**

#### 7. **Anúncios para Screen Readers**
```javascript
// Função para anunciar mudanças
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

// Exemplo de uso
function showSuccessMessage(message) {
  announceToScreenReader(`Sucesso: ${message}`);
}
```

#### 8. **Tabelas Acessíveis**
```html
<!-- Tabela de funcionários -->
<table role="table" aria-label="Lista de funcionários">
  <caption class="sr-only">
    Lista de funcionários com status de documentos
  </caption>
  <thead>
    <tr>
      <th scope="col" id="name">Nome</th>
      <th scope="col" id="company">Empresa</th>
      <th scope="col" id="cpf">CPF</th>
      <th scope="col" id="status">Status</th>
      <th scope="col" id="actions">Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td headers="name">João Silva</td>
      <td headers="company">Empresa ABC</td>
      <td headers="cpf">123.456.789-00</td>
      <td headers="status">
        <span class="status expired" aria-label="Documentos vencidos">
          <span aria-hidden="true">🔴</span> Vencido
        </span>
      </td>
      <td headers="actions">
        <button aria-label="Editar funcionário João Silva">Editar</button>
      </td>
    </tr>
  </tbody>
</table>
```

## 🛠️ **Ferramentas para Implementar**

### **CSS Classes Utilitárias**
```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  * {
    border-color: ButtonText !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **JavaScript para Acessibilidade**
```javascript
// Gerenciamento de foco
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}
```

## 📊 **Testes de Acessibilidade**

### **Ferramentas Automáticas**
- **axe-core** - Teste automatizado
- **Lighthouse** - Audit de acessibilidade
- **WAVE** - Extensão do navegador

### **Testes Manuais**
1. **Navegação apenas por teclado** (Tab, Enter, Esc, setas)
2. **Screen reader** (NVDA gratuito, JAWS)
3. **Zoom** até 200% sem scroll horizontal
4. **Alto contraste** (Windows, macOS)
5. **Daltonismo** (simuladores online)

## 🎯 **Impacto Esperado**

### **Benefícios Diretos:**
- ✅ Usuários com deficiências visuais
- ✅ Usuários com mobilidade limitada  
- ✅ Usuários com deficiências cognitivas
- ✅ Usuários em dispositivos móveis
- ✅ Usuários em ambientes ruidosos
- ✅ Conformidade legal (Lei Brasileira de Inclusão)

### **Benefícios Indiretos:**
- ✅ Melhor SEO (estrutura semântica)
- ✅ Código mais limpo e manutenível
- ✅ Melhor experiência para todos
- ✅ Diferencial competitivo
- ✅ Responsabilidade social

## 📅 **Cronograma Sugerido**

**Semana 1-2:** HTML semântico e ARIA básico
**Semana 3-4:** Contraste, cores e feedback visual  
**Semana 5-6:** Navegação por teclado e mobile
**Semana 7-9:** Screen readers e testes
**Semana 10:** Documentação e treinamento

**Total:** ~10 semanas para implementação completa