import { motion } from "motion/react";

function VitruvianShapes({ trigger = true }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" viewBox="0 0 800 800">
      {/* The Vitruvian Circle - Draws 1st, Undraws Last */}
      <motion.circle 
        cx="400" cy="380" r="300" 
        fill="none" 
        stroke="#525252" 
        strokeWidth="1.5" 
        strokeOpacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={trigger ? { 
          pathLength: [0, 1, 1, 1, 0], // Draw -> Hold -> Hold -> Undraw
          opacity:    [0, 1, 1, 1, 0], 
          rotate: [90, 180]
        } : {}}
        transition={{ 
          duration: 10,
          // Draw(0-20%), Hold(20-40%), Undraw(40-100% slowly) - Shorter Hold
          times: [0, 0.2, 0.4, 1], 
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.5,
          delay: 0.5 
        }} 
      />

      {/* The Vitruvian Square - Draws 2nd, Undraws 3rd */}
      <motion.rect 
        x="150" y="180" width="500" height="500" 
        fill="none" 
        stroke="#525252" 
        strokeWidth="1.5"
        strokeOpacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={trigger ? { 
          pathLength: [0, 0, 1, 1, 0, 0], 
          opacity:    [0, 0, 1, 1, 0, 0], 
        } : {}}
        transition={{ 
          duration: 10,
          // Wait(20%), Draw(20-40%), Hold(40-50%), Undraw(50-70%), Wait(70-100%)
          times: [0, 0.2, 0.4, 0.5, 0.7, 1],
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.5,
          delay: 0.5
        }}
      />
    </svg>
  );
}

export default VitruvianShapes;
