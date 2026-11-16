import { createElement, createInfoItem } from './dom.js';
export class CountryModal {
  backdrop;
  content;
  constructor() {
    this.backdrop = createElement('div', 'modal-backdrop hidden');
    this.content = createElement('div', 'modal-content');
    this.backdrop.append(this.content);
    this.backdrop.addEventListener('click', (event) => {
      if (event.target === this.backdrop) {
        this.close();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        !this.backdrop.classList.contains('hidden')
      ) {
        this.close();
      }
    });
  }
  getElement() {
    return this.backdrop;
  }
  open(country) {
    this.content.replaceChildren();
    const closeBtn = createElement('button', 'modal-close', '✕');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.addEventListener('click', () => this.close());
    const header = createElement('div', 'modal-header');
    if (country.flag) {
      const flag = createElement('img', 'modal-flag');
      flag.src = country.flag;
      flag.alt = `Флаг: ${country.name}`;
      header.append(flag);
    }
    const titleWrap = createElement('div');
    const title = createElement('h2', 'modal-title', country.name);
    const subtitle = createElement('p', 'modal-subtitle', country.officialName);
    titleWrap.append(title, subtitle);
    header.append(titleWrap);
    const body = createElement('div', 'modal-body');
    if (country.description) {
      const desc = createElement('p', 'modal-description', country.description);
      body.append(desc);
    }
    const list = createElement('ul', 'modal-details');
    list.append(
      createInfoItem('Столица', country.capital),
      createInfoItem('Регион', country.region),
      createInfoItem('Население', country.population.toLocaleString('ru-RU')),
      createInfoItem(
        'Площадь',
        country.area > 0
          ? `${country.area.toLocaleString('ru-RU')} км²`
          : 'Нет данных'
      ),
      createInfoItem(
        'Языки',
        country.languages.length > 0
          ? country.languages.join(', ')
          : 'Нет данных'
      ),
      createInfoItem(
        'Валюта',
        country.currencies.length > 0
          ? country.currencies.join(', ')
          : 'Нет данных'
      ),
      createInfoItem(
        'Границы',
        country.borders.length > 0
          ? country.borders.join(', ')
          : 'Нет сухопутных границ'
      )
    );
    body.append(list);
    this.content.append(closeBtn, header, body);
    this.backdrop.classList.remove('hidden');
  }
  close() {
    this.backdrop.classList.add('hidden');
  }
}
