const menuToggle = document.querySelector('.menu-toggle');
const quickMenu = document.querySelector('.quick-menu');

if (menuToggle && quickMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    quickMenu.hidden = isOpen;
  });

  quickMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      quickMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (!quickMenu.hidden && !quickMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      quickMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      quickMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const configForm = document.querySelector('#config-form');
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
