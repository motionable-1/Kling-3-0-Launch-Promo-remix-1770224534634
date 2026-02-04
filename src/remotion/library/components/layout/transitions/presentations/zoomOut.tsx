import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function zoomOut(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      const smoothProgress = progress * progress * (3 - 2 * progress);

      if (isEntering) {
        // Enters by zooming out from 1.5 to 1
        const scale = 1.5 - smoothProgress * 0.5;
        const blur = (1 - smoothProgress) * 5;
        return (
          <AbsoluteFill
            style={{
              opacity: smoothProgress,
              transform: `scale(${scale})`,
              filter: `blur(${blur}px)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }

      // Exits by zooming out from 1 to 0.5
      const scale = 1 - smoothProgress * 0.5;
      const blur = smoothProgress * 5;
      return (
        <AbsoluteFill
          style={{
            opacity: 1 - smoothProgress,
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
