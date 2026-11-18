# Renaissance Gallery

*When I'm not coding, I'm clicking photos. I wanted a cool place to show them off, so I made this. It's my digital gallery inspired by the Renaissance period and vintage cameras.*

## 🛠️ Tech Stack
**React 19, TailwindCSS (v4), Motion for React, Three.js, React Three Fiber, Lenis (smooth scroll)**

## 🎨 Inspirations

- **Hand Loader**: Michelangelo's *The Creation of Adam* — the spark of creation.
- **"I See, Therefore I Am"**: A nod to René Descartes.
- **Vitruvian Shapes**: Geometric animations in hero section based on Da Vinci's studies of proportion.
- **Camera**: Interactive 3D vintage model, framed by gold viewfinder brackets through *Aim → Focus → Shoot*. Click it (or press the shutter) to enter the gallery.
- **Hero Section Portrait**: Textured self-portrait style inspired by Van Gogh.
- **Orbital Loader**: An homage to Galileo's study of celestial mechanics.
- **The Gallery**: A salon-style wall of gilded, ebony and classic frames on damask wallpaper, each lit by a brass picture lamp, with Roman numeral plaques like a classical exhibition.
- **The Lightbox**: Click any work to view it up close with its brass plaque. Use the arrow keys or swipe to browse, and Esc or the browser's Back button to close.

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/niteshrajpurohitt/renaissance-gallery.git
    cd renaissance-gallery
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📸 Make It Your Own
To add new photos to the gallery:
1.  Place your optimized images (recommended: ~1080px wide, <300KB, WebP) in the `public/gallery` folder.
2.  Run `npm run gallery`. This adds them to `src/components/Gallery/images.json` with their dimensions (existing order and metadata are kept).
3.  Optionally give any photo a plaque in `images.json`. The title shows on the frame's plaque on hover, and all details show in the lightbox:
    ```json
    { "file": "DSC04389.webp", "w": 1080, "h": 1350,
      "title": "Evening Light", "place": "Udaipur", "date": "2025",
      "settings": "f/1.8 · 1/250s · ISO 200", "alt": "Lake at dusk with a palace on the far shore" }
    ```
4.  Replace the file at `src/assets/images/profile.webp` with your own portrait (keep the same name or update the import in `Hero.jsx`).

Your name and Instagram link live in `src/config.js`:
```js
export const SITE = {
  name: "Nitesh",
  instagram: "https://instagram.com/bigbushybrows/",
};
```

### Swapping the 3D camera
If you replace `src/assets/camera.glb`, compress it first to keep the site light:
```bash
npx @gltf-transform/cli resize camera.glb camera-512.glb --width 512 --height 512
npx @gltf-transform/cli meshopt camera-512.glb src/assets/camera.glb
```
