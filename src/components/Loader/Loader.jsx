import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

import leftHand from "../../assets/images/lefthand.png";
import rightHand from "../../assets/images/righthand.png";

const MIN_REACH_MS = 1100; // let the hands finish their entrance
const HOLD_MS = 1300; // hold the touching hands a moment before the curtain lifts
const MAX_WAIT_MS = 9000; // never trap the visitor if an asset stalls

// Creation of Adam: the hands reach for each other as the 3D scene loads,
// and the loader lifts once everything is ready.
function Loader({ onComplete }) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [reachDone, setReachDone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const { progress, active } = useProgress();

  const imagesReady = loadedCount >= 2;
  const assetsReady = (!active && progress >= 100) || timedOut;
  const done = imagesReady && reachDone && assetsReady;

  // 0 → hands far apart, 1 → almost touching
  const reach = imagesReady ? 0.35 + 0.65 * (assetsReady ? 1 : progress / 100) : 0;

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!imagesReady) return;
    const t = setTimeout(() => setReachDone(true), MIN_REACH_MS);
    return () => clearTimeout(t);
  }, [imagesReady]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => onComplete?.(), HOLD_MS);
    return () => clearTimeout(t);
  }, [done, onComplete]);

  const handleImageLoad = () => setLoadedCount((n) => n + 1);
  const hidden = (dir) => ({ x: dir * 100, y: dir * -50, rotate: dir * -10, opacity: 0 });
  const reaching = (dir) => ({
    x: dir * 100 * (1 - reach),
    y: dir * -50 * (1 - reach),
    rotate: dir * -10 * (1 - reach),
    opacity: 1,
  });

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-umber bg-[radial-gradient(circle_at_center,rgba(80,70,60,0.2)_0%,rgba(20,15,10,0.95)_60%)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      role="status"
      aria-label="Loading"
    >
      <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* LEFT HAND */}
          <motion.div
            className="absolute right-1/2 mr-2 md:mr-4 mask-l-from-20%"
            initial={hidden(-1)}
            animate={imagesReady ? reaching(-1) : hidden(-1)}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src={leftHand}
              alt=""
              onLoad={handleImageLoad}
              onError={handleImageLoad}
              className="w-[150px] md:w-[300px] object-contain drop-shadow-xl"
            />
          </motion.div>

          {/* RIGHT HAND */}
          <motion.div
            className="absolute left-1/2 ml-2 md:ml-4 mask-r-from-20%"
            initial={hidden(1)}
            animate={imagesReady ? reaching(1) : hidden(1)}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src={rightHand}
              alt=""
              onLoad={handleImageLoad}
              onError={handleImageLoad}
              className="w-[150px] md:w-[300px] object-contain drop-shadow-xl"
            />
          </motion.div>
        </motion.div>

        {/* Thin gilded progress line */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-40 bg-gilt/15 overflow-hidden"
          animate={{ opacity: done ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="h-full bg-gilt/70 origin-left"
            animate={{ scaleX: assetsReady ? 1 : progress / 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Loader;
