import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface UseGsapTimelineOptions {
  /** Starting frame for the animation (default: 0) */
  startFrom?: number;
}

export const useGsapTimeline = <T extends HTMLElement>(
  gsapTimelineFactory: () => gsap.core.Timeline,
  deps: React.DependencyList = [],
  options: UseGsapTimelineOptions = {},
) => {
  const { startFrom = 0 } = options;
  const animationScopeRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const memoizedTimelineFactory = useCallback(gsapTimelineFactory, deps);

  useEffect(() => {
    const ctx = gsap.context(() => {
      timelineRef.current = memoizedTimelineFactory();
      timelineRef.current.pause();
    }, animationScopeRef);
    return () => ctx.revert();
  }, [memoizedTimelineFactory]);

  useEffect(() => {
    if (timelineRef.current) {
      const effectiveFrame = Math.max(0, frame - startFrom);
      timelineRef.current.seek(effectiveFrame / fps);
    }
  }, [frame, fps, startFrom]);

  return animationScopeRef;
};
