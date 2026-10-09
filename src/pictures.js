// A clipped SVG viewport displays either one local picture or one atlas cell.
// The viewport keeps pictures square at any responsive width/height, including
// the short, wide answer cards used in landscape mode.
export function wordPicture(word, label = "") {
  const { size = 1, bounds = [0, 0, 1, 1] } = word.sprite ?? {};
  const [x, y, width, height] = bounds;
  return `<svg class="word-picture" data-word="${word.id}" viewBox="${bounds.join(" ")}" width="160" height="160" focusable="false" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>
    <defs><clipPath id="picture-${word.id}" clipPathUnits="userSpaceOnUse"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs>
    <g clip-path="url(#picture-${word.id})"><image href="${word.image}" width="${size}" height="${size}"/></g>
  </svg>`;
}
