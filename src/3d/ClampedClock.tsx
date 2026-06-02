import { useFrame } from "@react-three/fiber";

/**
 * Clamps the Three.js clock delta to prevent huge time jumps when the
 * browser tab is backgrounded and then re-focused.
 *
 * Must be mounted inside the <Canvas> and rendered *before* any
 * physics or game-loop consumers so it runs at the earliest priority.
 *
 * @param maxDelta – maximum allowed delta in seconds (default 1/30 ≈ 33ms)
 */
export const ClampedClock = ({ maxDelta = 1 / 30 }: { maxDelta?: number }) => {
  useFrame((state) => {
    // If the raw delta exceeds maxDelta, nudge the clock's elapsedTime
    // backward so that every subsequent getDelta() call in this frame
    // returns at most maxDelta.
    const rawDelta = state.clock.getDelta();
    if (rawDelta > maxDelta) {
      // Roll the clock forward only by maxDelta, not the real elapsed time
      state.clock.elapsedTime -= rawDelta - maxDelta;
    }
  }, -100); // Negative priority = runs before default (0) priority subscribers

  return null;
};
