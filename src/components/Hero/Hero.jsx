
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import profileImage from "../../assets/images/profile.webp";
import CameraScene from "./CameraScene";
import VitruvianShapes from "./VitruvianShapes";
import arrowDown from "../../assets/arrow-down.svg";
import VariableProximity from './VariableProximity';


function Hero({ isLoading, onPortalEnter, isPaused = false }) {
  const containerRef = useRef(null);
  const [showShapes, setShowShapes] = useState(false);

  // Trigger shapes animation ONLY after profile/text animations finish
  useEffect(() => {
    if (!isLoading) {
        const timer = setTimeout(() => setShowShapes(true), 100); 
        return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const profileOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const profileY = useTransform(scrollYProgress, [0, 0.15], [0, 200]);
  const profileX = useTransform(scrollYProgress, [0, 0.15], [0, 150]); 
  const profileRotate = useTransform(scrollYProgress, [0, 0.15], [0, 15]);
  const profileBlur = useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(10px)"]);

  // AIM Text Transforms
  const aimOpacity = useTransform(scrollYProgress, [0.25, 0.40, 0.55], [0, 1, 0]);
  const aimBlur = useTransform(scrollYProgress, [0.25, 0.38], ["blur(10px)", "blur(0px)"]);

  // FOCUS Text Transforms
  const focusOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
  const focusBlur = useTransform(scrollYProgress, [0.55, 0.65], ["blur(10px)", "blur(0px)"]);

  // SHOOT Text Transforms (Big Text)
  const shootBigOpacity = useTransform(scrollYProgress, [0.80, 0.85, 1.0], [0, 1, 1]); // Stays visible? Or fades? Let's keep it visible at end.
  const shootBigBlur = useTransform(scrollYProgress, [0.80, 0.85], ["blur(10px)", "blur(0px)"]);

  /* --- TEXT SCROLL TRANSFORMS (Custom) --- */
  // 1. Faster fade
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  // 2. Move UP 
  const textY = useTransform(scrollYProgress, [0, 0.15], [0, -150]);
  // 3. Add Blur 
  const textBlur = useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(10px)"]);

  return (
    <section ref={containerRef} className="relative min-h-[250vh]">
      <div 
        className="sticky top-0 h-screen flex flex-col justify-end overflow-hidden bg-[#1c1917]"
        style={{
          background: 'radial-gradient(circle at center, rgba(80,70,60,0.2) 0%, rgba(20,15,10,0.95) 60%)',
          backgroundColor: '#1c1917'
        }}
      >
        
        {/* VITRUVIAN SHAPES BACKGROUND - CENTERED IN HERO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0  opacity-100">
            <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px]">
                <VitruvianShapes trigger={showShapes} />
            </div>
        </div>

        {/* 3D SCENE LAYER */}
        <CameraScene scrollYProgress={scrollYProgress} onPortalEnter={onPortalEnter} isPaused={isPaused} />

        {/* Profile */}
        <div className="w-full h-full flex flex-col justify-end items-center pb-0 relative z-20 pointer-events-none">
          
          {/* TEXT LAYER */}
          <motion.div 
            className="z-30 mix-blend-overlay mb-8"
            style={{ 
              opacity: textOpacity, 
              y: textY,
              filter: textBlur
            }}
          >
            <motion.div
                className="text-center flex flex-col items-center"
                initial={{ opacity: 0, y: -100, filter: "blur(10px)" }} 
                animate={!isLoading ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            >
                <div style={{ position: 'relative' }} className="pointer-events-auto">
                    <VariableProximity
                    label="I see, therefore I am"
                    className="text-white text-4xl md:text-8xl font-primary font-medium tracking-tight opacity-90 leading-tight cursor-pointer block
                     text-shadow-black text-shadow-md"
                    fromFontVariationSettings="'wght' 400"
                    toFontVariationSettings="'wght' 1000" // Bold on hover
                    containerRef={containerRef}
                    radius={100}
                    falloff="linear"
                  />
                </div>
                <motion.p 
                className="text-amber-100/60 text-xs md:text-base font-secondary tracking-tight uppercase mt-4"
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 1.5 }}
                >
                NITESH | PHOTOGRAPHY
                </motion.p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="translate-y-12 mb-12 relative"
            initial={{ opacity: 0,filter: "blur(2px)" }}
            animate={!isLoading ? { opacity: 1,filter: "blur(0px)"  } : {}} 
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            style={{ 
              opacity: profileOpacity, 
              y: profileY, 
              x: profileX,
              rotate: profileRotate,
              filter: profileBlur
            }}
          >
            <img
              src={profileImage}
              alt="Photographer profile"
              className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl pointer-events-none relative z-10"
            />
          </motion.div>

          {/* --- SCROLL SEQUENCE TEXTS --- */}
          
          {/* PHASE 1: AIM*/}
           <motion.div
             className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none tracking-wider"
             style={{ 
                 opacity: aimOpacity,
                 filter: aimBlur
             }}
          >
             <h2 className="text-white/80 font-primary text-5xl md:text-9xl tracking-widest font-bold mix-blend-overlay">AIM</h2>
          </motion.div>

          {/* PHASE 2: FOCUS  */}
           <motion.div
             className="absolute top-20 left-0 right-0 flex justify-center z-40 pointer-events-none tracking-tighter"
             style={{ 
                 opacity: focusOpacity,
                 filter: focusBlur 
             }}
          >
             <h2 className="text-white/80 font-primary text-5xl md:text-9xl tracking-widest font-bold mix-blend-overlay">FOCUS</h2>
          </motion.div>

          {/* PHASE 3: SHOOT */}
          <motion.div
             className="absolute bottom-28 left-0 right-0 flex justify-center z-40 pointer-events-none tracking-tighter"
             style={{ 
                 opacity: shootBigOpacity,
                 filter: shootBigBlur 
             }}
          >
             <h2 className="text-white/80 font-primary text-5xl md:text-9xl tracking-widest font-bold mix-blend-overlay">SHOOT</h2>
          </motion.div>

          {/* INSTRUCTION */}
          <motion.div
             className="absolute bottom-10 z-50 flex justify-center w-full pointer-events-none mix-blend-difference"
             style={{ opacity: useTransform(scrollYProgress, [0.8, 0.95], [0, 1]) }}
          >
             <motion.p
               className="text-amber-200/80 font-secondary text-sm tracking-widest uppercase"
               animate={{ opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
               [ CLICK CAMERA TO VIEW PHOTOS ]
             </motion.p>
          </motion.div>

          {/* SCROLL HINT*/}
          <motion.div
             className="absolute bottom-8 z-50 flex flex-col items-center justify-center w-full pointer-events-none"
             style={{ opacity: useTransform(scrollYProgress, [0, 0.7, 0.8], [1, 1, 0]) }}
             initial={{ opacity: 0 }}
             animate={!isLoading ? { opacity: 1 } : {}}
             transition={{ delay: 2.0, duration: 1 }}
          >
              <motion.img 
                src={arrowDown} 
                alt="Scroll Down"
                className="w-6 h-6 opacity-60 invert mix-blend-difference"
                animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}

export default Hero;
