import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { photos, photoAlt, photoSrc, toRoman } from "./photos";
import Lightbox from "./Lightbox";
import { lockScroll, scrollToTop } from "../../lib/scroll";
import { DAMASK } from "../../lib/textures";
import { SITE } from "../../config";

const INITIAL_LOAD = 12;
const LOAD_MORE_COUNT = 12;
const EAGER_LOAD_COUNT = 4;
const READY_THRESHOLD = 2;

// Salon hang: every 7th work gets a large frame (on wide screens).
const isFeatured = (index) => index % 7 === 0;

// A few frame styles so the wall doesn't look machine-made.
function frameStyle(index) {
  switch (index % 5) {
    case 2: // gilded: thick gold-leaf moulding
      return {
        outer: "p-[9px] bg-[linear-gradient(135deg,#7a5c1e_0%,#d4af37_28%,#f3dc8a_45%,#b08a2e_62%,#6b4f17_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.55)]",
        inner: "border border-[#2a2116] shadow-[inset_0_0_0_3px_#1c1917]",
      };
    case 4: // ebony: dark wood with a fine gold fillet
      return {
        outer: "p-[8px] bg-[#120e0b] border border-[#3a2e22] shadow-[0_10px_30px_rgba(0,0,0,0.6)]",
        inner: "border border-gilt/60",
      };
    default: // classic: thin gilt double line (the original look)
      return {
        outer: "p-[6px] bg-umber border border-gilt/40 hover:border-gilt shadow-sm",
        inner: "border border-gilt/20",
      };
  }
}

function Frame({ photo, index, onOpen, onLoaded }) {
  const [developed, setDeveloped] = useState(false);
  const { outer, inner } = frameStyle(index);
  const featured = isFeatured(index);

  const handleLoad = () => {
    setDeveloped(true);
    onLoaded();
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`relative group w-full select-none text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gilt ${
        featured ? "aspect-4/5 lg:aspect-auto lg:h-full lg:col-span-2 lg:row-span-2" : "aspect-4/5"
      }`}
      aria-label={`Open ${photoAlt(photo, index)}`}
    >
      {/* Picture light: brass lamp + its glow on the wall above the frame */}
      <span
        aria-hidden="true"
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-4/5 h-12 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(255,214,150,0.13),transparent_70%)] opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500"
      />
      <span
        aria-hidden="true"
        className="absolute -top-[7px] left-1/2 -translate-x-1/2 z-20 w-1/3 max-w-[120px] h-[6px] rounded-full pointer-events-none bg-[linear-gradient(180deg,#f3dc8a,#b08a2e_60%,#6b4f17)] shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
      />

      <motion.div
        layoutId={`photo-${photo.file}`}
        // Absolutely positioned so only the button's aspect ratio (not the image) sizes the grid rows.
        className={`absolute inset-0 overflow-hidden transition-colors duration-500 ${outer}`}
      >
        {/* Matting / inner border */}
        <div className={`w-full h-full relative overflow-hidden bg-[#0f0c0a] ${inner}`}>
          <img
            src={photoSrc(photo)}
            alt={photoAlt(photo, index)}
            width={photo.w}
            height={photo.h}
            loading={index < EAGER_LOAD_COUNT ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleLoad}
            draggable={false}
            // Darkroom reveal: the print "develops" from an over-exposed sepia blank.
            style={{
              opacity: developed ? 1 : 0,
              filter: developed
                ? "sepia(0) brightness(1)"
                : "sepia(1) brightness(1.6)",
              transition:
                "opacity 1s ease-out, filter 1.6s ease-out",
            }}
            className="w-full h-full object-cover motion-reduce:transition-none!"
          />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />

          {/* Light pool from the picture lamp — brightens on hover */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(255,214,150,0.2),transparent_75%)] opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Roman numeral plaque (reveals the title on hover, when one is set) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-umber/95 px-3 py-1 border border-gilt/50">
            <span className="flex items-center whitespace-nowrap font-primary text-gilt text-xs tracking-[0.2em]">
              {toRoman(index + 1)}
              {photo.title && (
                <span className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] transition-[grid-template-columns] duration-500">
                  <span className="overflow-hidden italic tracking-[0.08em]">&nbsp;— {photo.title}</span>
                </span>
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </button>
  );
}

