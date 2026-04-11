// i18n.js — Lightweight internationalization for StrongBuilt
const I18N = {
  currentLang: 'en',
  translations: {},
  langLabels: { en: 'EN', hi: 'हिंदी', mr: 'मराठी' },

  async init() {
    const saved = localStorage.getItem('sb-lang');
    if (saved && ['en', 'hi', 'mr'].includes(saved)) this.currentLang = saved;
    await this.loadLanguage(this.currentLang);
    if (this.currentLang !== 'en') await this.loadLanguage('en'); // fallback
    this.apply();
    this.updateSelector();
  },

  async loadLanguage(lang) {
    if (this.translations[lang]) return;
    try {
      const r = await fetch('lang/' + lang + '.json');
      if (r.ok) this.translations[lang] = await r.json();
    } catch (e) {
      console.warn('i18n: Could not load ' + lang, e);
    }
  },

  async switchTo(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem('sb-lang', lang);
    await this.loadLanguage(lang);
    this.apply();
    this.updateSelector();
    document.documentElement.lang = lang;
  },

  t(key) {
    const tr = this.translations[this.currentLang];
    if (tr && tr[key]) return tr[key];
    const en = this.translations['en'];
    if (en && en[key]) return en[key];
    return key;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, val);
      } else {
        el.textContent = val;
      }
    });
  },

  updateSelector() {
    const label = document.getElementById('currentLangLabel');
    if (label) label.textContent = this.langLabels[this.currentLang];
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const isActive = btn.dataset.lang === this.currentLang;
      btn.classList.toggle('text-brand-gold', isActive);
      btn.classList.toggle('border-brand-gold', isActive);
      btn.classList.toggle('text-gray-400', !isActive);
      btn.classList.toggle('border-transparent', !isActive);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => I18N.init());
