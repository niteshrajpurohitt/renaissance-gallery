import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Loader from "./components/Loader/Loader";
import Hero from "./components/Hero/Hero";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* HERO IS ALWAYS RENDERED BEHIND */}
      <Hero isLoading={isLoading} />

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
