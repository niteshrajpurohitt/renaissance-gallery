// Static, tiling background textures (rendered once by the browser, then cached).

const svg = (markup) => `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;

// Damask wallpaper for the gallery: a trellis with a four-petal flower.
export const DAMASK = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <g fill="none" stroke="#d4af37" stroke-opacity="0.07" stroke-width="1">
    <path d="M48 0 L96 64 L48 128 L0 64 Z"/>
    <path d="M48 46 C55 53 55 60 48 64 C41 60 41 53 48 46 Z"/>
    <path d="M48 82 C41 75 41 68 48 64 C55 68 55 75 48 82 Z"/>
    <path d="M30 64 C37 57 44 57 48 64 C44 71 37 71 30 64 Z"/>
    <path d="M66 64 C59 71 52 71 48 64 C52 57 59 57 66 64 Z"/>
    <circle cx="48" cy="64" r="2"/>
    <circle cx="0" cy="0" r="3"/><circle cx="96" cy="0" r="3"/>
    <circle cx="0" cy="128" r="3"/><circle cx="96" cy="128" r="3"/>
  </g>
</svg>`);
