const products = [
  {
    id: 'grossGuet',
    name: 'Gross & Guet',
    price: 49.95,
    mainImage: 'Produktfoto Gross & Guet',
    secondaryImage: 'Produktfoto Gross & Guet',
    contents: [
      'Biottos Goldmelissensirup',
      'Biottos Tomatensauce',
      'Biottos Birnenessig',
      'Biottos Birnel',
      'Biottos Dörrzwetschgen',
      'Biottos Himbeeressig'
    ]
  },
  {
    id: 'feinGuet',
    name: 'Fein & Guet',
    price: 29.95,
    mainImage: 'Produktfoto Fein & Guet',
    secondaryImage: 'Produktfoto Fein & Guet',
    contents: [
      'Biottos Tomatensauce',
      'Biottos Birnenessig',
      'Biottos Kirschenbalsamico',
      'Biottos Dessertzwetschgen',
      'Biottos Dörrbirnen'
    ]
  },
  {
    id: 'chliFii',
    name: 'Chli & Fii',
    price: 19.95,
    mainImage: 'Produktfoto Chli & Fii',
    secondaryImage: 'Produktfoto Chli & Fii',
    contents: [
      'Biottos Himbeeressig',
      'Gedörrte Zwetschgen',
      'Biottos Birnenbalsamico'
    ]
  }
];

const deliveryTimes = [
  '10:30 Uhr',
  '12:00 Uhr',
  '14:30 Uhr',
  '16:00 Uhr',
  '17:30 Uhr'
];

const questions = [
  {
    key: 'recipient',
    title: 'Für wen ist das Geschenk?',
    answers: [
      { label: 'Für Familie', score: { grossGuet: 1, feinGuet: 1, chliFii: 1 } },
      { label: 'Für Freunde', score: { grossGuet: 1, feinGuet: 1, chliFii: 1 } },
      { label: 'Für eine Kollegin oder einen Kollegen', score: { grossGuet: 1, feinGuet: 1, chliFii: 1 } },
      { label: 'Als kleine Aufmerksamkeit', score: { grossGuet: 1, feinGuet: 1, chliFii: 2 } },
      { label: 'Für einen besonderen Anlass', score: { grossGuet: 2, feinGuet: 1, chliFii: 1 } }
    ]
  },
  {
    key: 'joy',
    title: 'Wie gross soll die Freude sein?',
    answers: [
      { label: 'Klein & fein', score: { grossGuet: 0, feinGuet: 1, chliFii: 3 } },
      { label: 'Schön & ausgewogen', score: { grossGuet: 1, feinGuet: 3, chliFii: 1 } },
      { label: 'Grosszügig & besonders', score: { grossGuet: 3, feinGuet: 1, chliFii: 0 } }
    ]
  },
  {
    key: 'budget',
    title: 'Wie viel möchtest du ungefähr ausgeben?',
    answers: [
      { label: 'Bis CHF 20', score: { grossGuet: 0, feinGuet: 1, chliFii: 3 } },
      { label: 'Bis CHF 30', score: { grossGuet: 1, feinGuet: 3, chliFii: 1 } },
      { label: 'Bis CHF 50', score: { grossGuet: 3, feinGuet: 1, chliFii: 0 } }
    ]
  },
  {
    key: 'style',
    title: 'Was passt besser?',
    answers: [
      { label: 'Eine kleine, feine Auswahl', score: { grossGuet: 0, feinGuet: 1, chliFii: 3 } },
      { label: 'Eine ausgewogene Mischung', score: { grossGuet: 1, feinGuet: 3, chliFii: 1 } },
      { label: 'Ein grosszügiger Geschenkkorb', score: { grossGuet: 3, feinGuet: 1, chliFii: 0 } }
    ]
  },
  {
    key: 'feeling',
    title: 'Wie soll das Geschenk wirken?',
    answers: [
      { label: 'Klein, herzlich und unkompliziert', score: { grossGuet: 0, feinGuet: 1, chliFii: 3 } },
      { label: 'Persönlich und ausgewogen', score: { grossGuet: 1, feinGuet: 3, chliFii: 1 } },
      { label: 'Besonders und grosszügig', score: { grossGuet: 3, feinGuet: 1, chliFii: 0 } }
    ]
  }
];

const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));

const state = {
  currentQuestion: 0,
  answers: Array(questions.length).fill(null),
  selectedProduct: null,
  quantity: 1,
  pickupDate: '',
  pickupTime: '',
  suggestion: null
};

function formatPrice(value) {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value);
}

