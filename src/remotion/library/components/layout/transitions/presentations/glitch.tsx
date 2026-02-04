import { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function glitch(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;

      const steps = 20; // Number of "glitch frames"
      const step = Math.floor(progress * steps);
      const seed = isEntering ? step : step + 100;

      // Intensity curve:
      // Entering: Starts high, fades out.
      // Exiting: Starts low, ramps up.
      const intensity = isEntering
        ? Math.pow(1 - progress, 2) // 1 -> 0
        : Math.pow(progress, 2);    // 0 -> 1

      const numSlices = 10;
      const sliceHeight = 100 / numSlices;

      const slices = useMemo(() => {
        return new Array(numSlices).fill(0).map((_, i) => {
            // Random displacement for this slice at this step
            const displacementX = (random(seed + i) - 0.5) * 100 * intensity;
            const displacementY = (random(seed + i + 0.1) - 0.5) * 10 * intensity;
            return {
                top: i * sliceHeight,
                bottom: 100 - (i + 1) * sliceHeight,
                displacementX,
                displacementY,
            };
        });
      }, [intensity, numSlices, seed, sliceHeight]);
      
      const globalSkew = (random(seed + 1000) - 0.5) * 20 * intensity;
      const hueRotate = (random(seed + 2000) - 0.5) * 180 * intensity;
      
      // Determine opacity for fade in/out
      const opacity = isEntering 
        ? Math.min(1, progress * 2) 
        : Math.max(0, 1 - (progress - 0.5) * 2);

      return (
        <AbsoluteFill style={{ opacity }}>
            {slices.map((slice, i) => (
                <AbsoluteFill
                    key={i}
                    style={{
                        clipPath: `inset(${slice.top}% 0 ${slice.bottom}% 0)`,
                        transform: `translate(${slice.displacementX}px, ${slice.displacementY}px) skewX(${globalSkew}deg)`,
                        filter: `hue-rotate(${hueRotate}deg) contrast(${1 + intensity})`,
                        zIndex: i,
                    }}
                >
                    {children}
                </AbsoluteFill>
            ))}
            {/* Add a "ghost" layer for extra glitchiness if intensity is high */}
            {intensity > 0.5 && (
                <AbsoluteFill 
                    style={{ 
                        opacity: 0.3, 
                        transform: `scale(1.05) translate(${(random(seed)-0.5)*20}px, ${(random(seed+1)-0.5)*20}px)`,
                        mixBlendMode: 'difference',
                        filter: 'invert(1)',
                        zIndex: numSlices + 1
                    }}
                >
                    {children}
                </AbsoluteFill>
            )}
        </AbsoluteFill>
      );
    },
    props: {} as CustomProps,
  };
}
