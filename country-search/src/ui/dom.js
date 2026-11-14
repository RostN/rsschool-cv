export function createElement(tag, className, textContent) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (textContent !== undefined) {
    el.textContent = textContent;
  }
  return el;
}
export function createInfoItem(label, value) {
  const li = document.createElement('li');
  const strong = createElement('strong', undefined, `${label}: `);
  li.append(strong, document.createTextNode(value));
  return li;
}
