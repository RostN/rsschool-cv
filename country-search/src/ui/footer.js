import { createElement } from './dom.js';
export function createFooter() {
  const footer = document.createElement('footer');
  // Ссылка на GitHub с SVG-иконкой
  const githubLink = createElement('a', 'svgText');
  githubLink.href = 'https://github.com/RostN';
  githubLink.target = '_blank';
  githubLink.rel = 'noopener noreferrer';
  const svgNS = 'http://w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'svgImg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute(
    'd',
    'M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.401-2.336 1.073-3.144-.291-.723-.251-2.297.08-2.95.882-.102 2.075.352 2.786.993.842-.262 1.724-.393 2.817-.393 1.093 0 1.975.131 2.777.383.692-.631 1.905-1.085 2.787-.983.321.612.361 2.186.07 2.94.712.853 1.083 1.996 1.083 3.154 0 2.763-2.085 4.866-5.093 5.246.762.492 1.283 1.565 1.283 2.848v2.377c0 .682.561 1.063 1.243.782C19.602 21.848 22 18.238 22 14c0-5.523-4.477-10-10-10S2 8.477 2 14c0 4.242 2.402 7.855 5.915 9.286.622.261 1.233-.15 1.233-.772v-1.835c-.321.14-.722.231-1.083.231-1.484 0-2.356-.802-2.987-2.307-.251-.602-.521-.963-1.043-1.033-.271-.03-.361-.14-.361-.281 0-.281.461-.492.922-.492.672 0 1.253.401 1.855 1.254.461.652.942.953 1.514.953.571 0 .932-.211 1.464-.742.401-.401.702-.752.992-1.003Z'
  );
  svg.append(path);
  const githubText = createElement('span', undefined, 'My GitHub');
  githubLink.append(svg, githubText);
  // Год
  const year = createElement('p', undefined, '2026');
  // Ссылка на RS School
  const rsLink = createElement('a', 'svgText');
  rsLink.href = 'https://rs.school/courses/javascript-preschool-ru';
  rsLink.target = '_blank';
  rsLink.rel = 'noopener noreferrer';
  const rsImg = createElement('img');
  rsImg.src = 'https://rostn.github.io/rsschool-cv/img/rs_school_js.svg';
  rsImg.alt = 'RS School';
  rsImg.width = 64;
  rsLink.append(rsImg);
  footer.append(githubLink, year, rsLink);
  return footer;
}
