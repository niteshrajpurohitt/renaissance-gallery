# Renaissance Gallery

*When I'm not coding, I'm clicking photos. I wanted a cool place to show them off, so I made this. It's my digital gallery inspired by the Renaissance period and vintage cameras.*

## 🛠️ Tech Stack
**React 19, Vite, TailwindCSS (v4), Framer Motion, Three.js, React Three Fiber**

## 🎨 Inspirations

- **Hand Loader**: Michelangelo's *The Creation of Adam* — the spark of creation.
- **"I See, Therefore I Am"**: A nod to René Descartes.
- **Vitruvian Shapes**: Geometric animations in hero section based on Da Vinci's studies of proportion.
- **Camera**: Interactive 3D vintage model.
- **Hero Section Portrait**: Textured self-portrait style inspired by Van Gogh.
- **Orbital Loader**: An homage to Galileo's study of celestial mechanics.
- **The Gallery**: Golden frames and Roman numerals reminiscent of classical art exhibitions.




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
1.  Place your optimized images (recommended: ~1080px wide, <300KB) in the `public/gallery` folder.
2.  Update `src/components/Gallery/images.json` with the new filenames.
3.  The gallery will automatically grid and paginate them.
4.  Replace the file at `src/assets/images/profile.webp` with your own portrait (keep the same name or update the import in `Hero.jsx`).
