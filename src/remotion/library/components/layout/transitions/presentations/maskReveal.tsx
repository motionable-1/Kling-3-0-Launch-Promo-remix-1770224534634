import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function maskReveal(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;

      if (isEntering) {
        // Entering scene: Starts as a small circle in center, expands to fill screen.
        // 0% -> 0% radius
        // 100% -> 150% radius (to cover corners)
        
        // Easing for more impact
        const t = progress;
        const radius = t * 150;
        
        return (
          <AbsoluteFill
            style={{
              clipPath: `circle(${radius}% at 50% 50%)`,
              zIndex: 1,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }

      // Exiting scene: Stays in background, gets covered.
      return <AbsoluteFill>{children}</AbsoluteFill>;
    },
    props: {} as CustomProps,
  };
}
