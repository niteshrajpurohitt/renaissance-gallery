import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

function FilmRollOverlay({ trigger, onComplete }) {
    const [phase, setPhase] = useState('idle'); // idle -> in -> active -> out

    useEffect(() => {
        if (trigger && phase === 'idle') {
            setPhase('in');
        }
    }, [trigger, phase]);

    return (
        <AnimatePresence>
            {phase !== 'idle' && (
                <motion.div
                    className="fixed inset-0 z-[200] bg-black flex flex-col justify-center items-center overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'out' ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={(def) => {
                        // After entry, wait a bit then exit
                        if (phase === 'in' && def.opacity === 1) {
                            setPhase('active');
                            setTimeout(() => {
                                onComplete?.();
                                setPhase('out');
                            }, 2500); // Let marquee run for 2.5s
                        }
                    }}
                >
                     {/* FILM GRAIN OVERLAY */}
                     <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

                    {/* ROW 1 - LEFT */}
                    <FilmStrip direction="left" />

                    {/* ROW 2 - RIGHT */}
                    <FilmStrip direction="right" />

                </motion.div>
            )}
        </AnimatePresence>
    );
}

function FilmStrip({ direction }) {
    return (
        <div className="w-full h-48 md:h-64 relative my-4 bg-[#111] border-y-8 border-[#333] flex items-center overflow-hidden">
            {/* SPROCKET HOLES TOP */}
            <div className="absolute top-1 left-0 right-0 h-4 flex space-x-4 px-2 z-10">
                 {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-3 h-2 bg-white/20 rounded-sm"></div>
                 ))}
            </div>

            {/* MARQUEE */}
            <motion.div
                className="flex space-x-4 absolute"
                initial={{ x: direction === 'left' ? 0 : "-50%" }}
                animate={{ x: direction === 'left' ? "-50%" : 0 }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                style={{ width: "200%" }} // Ensure enough width
            >
                {/* Duplicate frames to create seamless loop (Empty frames) */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="w-64 h-32 md:w-80 md:h-48 shrink-0 bg-[#0a0a0a] border-x-4 border-black relative flex items-center justify-center">
                         {/* Optional: Frame Number or slight texture */}
                         <span className="text-white/10 font-mono text-xs select-none">{i + 1}</span>
                    </div>
                ))}
            </motion.div>

             {/* SPROCKET HOLES BOTTOM */}
             <div className="absolute bottom-1 left-0 right-0 h-4 flex space-x-4 px-2 z-10">
                 {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-3 h-2 bg-white/20 rounded-sm"></div>
                 ))}
            </div>
        </div>
    );
}

export default FilmRollOverlay;
