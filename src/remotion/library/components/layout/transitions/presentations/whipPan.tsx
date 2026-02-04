import { AbsoluteFill } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";
import type { CustomProps, PresentationComponentProps } from "./types";

export function whipPan(): TransitionPresentation<CustomProps> {
  return {
    component: ({
      children,
      presentationDirection,
      presentationProgress,
    }: PresentationComponentProps) => {
      const isEntering = presentationDirection === "entering";
      const progress = presentationProgress;

      // Easing: Accelerate out, Decelerate in.
      // We want the middle (progress=0.5 for a full transition, but here progress is 0->1 for each scene)
      // to be the fastest.
      // Actually, for `isEntering`, we start fast and slow down.
      // For `!isEntering`, we start slow and speed up.
      
      // But here we need specific curves.
      // Entering: Decelerate (fast -> slow). easeOutCubic?
      // Exiting: Accelerate (slow -> fast). easeInCubic?
      
      const easeIn = (t: number) => t * t * t;
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const direction = 1; // 1 for right-to-left (standard whip pan)
      // Or maybe configurable? For now, standard.
      
      const width = 100; // percent

      if (isEntering) {
          // Comes from right (100%) to center (0%)
          // Starts fast, slows down.
          const t = easeOut(progress);
          const translateX = (1 - t) * width * direction; 
          
          // Blur is highest when speed is highest (at start)
          const speed = (1 - progress); // Approximation
          const blurAmount = speed * 50; 
          
          return (
            <AbsoluteFill style={{ overflow: 'hidden' }}>
                <svg width="0" height="0">
                    <filter id="whip-pan-blur-enter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={`${blurAmount},0`} />
                    </filter>
                </svg>
                <AbsoluteFill
                    style={{
                        transform: `translateX(${translateX}%)`,
                        filter: `url(#whip-pan-blur-enter)`,
                        // Hide if completely off screen?
                    }}
                >
                    {children}
                </AbsoluteFill>
            </AbsoluteFill>
          );
      } else {
          // Goes from center (0%) to left (-100%)
          // Starts slow, speeds up.
          const t = easeIn(progress);
          const translateX = t * -width * direction;
          
          // Blur is highest at end
          const speed = progress;
          const blurAmount = speed * 50;

           return (
            <AbsoluteFill style={{ overflow: 'hidden' }}>
                <svg width="0" height="0">
                    <filter id="whip-pan-blur-exit">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={`${blurAmount},0`} />
                    </filter>
                </svg>
                <AbsoluteFill
                    style={{
                        transform: `translateX(${translateX}%)`,
                        filter: `url(#whip-pan-blur-exit)`,
                    }}
                >
                    {children}
                </AbsoluteFill>
            </AbsoluteFill>
          );
      }
    },
    props: {} as CustomProps,
  };
}
