import { useEffect } from "react";
import { motion } from "motion/react";
import images from "./images.json";

function Gallery({ visible, onBack }) {
  // Scroll to top when gallery becomes visible
  useEffect(() => {
    if (visible) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [visible]);



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
      
      <div className="max-w-[1400px] mx-auto">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
            {images.map((image, index) => (
                <motion.div
                    key={image}
                    className="break-inside-avoid relative group w-full"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: index < 12 ? index * 0.1 : 0 }}
                >
                    <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 group-hover:shadow-2xl">
                        <img
                            src={`/gallery/${image}`}
                            alt={`Gallery ${index + 1}`}
                            loading="lazy"
                            className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </motion.div>
            ))}
        </motion.div>
      </div>
      
      {/* SUBTLE BLUR AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#1c1917] to-transparent pointer-events-none z-40"></div>
    </div>
  );
}

export default Gallery;
