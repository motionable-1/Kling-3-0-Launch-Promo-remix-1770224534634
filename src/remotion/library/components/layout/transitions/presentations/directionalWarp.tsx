import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function directionalWarp(
  direction: "left" | "right" = "left"
): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;
      
      const dirMult = direction === "left" ? 1 : -1;

      // Warp effect: scaleX stretch + blur
      
      if (isEntering) {
        // Comes from side, heavily stretched
        // progress 0 -> 1
        // Translate: 100% -> 0%
        // ScaleX: 4 -> 1
        // Blur: 20px -> 0px
        
        const inv = 1 - progress;
        const translateX = inv * 100 * dirMult;
        const scaleX = 1 + (inv * 4); // Stretch as it moves fast
        const blur = inv * 20;
        
        return (
          <AbsoluteFill
            style={{
                transform: `translateX(${translateX}%) scaleX(${scaleX})`,
                transformOrigin: direction === "left" ? "right center" : "left center",
                filter: `blur(${blur}px)`,
                zIndex: 1,
            }}
          >
            <AbsoluteFill style={{ transform: `scaleX(${1/scaleX})` }}>
                {children}
            </AbsoluteFill>
          </AbsoluteFill>
        );
      }

      // Exiting scene
      // Translate: 0% -> -100%
      // ScaleX: 1 -> 4
      // Blur: 0px -> 20px
      const translateX = progress * -100 * dirMult;
      const scaleX = 1 + (progress * 4);
      const blur = progress * 20;

      return (
        <AbsoluteFill
            style={{
                transform: `translateX(${translateX}%) scaleX(${scaleX})`,
                transformOrigin: direction === "left" ? "left center" : "right center",
                filter: `blur(${blur}px)`,
            }}
        >
            <AbsoluteFill style={{ transform: `scaleX(${1/scaleX})` }}>
                {children}
            </AbsoluteFill>
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
