import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import images from "./images.json";

const INITIAL_LOAD = 12;
const LOAD_MORE_COUNT = 12;

function Gallery({ visible, onBack, onImagesLoaded }) {
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const observerTarget = useRef(null);

  // Initialize gallery
  useEffect(() => {
    setDisplayedImages(images.slice(0, INITIAL_LOAD));
  }, []);

  // Check if enough images are loaded to show
  useEffect(() => {
      // If we have loaded at least 8 images (or all if less than 8), signal ready
      const threshold = Math.min(8, displayedImages.length); 
      if (loadedCount >= threshold && displayedImages.length > 0) {
          onImagesLoaded?.();
      }
  }, [loadedCount, displayedImages.length, onImagesLoaded]);

  const handleImageLoad = () => {
    setLoadedCount(prev => prev + 1);
  };

  // Scroll to top when gallery becomes visible
  useEffect(() => {
    if (visible) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [visible]);

  // Infinite Scroll Observer
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting) {
        setDisplayedImages((prev) => {
            if (prev.length >= images.length) return prev;
            return images.slice(0, prev.length + LOAD_MORE_COUNT);
        });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    if (observerTarget.current) observer.observe(observerTarget.current);
    
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [handleObserver, displayedImages.length]);


  return (
    <div 
        className={`relative z-50 min-h-screen px-4 py-16 md:px-8 lg:px-12 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      
      <div className="fixed inset-0 bg-[#1c1917] bg-[radial-gradient(circle_at_center,rgba(80,70,60,0.2)_0%,rgba(20,15,10,0.95)_60%)] -z-10 pointer-events-none"></div>

      {/* BACK BUTTON */}
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[#d4af37]/70 hover:text-[#d4af37] transition-colors group cursor-pointer"
        aria-label="Back to Home"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-serif tracking-widest text-sm">HOME</span>
      </button>

      {/* SUBTLE BLUR AT TOP */}
      <div className="fixed top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#1c1917] to-transparent pointer-events-none z-40"></div>
      
      <div className="max-w-[1400px] mx-auto min-h-screen">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 [counter-reset:gallery]"
        >
            {displayedImages.map((image, index) => (
                <motion.div
                    key={`${image}-${index}`}
                    className="relative group w-full aspect-4/5 select-none [counter-increment:gallery]" 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Golden Frame Container */}
                    <div className="w-full h-full p-[6px] bg-[#1c1917] border border-[#d4af37]/40 shadow-sm relative overflow-hidden transition-colors duration-500 hover:border-[#d4af37]">
                        
                        {/* Matting/Inner Border */}
                        <div className="w-full h-full relative overflow-hidden border border-[#d4af37]/20">
                            <img
                                src={`/gallery/${image}`}
                                alt={`Gallery ${index + 1}`}
                                loading="eager" 
                                decoding="async"
                                onLoad={handleImageLoad}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {/* Vignette Overlay (Subtle) */}
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.2)_100%)]"></div>
                        </div>

                        {/* Roman Numeral Plaque */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-[#1c1917]/90 px-3 py-1 border border-[#d4af37]/50 backdrop-blur-sm">
                                <span className="font-serif text-[#d4af37] text-xs tracking-[0.2em] font-light after:content-[counter(gallery,upper-roman)]">
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>

        {/* LOADING SENTINEL */}
        <div ref={observerTarget} className="h-20 w-full flex justify-center items-center mt-8">
             {displayedImages.length < images.length && (
                 <div className="w-2 h-2 bg-amber-500/50 rounded-full animate-ping"></div>
             )}
        </div>

      </div>
      
      {/* SUBTLE BLUR AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#1c1917] to-transparent pointer-events-none z-40"></div>
    </div>
  );
}

export default Gallery;
