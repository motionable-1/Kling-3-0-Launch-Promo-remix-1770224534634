import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function blurDissolve(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);

      // Blur peaks in the middle
      const blurAmount = Math.sin(progress * Math.PI) * 20;
      
      // Opacity cross-fade
      const opacity = isEntering ? smoothProgress : 1 - smoothProgress;

      return (
        <AbsoluteFill
          style={{
            opacity,
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${1 + blurAmount * 0.002})`, // Slight scale to hide edges if blur causes transparency at edges
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