function renderProductCards() {
  const container = document.getElementById('product-grid');
  if (!container) return;

  container.innerHTML = products.map((product) => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image">${product.mainImage}</div>
      <div class="product-meta">
        <h3>${product.name}</h3>
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      <div>
        <strong>Das ist drin</strong>
        <ul>
          ${product.contents.slice(0, 3).map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="product-actions">
        <a href="#finder" class="btn btn-primary">Bestellen</a>
        <a href="#finder" class="btn btn-secondary">Mehr sehen</a>
      </div>
    </article>
  `).join('');
}

function getQuestionByIndex(index) {
  return questions[index];
}

function scoreProducts() {
  const totals = { grossGuet: 0, feinGuet: 0, chliFii: 0 };

  questions.forEach((question, index) => {
    const answerIndex = state.answers[index];
    if (answerIndex === null || answerIndex === undefined) return;
    const answer = question.answers[answerIndex];
    Object.entries(answer.score).forEach(([productId, points]) => {
      totals[productId] += points;
    });
  });

  const maxScore = Math.max(...Object.values(totals));
  let winners = Object.entries(totals)
    .filter(([, score]) => score === maxScore)
    .map(([productId]) => productId);

  if (winners.length > 1) {
    const budgetPreference = questions.find((q) => q.key === 'budget')?.answers[state.answers[2]];
    const viable = winners.sort((a, b) => {
      const aScore = budgetPreference?.score[a] ?? 0;
      const bScore = budgetPreference?.score[b] ?? 0;
      return bScore - aScore;
    });
    winners = viable;
  }

  return winners[0];
}

function renderFinder() {
  const container = document.getElementById('finder-content');
  if (!container) return;

  const question = getQuestionByIndex(state.currentQuestion);
  if (!question) {
    renderResult();
    return;
  }

  const questionNumber = state.currentQuestion + 1;
  const selected = state.answers[state.currentQuestion];

  const buttons = question.answers.map((answer, index) => {
    const selectedClass = index === selected ? 'is-selected' : '';
    return `
      <button type="button" class="answer-btn ${selectedClass}" data-answer-index="${index}">
        ${answer.label}
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="question-stack">
      <div class="question-header">
        <span>Frage ${questionNumber} von ${questions.length}</span>
        <span>${questionNumber}/${questions.length}</span>
      </div>

      <h3 class="question-title">${question.title}</h3>

      <div class="answer-grid">
        ${buttons}
      </div>

      <div class="finder-actions">
        <button type="button" class="link-btn" data-action="back" ${state.currentQuestion === 0 ? 'disabled' : ''}>
          ← Zurück
        </button>
        <button type="button" class="btn btn-primary" data-action="next" ${selected === null || selected === undefined ? 'disabled' : ''}>
          ${state.currentQuestion === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
        </button>
      </div>
    </div>
  `;

  attachFinderListeners();
}

function attachFinderListeners() {
  document.querySelectorAll('.answer-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const answerIndex = Number(button.dataset.answerIndex);
      state.answers[state.currentQuestion] = answerIndex;
      renderFinder();
    });
  });

  const nextButton = document.querySelector('[data-action="next"]');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (state.currentQuestion < questions.length - 1) {
        state.currentQuestion += 1;
        renderFinder();
      } else {
        const winningProductId = scoreProducts();
        state.selectedProduct = productLookup[winningProductId];
        state.suggestion = winningProductId;
        state.currentQuestion = questions.length;
        renderFinder();
      }
    });
  }

  const backButton = document.querySelector('[data-action="back"]');
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
        renderFinder();
      }
    });
  }
}

function makePersonalizedText(product) {
  const mapping = {
    grossGuet: 'Ein grosszügiger Korb mit viel Freude, perfekt für besondere Anlässe und hochwertige Momente.',
    feinGuet: 'Ein ausgewogener Korb mit feiner Auswahl und viel persönlichem Charakter.',
    chliFii: 'Eine kleine, liebevolle Auswahl, ideal für eine unkomplizierte Geste.'
  };

  return mapping[product.id] || 'Ein persönlicher Geschenkkorb, passend zu deiner Auswahl.';
}

function renderResult() {
  const container = document.getElementById('finder-content');
  if (!container || !state.selectedProduct) return;

  const product = state.selectedProduct;
  const priceText = formatPrice(product.price);

  container.innerHTML = `
    <div class="result-box">
      <div>
        <p class="eyebrow">Unser Vorschlag für dich</p>
      </div>

      <div class="result-visual">${product.mainImage}</div>

      <div class="result-head">
        <div>
          <h3>${product.name}</h3>
          <p>${makePersonalizedText(product)}</p>
        </div>
        <span class="result-price">${priceText}</span>
      </div>

      <div class="product-contents">
        <h4>Das ist drin</h4>
        <ul>
          ${product.contents.map((item) => `<li>✓ ${item}</li>`).join('')}
        </ul>
      </div>

      <div class="order-controls">
        <div>
          <p class="eyebrow">Wie viele möchtest du?</p>
        </div>
        <div class="quantity-control" aria-label="Mengensteuerung">
          <button type="button" data-action="decrease" aria-label="Menge verringern">−</button>
          <span data-qty-display>${state.quantity}</span>
          <button type="button" data-action="increase" aria-label="Menge erhöhen">+</button>
        </div>
      </div>

      <div class="order-selects">
        <div class="field">
          <label for="pickup-date">Wann möchtest du deine Bestellung abholen?</label>
          <input id="pickup-date" type="date" min="${getTodayISO()}" value="${state.pickupDate || ''}" />
        </div>

        <div class="field">
          <label>Um welche Uhrzeit möchtest du deine Bestellung abholen?</label>
          <div class="time-buttons">
            ${deliveryTimes.map((time) => `
              <button type="button" class="time-btn ${state.pickupTime === time ? 'is-selected' : ''}" data-time="${time}">${time}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-meta">
          <strong>${product.name}</strong>
          <strong>${priceText} × ${state.quantity}</strong>
        </div>
        <div class="summary-row">
          <span>Abholung</span>
          <span>${state.pickupDate ? formatDateForDisplay(state.pickupDate) : 'Bitte wählen'}</span>
        </div>
        <div class="summary-row">
          <span>Uhrzeit</span>
          <span>${state.pickupTime || 'Bitte wählen'}</span>
        </div>
      </div>

      <div class="whatsapp-row">
        <div class="whatsapp-message">WhatsApp öffnet sich mit einer vorbereiteten Nachricht. Du kannst sie vor dem Senden noch ändern.</div>
        <button type="button" id="order-whatsapp" class="btn btn-primary">Per WhatsApp bestellen</button>
        <div id="validation-message" class="alert" aria-live="polite"></div>
      </div>
    </div>
  `;

  bindResultInteractions();
}

function bindResultInteractions() {
  const increaseBtn = document.querySelector('[data-action="increase"]');
  const decreaseBtn = document.querySelector('[data-action="decrease"]');

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      state.quantity += 1;
      updateQuantityDisplay();
      refreshSummary();
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      state.quantity = Math.max(1, state.quantity - 1);
      updateQuantityDisplay();
      refreshSummary();
    });
  }

  const dateInput = document.getElementById('pickup-date');
  if (dateInput) {
    dateInput.addEventListener('change', (event) => {
      state.pickupDate = event.target.value;
      refreshSummary();
    });
  }

  document.querySelectorAll('.time-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.pickupTime = button.dataset.time;
      document.querySelectorAll('.time-btn').forEach((timeBtn) => {
        timeBtn.classList.toggle('is-selected', timeBtn === button);
      });
      refreshSummary();
    });
  });

  const waButton = document.getElementById('order-whatsapp');
  if (waButton) {
    waButton.addEventListener('click', () => {
      const messages = validateOrder();
      if (messages.length > 0) {
        const alertEl = document.getElementById('validation-message');
        if (alertEl) {
          alertEl.textContent = messages[0];
        }
        return;
      }

      const product = state.selectedProduct;
      const message = `Hallo Biottos Lädeli 👋\n\nIch möchte gerne folgenden Geschenkkorb bestellen:\n\n🎁 ${product.name}\n💰 ${formatPrice(product.price)}\n🔢 Anzahl: ${state.quantity}\n\n📅 Abholung: ${formatDateForDisplay(state.pickupDate)}\n🕒 Uhrzeit: ${state.pickupTime}\n\nIch habe den Geschenkkorb über euren Geschenk-Finder gefunden.\n\nVielen Dank!`;

      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/41762552256?text=${encoded}`;
      window.open(url, '_blank');
    });
  }
}

function updateQuantityDisplay() {
  const qty = document.querySelector('[data-qty-display]');
  if (qty) {
    qty.textContent = state.quantity;
  }
}

function refreshSummary() {
  const card = document.querySelector('.summary-card');
  if (!card || !state.selectedProduct) return;

  const product = state.selectedProduct;
  const dateText = state.pickupDate ? formatDateForDisplay(state.pickupDate) : 'Bitte wählen';
  const timeText = state.pickupTime || 'Bitte wählen';

  card.innerHTML = `
    <div class="summary-meta">
      <strong>${product.name}</strong>
      <strong>${formatPrice(product.price)} × ${state.quantity}</strong>
    </div>
    <div class="summary-row">
      <span>Abholung</span>
      <span>${dateText}</span>
    </div>
    <div class="summary-row">
      <span>Uhrzeit</span>
      <span>${timeText}</span>
    </div>
  `;
}

function getTodayISO() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const local = new Date(today.getTime() - offset * 60000);
  return local.toISOString().split('T')[0];
}

function formatDateForDisplay(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('de-CH').format(date);
}

function validateOrder() {
  const messages = [];

  if (!state.selectedProduct) {
    messages.push('Bitte wähle einen Geschenkkorb aus.');
  }

  if (state.quantity < 1) {
    messages.push('Bitte wähle eine gültige Anzahl.');
  }

  if (!state.pickupDate) {
    messages.push('Bitte wähle noch dein Abholdatum aus.');
  }

  if (!state.pickupTime) {
    messages.push('Bitte wähle noch deine Abholzeit aus.');
  }

  return messages;
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');

  if (!toggle || !menu || !backdrop) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    backdrop.classList.toggle('is-visible', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  backdrop.addEventListener('click', () => {
    menu.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function init() {
  renderProductCards();
  renderFinder();
  initMobileMenu();
}

init();
