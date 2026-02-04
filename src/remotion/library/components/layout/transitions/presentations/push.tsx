import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function push(
  direction: "left" | "right"
): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);

      // If pushing left:
      // Entering comes from right (+100%) to 0.
      // Exiting goes from 0 to left (-100%).
      
      const multiplier = direction === "left" ? 1 : -1;

      if (isEntering) {
        const translateX = (1 - smoothProgress) * 100 * multiplier;
        return (
          <AbsoluteFill
            style={{
              transform: `translateX(${translateX}%) scale(${0.95 + smoothProgress * 0.05})`,
              filter: `brightness(${0.7 + smoothProgress * 0.3})`,
              zIndex: 1, // On top
              boxShadow: '0 0 20px rgba(0,0,0,0.5)', // Shadow for depth
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }

      const translateX = smoothProgress * -100 * multiplier;
      return (
        <AbsoluteFill
          style={{
            transform: `translateX(${translateX}%) scale(${1 - smoothProgress * 0.05})`,
            filter: `brightness(${1 - smoothProgress * 0.3})`,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
