import { createElement, createInfoItem } from './dom.js';
import { CountryModal } from './countryModal.js';
import { createFooter } from './footer.js';
export class AppView {
  handlers;
  searchInput;
  historyBar;
  loadingBox;
  emptyBox;
  errorBox;
  errorDesc;
  resultsGrid;
  modal;
  constructor(root, handlers) {
    this.handlers = handlers;
    const main = createElement('main', 'container');
    // Header
    const header = createElement('header', 'header');
    const title = createElement('h1', 'title', 'Country Search');
    const subtitle = createElement(
      'p',
      'subtitle',
      'Поиск информации о странах в реальном времени'
    );
    header.append(title, subtitle);
    // Search section
    const searchSection = createElement('section', 'search-section');
    const searchBox = createElement('div', 'search-box');
    this.searchInput = createElement('input', 'search-input');
    this.searchInput.type = 'search';
    this.searchInput.id = 'search-input';
    this.searchInput.placeholder =
      'Введите название страны (например, Spain, Japan)...';
    this.searchInput.autocomplete = 'off';
    this.searchInput.setAttribute('aria-label', 'Поиск страны');
    this.searchInput.addEventListener('input', () => {
      this.handlers.onSearchInput(this.searchInput.value);
    });
    searchBox.append(this.searchInput);
    this.historyBar = createElement('div', 'history-bar hidden');
    searchSection.append(searchBox, this.historyBar);
    // Loading state
    this.loadingBox = createElement(
      'section',
      'status-box status-loading hidden'
    );
    const spinner = createElement('div', 'spinner');
    const loadingText = createElement(
      'p',
      undefined,
      'Загружаем данные о странах...'
    );
    this.loadingBox.append(spinner, loadingText);
    // Empty (404) state
    this.emptyBox = createElement('section', 'status-box status-empty hidden');
    const emptyTitle = createElement('p', 'status-title', 'Ничего не найдено');
    const emptyDesc = createElement(
      'p',
      'status-desc',
      'Попробуйте изменить запрос или проверить написание на английском.'
    );
    this.emptyBox.append(emptyTitle, emptyDesc);
    // Error state
    this.errorBox = createElement('section', 'status-box status-error hidden');
    const errorTitle = createElement(
      'p',
      'status-title',
      'Не удалось загрузить данные'
    );
    this.errorDesc = createElement('p', 'status-desc');
    const retryBtn = createElement('button', 'btn-retry', 'Повторить');
    retryBtn.type = 'button';
    retryBtn.addEventListener('click', () => this.handlers.onRetry());
    this.errorBox.append(errorTitle, this.errorDesc, retryBtn);
    // Results grid
    this.resultsGrid = createElement('section', 'results-grid');
    // Modal
    this.modal = new CountryModal();
    main.append(
      header,
      searchSection,
      this.loadingBox,
      this.emptyBox,
      this.errorBox,
      this.resultsGrid,
      this.modal.getElement()
    );
    const footer = createFooter();
    root.replaceChildren(main, footer);
  }
  setInputValue(value) {
    this.searchInput.value = value;
  }
  render(state) {
    this.renderHistory(state.history);
    this.loadingBox.classList.toggle('hidden', state.status !== 'loading');
    this.emptyBox.classList.toggle('hidden', state.status !== 'empty');
    this.errorBox.classList.toggle('hidden', state.status !== 'error');
    if (state.status === 'error') {
      this.errorDesc.textContent = state.errorMessage;
    }
    if (state.status === 'success') {
      this.renderCards(state.results);
    } else {
      this.resultsGrid.replaceChildren();
    }
  }
  renderHistory(history) {
    if (history.length === 0) {
      this.historyBar.classList.add('hidden');
      this.historyBar.replaceChildren();
      return;
    }
    const label = createElement('span', 'history-label', 'Недавние:');
    const chips = history.map((item) => {
      const chip = createElement('button', 'history-chip', item);
      chip.type = 'button';
      chip.addEventListener('click', () => {
        this.handlers.onHistorySelect(item);
      });
      return chip;
    });
    this.historyBar.replaceChildren(label, ...chips);
    this.historyBar.classList.remove('hidden');
  }
  renderCards(countries) {
    const cards = countries.map((country) => this.createCountryCard(country));
    this.resultsGrid.replaceChildren(...cards);
  }
  createCountryCard(country) {
    const article = createElement('article', 'country-card');
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Подробнее о стране ${country.name}`);
    const openDetails = () => this.modal.open(country);
    article.addEventListener('click', openDetails);
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetails();
      }
    });
    if (country.flag) {
      const img = createElement('img', 'card-flag');
      img.src = country.flag;
      img.alt = `Флаг: ${country.name}`;
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        img.remove();
      });
      article.append(img);
    }
    const body = createElement('div', 'card-body');
    const title = createElement('h2', 'card-title', country.name);
    const infoList = createElement('ul', 'card-info');
    infoList.append(
      createInfoItem('Столица', country.capital),
      createInfoItem('Регион', country.region),
      createInfoItem('Население', country.population.toLocaleString('ru-RU'))
    );
    body.append(title, infoList);
    article.append(body);
    return article;
  }
}
