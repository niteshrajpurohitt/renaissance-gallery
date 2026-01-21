import { motion } from "motion/react";

/**
 * VitruvianShapes Component - Animated Circle and Rectangle
 * Extracted from Loader for potential reuse elsewhere.
 * 
 * @param {Object} props
 * @param {function} [props.onAnimationComplete] - Callback when animation finishes
 */
function VitruvianShapes({ onAnimationComplete }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 800 800">
      {/* The Vitruvian Circle */}
      <motion.circle 
        cx="400" cy="380" r="300" 
        fill="none" 
        stroke="#d6d3d1" 
        strokeWidth="1.5" 
        strokeOpacity="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1, 1],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 4,
          times: [0, 0.3, 0.6, 1],
          delay: 2.0, 
          ease: "easeInOut" 
        }} 
      />
      {/* The Vitruvian Square */}
      <motion.rect 
        x="150" y="180" width="500" height="500" 
        fill="none" 
        stroke="#d6d3d1" 
        strokeWidth="1.5"
        strokeOpacity="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1, 1], 
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 4, 
          times: [0, 0.3, 0.6, 1],
          delay: 2.2, 
          ease: "easeInOut" 
        }}
        onAnimationStart={() => {
          // Schedule callback roughly when dissolve starts (Delay 2.2 + 2.4s = 4.6s)
          setTimeout(() => onAnimationComplete?.(), 4600); 
        }}
      />
    </svg>
  );
}

export default VitruvianShapes;
