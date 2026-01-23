import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Loader from "./components/Loader/Loader";
import Hero from "./components/Hero/Hero";
import Gallery from "./components/Gallery/Gallery";
import FlashOverlay from "./components/Hero/FlashOverlay";
import FilmRollOverlay from "./components/Hero/FilmRollOverlay";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Handle transition complete
  const handleTransitionComplete = () => {
    setShowGallery(true);
  };

  return (
    <div className="relative min-h-screen">
      
      {/* FILM ROLL OVERLAY (Replaces Flash) */}
      <FilmRollOverlay trigger={triggerTransition} onComplete={handleTransitionComplete} />

      {/* HERO SECTION - Keep mounted to prevent WebGL context loss crash, just hide */}
      <div style={{ display: showGallery ? 'none' : 'block' }}>
        <Hero 
            isLoading={isLoading} 
            onPortalEnter={val => {
                // Only trigger if we haven't already
                if (val && !triggerTransition) setTriggerTransition(true);
            }} 
        />
      </div>

      {/* GALLERY SECTION */}
      {showGallery && (
        <Gallery visible={showGallery} />
      )}

      {/* LOADER IS AN ABSOLUTE OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
