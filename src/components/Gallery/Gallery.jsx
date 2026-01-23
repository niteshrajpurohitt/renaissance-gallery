import { useEffect } from "react";
import { motion } from "motion/react";
import images from "./images.json";

function Gallery({ visible }) {
  // Scroll to top when gallery becomes visible
  useEffect(() => {
    if (visible) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="relative z-50 min-h-screen bg-[#0f0c0a] px-4 py-12 md:px-12 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
      <div className="max-w-[1920px] mx-auto">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8"
        >
            {images.map((image, index) => (
            <motion.div
                key={image}
                className="break-inside-avoid relative group inline-block w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: Math.min(index * 0.1, 1), ease: "easeOut" }}
            >
                {/* FRAME CONTAINER */}
                <div className="bg-[#e8e6e3] p-2 md:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    {/* INNER BORDER (Matte edge) */}
                    <div className="border border-[#d4d4d4]">
                        <img
                            src={`/gallery/${image}`}
                            alt={`Gallery ${index + 1}`}
                            loading="lazy"
                            className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </div>
            </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Gallery;
