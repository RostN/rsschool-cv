export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  textContent?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (textContent !== undefined) {
    el.textContent = textContent;
  }
  return el;
}

export function createInfoItem(label: string, value: string): HTMLLIElement {
  const li = document.createElement('li');
  const strong = createElement('strong', undefined, `${label}: `);
  li.append(strong, document.createTextNode(value));
  return li;
}
