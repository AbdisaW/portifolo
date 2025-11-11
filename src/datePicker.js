class DatePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.classList.add('date-picker');

    // Create dropdowns
    const yearSelect = document.createElement('select');
    const monthSelect = document.createElement('select');
    const daySelect = document.createElement('select');

    // --- Year options: current year → +5 years ---
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y <= currentYear + 5; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }

    // --- Month options (1–12) ---
    for (let m = 1; m <= 12; m++) {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = new Date(0, m - 1).toLocaleString('default', { month: 'short' });
      monthSelect.appendChild(opt);
    }

    // --- Update days based on month/year ---
    const updateDays = () => {
      daySelect.innerHTML = '';
      const year = parseInt(yearSelect.value);
      const month = parseInt(monthSelect.value);
      const daysInMonth = new Date(year, month, 0).getDate();

      for (let d = 1; d <= daysInMonth; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        daySelect.appendChild(opt);
      }
    };

    // Listen for changes
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);

    // Initialize day dropdown
    updateDays();

    // Store references
    this.yearSelect = yearSelect;
    this.monthSelect = monthSelect;
    this.daySelect = daySelect;

    // Style (inside Shadow DOM)
    const style = document.createElement('style');
    style.textContent = `
      .date-picker {
        display: flex;
        gap: 0.5rem;
        font-family: sans-serif;
      }
      select {
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }
    `;

    wrapper.append(style, yearSelect, monthSelect, daySelect);
    this.shadowRoot.append(wrapper);
  }

  // --- Getters / Setters ---
  get value() {
    const y = this.yearSelect.value;
    const m = this.monthSelect.value.padStart(2, '0');
    const d = this.daySelect.value.padStart(2, '0');
    return `${y}-${m}-${d}`; // Format: YYYY-MM-DD
  }

  set value(dateString) {
    const [y, m, d] = dateString.split('-').map(Number);
    if (y && m && d) {
      this.yearSelect.value = y;
      this.monthSelect.value = m;
      this.daySelect.value = d;
    }
  }

  // --- Pre-select year from outside (like modal pre-fill) ---
  selectYear(year) {
    this.yearSelect.value = year;
    this.yearSelect.dispatchEvent(new Event('change'));
  }
}

customElements.define('date-picker', DatePicker);
