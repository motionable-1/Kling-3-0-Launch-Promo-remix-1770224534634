import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function clockWipe(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;

      if (isEntering) {
        // Entering scene: Revealed by clock sweep
        // conic-gradient(black 0deg, black Xdeg, transparent Xdeg)
        const degrees = progress * 360;
        
        return (
          <AbsoluteFill
            style={{
              WebkitMaskImage: `conic-gradient(from 0deg at 50% 50%, black 0deg, black ${degrees}deg, transparent ${degrees}deg, transparent 360deg)`,
              maskImage: `conic-gradient(from 0deg at 50% 50%, black 0deg, black ${degrees}deg, transparent ${degrees}deg, transparent 360deg)`,
              zIndex: 1,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      }

      // Exiting scene: Background
      return <AbsoluteFill>{children}</AbsoluteFill>;
    },
    props: {} as CustomProps,
  };
}