function photoIndexFromHash() {
  const m = window.location.hash.match(/^#gallery\/(\d+)$/);
  if (!m) return null;
  const i = Number(m[1]) - 1;
  return i >= 0 && i < photos.length ? i : null;
}

function Gallery({ visible, onBack, onImagesLoaded }) {
  const [count, setCount] = useState(INITIAL_LOAD);
  const [lightbox, setLightbox] = useState({ index: null, origin: null, direction: 0 });
  const observerTarget = useRef(null);
  const loadedCountRef = useRef(0);
  const readyNotifiedRef = useRef(false);

  const displayed = photos.slice(0, count);

  // Tell AppLayout once the first couple of prints are ready.
  const notifyReady = useCallback(() => {
    if (readyNotifiedRef.current) return;
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= Math.min(READY_THRESHOLD, photos.length)) {
      readyNotifiedRef.current = true;
      onImagesLoaded?.();
    }
  }, [onImagesLoaded]);

  // Infinite loading
  useEffect(() => {
    const node = observerTarget.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setCount((c) => Math.min(c + LOAD_MORE_COUNT, photos.length));
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) scrollToTop();
  }, [visible]);

  // ---- Lightbox (with browser-back support via #gallery/<n>) ----
  const openPhoto = useCallback((index) => {
    setLightbox({ index, origin: index, direction: 0 });
    window.history.pushState({ photo: index }, "", `#gallery/${index + 1}`);
  }, []);

  const navigatePhoto = useCallback((index) => {
    setCount((c) => Math.max(c, index + 1));
    setLightbox((lb) => ({ ...lb, index, direction: Math.sign(index - (lb.index ?? index)) }));
    window.history.replaceState({ photo: index }, "", `#gallery/${index + 1}`);
  }, []);

  const closePhoto = useCallback(() => {
    if (photoIndexFromHash() != null) window.history.back(); // popstate closes it
    else setLightbox((lb) => ({ ...lb, index: null }));
  }, []);

  useEffect(() => {
    const onPop = () => {
      const i = photoIndexFromHash();
      setLightbox((lb) => (i == null ? { ...lb, index: null } : { index: i, origin: i, direction: 0 }));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const lightboxOpen = lightbox.index != null;
  useEffect(() => {
    lockScroll(lightboxOpen);
    return () => lockScroll(false);
  }, [lightboxOpen]);

  return (
    <div
      className={`relative z-50 min-h-screen px-4 py-16 md:px-8 lg:px-12 transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Museum wall: damask wallpaper under the same warm vignette as the hero */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-umber"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(80,70,60,0.2) 0%, rgba(20,15,10,0.93) 65%), ${DAMASK}`,
        }}
      />

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-gilt/70 hover:text-gilt transition-colors group cursor-pointer"
        aria-label="Back to Home"
      >
        <span className="font-primary tracking-widest text-sm">HOME</span>
      </button>

      {/* SUBTLE BLUR AT TOP */}
      <div className="fixed top-0 left-0 right-0 h-28 bg-gradient-to-b from-umber to-transparent pointer-events-none z-40" />

      <div className="max-w-[1400px] mx-auto min-h-screen">
        {/* Exhibition title */}
        <motion.header
          className="text-center mt-10 mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <h1 className="font-primary italic text-gilt text-4xl md:text-6xl tracking-wide">
            The Collection
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3 text-gilt/50">
            <span className="h-px w-12 bg-gilt/40" />
            <span className="font-secondary text-[11px] tracking-[0.35em] uppercase">
              {toRoman(photos.length)} works
            </span>
            <span className="h-px w-12 bg-gilt/40" />
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pt-4 lg:grid-flow-dense"
        >
          {displayed.map((photo, index) => (
            <Frame
              key={photo.file}
              photo={photo}
              index={index}
              onOpen={openPhoto}
              onLoaded={notifyReady}
            />
          ))}
        </motion.div>

        {/* LOADING SENTINEL */}
        <div ref={observerTarget} className="h-20 w-full flex justify-center items-center mt-8">
          {count < photos.length && (
            <div className="w-2 h-2 bg-gilt/50 rounded-full animate-ping" />
          )}
        </div>

        {/* Closing footer, once every work is on the wall */}
        {count >= photos.length && (
          <footer className="flex flex-col items-center gap-4 pt-10 pb-32 text-center">
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-16 bg-gilt/40" />
              <span className="w-2 h-2 rotate-45 border border-gilt/70" />
              <span className="h-px w-16 bg-gilt/40" />
            </div>
            <p className="font-primary italic text-gilt text-2xl">Finis</p>
            <p className="flex items-center gap-3 font-primary text-ivory/60 text-sm tracking-[0.4em] uppercase">
              <span>{SITE.name}</span>
              <span aria-hidden="true" className="inline-block w-1 h-1 rotate-45 bg-gilt/70" />
              <span>Photography</span>
            </p>
            {SITE.instagram && (
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="font-primary text-gilt/70 hover:text-gilt text-sm tracking-[0.3em] uppercase transition-colors"
              >
                Instagram
              </a>
            )}
          </footer>
        )}
      </div>

      {/* SUBTLE BLUR AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-umber to-transparent pointer-events-none z-40" />

      <Lightbox
        photos={photos}
        index={lightbox.index}
        originIndex={lightbox.origin}
        direction={lightbox.direction}
        onClose={closePhoto}
        onNavigate={navigatePhoto}
      />
    </div>
  );
}

export default Gallery;
