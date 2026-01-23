import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

function FlashOverlay({ trigger, onFlashPeak }) {
    const [phase, setPhase] = useState('idle'); // idle -> in -> out

    useEffect(() => {
        if (trigger && phase === 'idle') {
            setPhase('in');
        }
    }, [trigger, phase]);

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          className="fixed inset-0 z-[200] bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'in' ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ 
              duration: phase === 'in' ? 0.15 : 1.5, // Fast in, slow out
              ease: phase === 'in' ? "easeIn" : "easeOut" 
          }}
          onAnimationComplete={() => {
            if (phase === 'in') {
                console.log("Flash peaked, triggering swap");
                onFlashPeak?.();
                // Immediately start fading out
                setPhase('out');
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}

export default FlashOverlay;
