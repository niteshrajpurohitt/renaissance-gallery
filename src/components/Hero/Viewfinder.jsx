import { motion, useTransform } from "motion/react";

/*
 * Old-camera viewfinder brackets drawn over the hero while scrolling:
 *   AIM   – gold corner brackets appear, wide
 *   FOCUS – brackets close in
 *   SHOOT – the frame lines flash once, then rest around the camera
 * Everything moves with transforms/opacity only (no layout, no filters).
 */
const STOPS = [0.25, 0.55, 0.68, 0.76, 0.82];
const INSET = ["0vmin", "0vmin", "11vmin", "11vmin", "5vmin"];
const INSET_NEG = ["-0vmin", "-0vmin", "-11vmin", "-11vmin", "-5vmin"];

const corner = "absolute w-9 h-9 md:w-14 md:h-14 border-gilt/70";

export default function Viewfinder({ progress }) {
  const opacity = useTransform(progress, [0.2, 0.3, 0.79, 0.81, 0.87], [0, 0.7, 0.7, 1, 0.45]);
  const d = useTransform(progress, STOPS, INSET);
  const n = useTransform(progress, STOPS, INSET_NEG);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-[5vmin] z-30 pointer-events-none"
      style={{ opacity }}
    >
      <motion.div className={`${corner} top-0 left-0 border-t-[1.5px] border-l-[1.5px]`} style={{ x: d, y: d }} />
      <motion.div className={`${corner} top-0 right-0 border-t-[1.5px] border-r-[1.5px]`} style={{ x: n, y: d }} />
      <motion.div className={`${corner} bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]`} style={{ x: d, y: n }} />
      <motion.div className={`${corner} bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]`} style={{ x: n, y: n }} />
    </motion.div>
  );
}
