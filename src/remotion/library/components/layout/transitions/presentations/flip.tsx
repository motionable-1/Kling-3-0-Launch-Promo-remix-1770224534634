import React from "react";
import type { TransitionPresentation } from "@remotion/transitions";

export type FlipDirection = "horizontal" | "vertical";

export interface FlipProps extends Record<string, unknown> {
  direction?: FlipDirection;
  perspective?: number;
}

export const flip = (props?: FlipProps): TransitionPresentation<FlipProps> => {
  const direction = props?.direction ?? "horizontal";
  const perspective = props?.perspective ?? 1000;

  return {
    props: { direction, perspective },
    component: (props) => {
      const { presentationDirection, children, presentationProgress } = props;
      
      const finished = presentationDirection === "exiting";
      const t = presentationProgress;

      // 0 -> 1 during transition
      // We want to flip 180 degrees.
      // If entering: 0 -> 0 (start) to 1 (end). Wait, standard Remotion:
      // entering: progress 0 -> 1.
      // exiting: progress 0 -> 1.
      
      // Let's model a card flip.
      // The "exiting" component goes from 0 to -90 (or 90)
      // The "entering" component goes from 90 (or -90) to 0
      
      const rotationAxis = direction === "horizontal" ? "Y" : "X";
      
      const style: React.CSSProperties = {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      };

      const innerStyle: React.CSSProperties = {
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
      }

      if (finished) {
          // Exiting component: Rotate from 0 to -90 (or 180 if we want full spin, but usually split is better)
          // Simple flip: Exiting rotates 0 -> -180. Entering rotates 180 -> 0.
          // But they obscure each other.
          // Better: Exiting 0 -> -90. Entering 90 -> 0.
          
          // Remotion Transitions renders BOTH components on top of each other.
          // We need to handle opacity or z-index to swap them at 50%.
          
          // Actually, standard transition impl:
          // We can just rotate both?
          // Let's try the "Doorway" style or standard Flip.
          
          // Exiting: 0 to -180
          // Entering: 180 to 0
          // But we need to hide backface.
          
          // Let's use the standard "Swap" logic where we handle visibility
          
          const rotation = -180 * t;
          
          return (
              <div style={style}>
                  <div style={{
                      ...innerStyle,
                      transform: `rotate${rotationAxis}(${rotation}deg)`,
                      zIndex: t < 0.5 ? 2 : 0,
                      opacity: t < 0.5 ? 1 : 0 // Hard swap to prevent z-fighting artifacts
                  }}>
                      {children}
                  </div>
              </div>
          );
      } else {
          // Entering
           const rotation = 180 * (1 - t);
           return (
              <div style={style}>
                  <div style={{
                      ...innerStyle,
                      transform: `rotate${rotationAxis}(${rotation}deg)`,
                      zIndex: t >= 0.5 ? 2 : 0,
                      opacity: t >= 0.5 ? 1 : 0
                  }}>
                      {children}
                  </div>
              </div>
          );
      }
    },
  };
};
