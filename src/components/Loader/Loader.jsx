import { motion } from "motion/react";
import { useEffect } from "react";

import leftHand from "../../assets/images/lefthand.png";
import rightHand from "../../assets/images/righthand.png";

function Loader({ onComplete }) {
  // Trigger onComplete after hands animate in (Hero will be ready)
  
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 2000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-[#1c1917] bg-[radial-gradient(circle_at_center,rgba(80,70,60,0.2)_0%,rgba(20,15,10,0.95)_60%)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center">
        
        {/* HANDS CONTAINER - Fades out when Hero is ready (exit animation) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* LEFT HAND */}
          <motion.div
            className="absolute right-1/2 mr-2 md:mr-4 mask-l-from-20%"
            initial={{ x: -100, y: 50, rotate: 10, opacity: 0}}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src={leftHand} alt="Left Hand" className="w-[150px] md:w-[300px] object-contain drop-shadow-xl"/>
          </motion.div>

          {/* RIGHT HAND */}
          <motion.div
            className="absolute left-1/2 ml-2 md:ml-4 mask-r-from-20%"
            initial={{ x: 100, y: -50, rotate: -10, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src={rightHand} alt="Right Hand" className="w-[150px] md:w-[300px] object-contain drop-shadow-xl"/>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default Loader;
