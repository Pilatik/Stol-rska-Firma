const menuToggle = document.querySelector('.menu-toggle');
const quickMenu = document.querySelector('.quick-menu');
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('#site-search');
const searchClose = document.querySelector('.search-close');

function closeSearchPanel(restoreFocus = false) {
  if (!searchPanel) return;

  searchPanel.hidden = true;
  searchToggle?.setAttribute('aria-expanded', 'false');
  if (restoreFocus) searchToggle?.focus();
}

function navigateToSearchDestination(destination) {
  closeSearchPanel();
  const url = new URL(destination, window.location.href);

  if (url.origin === window.location.origin && url.pathname === window.location.pathname) {
    const target = document.getElementById(url.hash.slice(1));
    if (target) {
      if (window.location.hash !== url.hash) window.location.hash = url.hash;
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }

  window.location.href = url.href;
}

if (menuToggle && quickMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    quickMenu.hidden = isOpen;
    if (!isOpen && searchPanel) {
      searchPanel.hidden = true;
      searchToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  quickMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      quickMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (searchToggle && searchPanel && searchInput) {
  searchToggle.addEventListener('click', () => {
    const isOpen = searchToggle.getAttribute('aria-expanded') === 'true';
    searchToggle.setAttribute('aria-expanded', String(!isOpen));
    searchPanel.hidden = isOpen;
    if (!isOpen) {
      quickMenu && (quickMenu.hidden = true);
      menuToggle?.setAttribute('aria-expanded', 'false');
      searchInput.focus();
    }
  });

  searchClose?.addEventListener('click', () => {
    closeSearchPanel(true);
  });

  searchPanel.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || !searchPanel.contains(link)) return;
    closeSearchPanel();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    navigateToSearchDestination(link.href);
  });

  searchPanel.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value
      .trim()
      .toLocaleLowerCase('sk')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (!query) return;

    const destinations = [
      { terms: ['faq', 'otazk', 'trva', 'vyrob', 'spotrebic', 'region'], url: 'kontakt.html#faq' },
      { terms: ['adresa', 'dieln', 'zilin', 'zameran', 'majster'], url: 'kontakt.html#dielna' },
      { terms: ['kontakt', 'telefon', 'cislo', 'email', 'pilatik'], url: 'kontakt.html#dizajner' },
      { terms: ['material', 'drev', 'dub', 'dyh', 'dosk'], url: 'konfigurator.html#materialy' },
      { terms: ['cena', 'kalkulack', 'vypocet', 'konfigurator', 'rozmer'], url: 'konfigurator.html#kalkulacka' },
      { terms: ['ostrovcek', 'galeri', 'fotk', 'kuchyn', 'realizaci'], url: 'galeria.html#realizacie' },
      { terms: ['spoluprac', 'postup', 'ako to funguje', 'montaz'], url: 'index.html#spolupraca' },
      { terms: ['recenzi', 'skusen', 'hodnoten'], url: 'recenzie.html#hodnotenia' },
    ];
    const match = destinations.find(({ terms }) => terms.some((term) => query.includes(term)));
    navigateToSearchDestination(match?.url ?? 'konfigurator.html#kalkulacka');
  });
}

document.addEventListener('click', (event) => {
  if (quickMenu && !quickMenu.hidden && !quickMenu.contains(event.target) && !menuToggle?.contains(event.target)) {
    quickMenu.hidden = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
  if (searchPanel && !searchPanel.hidden && !searchPanel.contains(event.target) && !searchToggle?.contains(event.target)) {
    searchPanel.hidden = true;
    searchToggle?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const searchWasOpen = searchPanel && !searchPanel.hidden;
    const menuWasOpen = quickMenu && !quickMenu.hidden;
    if (quickMenu) quickMenu.hidden = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (searchPanel) searchPanel.hidden = true;
    searchToggle?.setAttribute('aria-expanded', 'false');
    if (searchWasOpen) searchToggle?.focus();
    else if (menuWasOpen) menuToggle?.focus();
  }
});

const processGrid = document.querySelector('.process-grid');
if (processGrid) {
  processGrid.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const summary = event.target.closest('.process-step > summary');
    const currentStep = summary?.parentElement;
    if (!(currentStep instanceof HTMLDetailsElement) || currentStep.open) return;

    processGrid.querySelectorAll('details[open]').forEach((step) => {
      if (step !== currentStep) step.open = false;
    });
  });
}

const galleryGrid = document.querySelector('.gallery-grid');
const galleryLightbox = document.querySelector('#gallery-lightbox');

