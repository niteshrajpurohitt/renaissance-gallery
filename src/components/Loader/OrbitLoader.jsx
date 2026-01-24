import { motion } from "motion/react";

export default function OrbitLoader({ onComplete, text = "Developing Photos..." }) {
  return (
    <motion.div
      className="fixed inset-0 z-200 bg-[#1c1917] bg-[radial-gradient(circle_at_center,rgba(80,70,60,0.2)_0%,rgba(20,15,10,0.95)_60%)] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={(def) => {
         if (def.opacity === 1) {
            setTimeout(() => {
                onComplete?.();
            }, 2500); 
         }
      }}
    >
      <div className="relative flex flex-col items-center justify-center gap-12 w-full h-full">
        
        {/* ORBIT SVG SCENE */}
        <div className="relative w-48 h-48 md:w-64 md:h-64">
           <motion.svg 
              viewBox="0 0 100 100" 
              className="w-full h-full drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
           >
              {/* Central Nucleus */}
              <circle cx="50" cy="50" r="4" fill="#d4af37" />

              {/* Orbit Path 1 */}
              <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" transform="rotate(0 50 50)" />
              
              {/* Orbit Ring 1 */}
              <g transform="rotate(0 50 50)">
                 <motion.circle 
                    r="2.5" fill="#d4af37"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    style={{ offsetPath: "path('M50,5 A20,45 0 1,1 50,95 A20,45 0 1,1 50,5')" }} // Manual approximation of ellipse path
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                 />
              </g>

              {/* Orbit Ring 2 */}
              <g transform="rotate(60 50 50)">
                 <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
                 <motion.circle 
                    r="2.5" fill="#d4af37"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    style={{ offsetPath: "path('M50,5 A20,45 0 1,1 50,95 A20,45 0 1,1 50,5')" }}
                    transition={{ duration: 2.5, ease: "linear", repeat: Infinity, delay: 0.2 }}
                 />
              </g>

              {/* Orbit Ring 3 */}
              <g transform="rotate(120 50 50)">
                 <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
                 <motion.circle 
                    r="2.5" fill="#d4af37"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    style={{ offsetPath: "path('M50,5 A20,45 0 1,1 50,95 A20,45 0 1,1 50,5')" }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity, delay: 0.5 }}
                 />
              </g>

           </motion.svg>
        </div>

      </div>
    </motion.div>
  );
}
