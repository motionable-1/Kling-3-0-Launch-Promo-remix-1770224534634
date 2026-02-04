import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function slideOver(
  direction: "left" | "right" | "top" | "bottom"
): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      // Use a custom easing here or rely on the transition timing passed down?
      // Usually transitions get linear progress 0->1 based on the timing function.
      // But we can add a bit of extra easing feel.
      // Let's stick to the progress as passed, assuming caller uses a good timing function.
      
      const smoothProgress = progress; // Or use an internal ease if desired, but let's trust the input timing.

      if (isEntering) {
        // Entering scene slides IN from outside.
        // If direction is "left", it slides FROM right TO left?
        // Usually "slide left" means content moves to the left. So new content comes from right.
        
        const xOffset = (1 - smoothProgress) * 100 * (direction === "left" ? 1 : direction === "right" ? -1 : 0);
        const yOffset = (1 - smoothProgress) * 100 * (direction === "top" ? 1 : direction === "bottom" ? -1 : 0);
        
        return (
          <AbsoluteFill
            style={{
              transform: `translate(${xOffset}%, ${yOffset}%)`,
              zIndex: 1, // Ensure on top
              boxShadow: '0 0 40px rgba(0,0,0,0.5)', // heavy shadow for depth
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }

      // Exiting scene stays put (covered)
      // Optionally dim it slightly
      return (
        <AbsoluteFill
            style={{
                filter: `brightness(${1 - smoothProgress * 0.5})`, // dim as it gets covered
                transform: `scale(${1 - smoothProgress * 0.05})`, // slight scale down for parallax feel
            }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