if (galleryGrid && galleryLightbox) {
  const photoButtons = [...galleryGrid.querySelectorAll('.gallery-photo-button')];
  const lightboxImage = galleryLightbox.querySelector('.lightbox-image');
  const lightboxTitle = galleryLightbox.querySelector('#lightbox-title');
  const lightboxDescription = galleryLightbox.querySelector('.lightbox-description');
  const closeButton = galleryLightbox.querySelector('.lightbox-close');
  const previousButton = galleryLightbox.querySelector('.lightbox-previous');
  const nextButton = galleryLightbox.querySelector('.lightbox-next');
  let activeIndex = 0;
  let activeTrigger;

  function showPhoto(index) {
    activeIndex = (index + photoButtons.length) % photoButtons.length;
    const trigger = photoButtons[activeIndex];
    const image = trigger.querySelector('img');
    const item = trigger.closest('.gallery-item');
    if (!image || !item || !lightboxImage || !lightboxTitle || !lightboxDescription) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = item.querySelector('h2')?.textContent.trim() ?? image.alt;
    lightboxDescription.textContent = item.querySelector('p')?.textContent.trim() ?? '';
  }

  photoButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      activeTrigger = button;
      showPhoto(index);
      galleryLightbox.showModal();
    });
  });

  closeButton?.addEventListener('click', () => galleryLightbox.close());
  previousButton?.addEventListener('click', () => showPhoto(activeIndex - 1));
  nextButton?.addEventListener('click', () => showPhoto(activeIndex + 1));

  galleryLightbox.addEventListener('click', (event) => {
    if (event.target === galleryLightbox) galleryLightbox.close();
  });

  galleryLightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activeIndex + 1);
    }
  });

  galleryLightbox.addEventListener('close', () => activeTrigger?.focus());
}

const configForm = document.querySelector('#kalkulacka');
const priceOutput = document.querySelector('#price-output');
const lengthInput = document.querySelector('#length');
const lengthUnknown = document.querySelector('#length-unknown');
const emailDialog = document.querySelector('#email-dialog');
const currency = new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 0 });

function updatePrice() {
  if (!configForm || !priceOutput) return;

  const selects = [...configForm.querySelectorAll('select')];
  const basePrice = selects.reduce((total, select) => total + Number(select.value), 0);
  const length = lengthUnknown?.checked ? 4 : Number(lengthInput?.value);

  if (!Number.isFinite(length) || length < 2 || length > 10) {
    priceOutput.textContent = 'Zadajte dĺžku od 2 do 10 m';
    return;
  }

  const minimum = Math.round((basePrice * (length / 4)) / 50) * 50;
  const maximum = Math.round((minimum * 1.12) / 50) * 50;
  priceOutput.textContent = `${currency.format(minimum)} € – ${currency.format(maximum)} €`;
}

if (configForm && priceOutput) {
  configForm.addEventListener('input', updatePrice);
  configForm.addEventListener('change', updatePrice);
  lengthUnknown?.addEventListener('change', () => {
    if (lengthInput) lengthInput.disabled = lengthUnknown.checked;
    updatePrice();
  });
  updatePrice();

  configForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!emailDialog) return;

    const values = new FormData(configForm);
    const summary = document.querySelector('#configuration-summary');
    if (summary) {
      summary.textContent = `Odhad ceny: ${priceOutput.textContent}. Dĺžka: ${lengthUnknown?.checked ? 'štandardné 4 m' : `${lengthInput.value} m`}.`;
    }
    emailDialog.showModal();
  });
}

const emailForm = document.querySelector('#email-form');
if (emailForm) {
  emailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#email-status');
    if (status) {
      status.hidden = false;
      status.textContent = 'Ďakujeme. Dopyt je pripravený ako ukážka; v tejto verzii sa neodosiela.';
    }
  });
}

const bookingDate = document.querySelector('#booking-date');
if (bookingDate) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  bookingDate.min = today.toISOString().slice(0, 10);

  bookingDate.addEventListener('change', () => {
    if (!bookingDate.value) {
      bookingDate.setCustomValidity('');
      return;
    }

    const [year, month, day] = bookingDate.value.split('-').map(Number);
    const weekday = new Date(year, month - 1, day).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    bookingDate.setCustomValidity(isWeekend ? 'Vyberte pracovný deň (pondelok až piatok).' : '');
    if (isWeekend) bookingDate.reportValidity();
  });
}

const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#booking-status');
    const values = new FormData(bookingForm);
    if (status) {
      status.hidden = false;
      status.textContent = `Termín ${values.get('date')} o ${values.get('time')} je vybraný ako ukážka. Rezervácia sa neodosiela.`;
    }
  });
}
