import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// --- Shared Types & Utils ---

export interface KineticStreamProps {
  text: string;
  /** Font size */
  fontSize?: number;
  /** Font weight */
  fontWeight?: React.CSSProperties["fontWeight"];
  /** Text color */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Duration of the transition in frames */
  transitionDuration?: number;
  /**
   * Total duration of the animation in frames.
   * If not provided, it uses the composition's duration.
   */
  duration?: number;
  /**
   * Delay in frames after the last word appears before the animation ends.
   * This prevents the animation from ending abruptly.
   * @default 0
   */
  delayAfterLastWord?: number;
}

/**
 * Helper to split text into individual words
 */
const useWords = (text: string) => {
  return useMemo(() => {
    return text.split(/\s+/).filter(Boolean);
  }, [text]);
};

/**
 * Helper to get timing info
 */
const useStreamTiming = (
  totalGroups: number, 
  transitionDuration: number, 
  totalDurationProp?: number,
  delayAfterLastWord: number = 0
) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  const duration = totalDurationProp ?? durationInFrames;
  // Subtract the delay from the total duration to calculate group timing
  const effectiveDuration = duration - delayAfterLastWord;
  const durationPerGroup = effectiveDuration / totalGroups;
  const currentIndex = Math.floor(frame / durationPerGroup);
  
  // Clamp index
  const safeCurrentIndex = Math.min(totalGroups - 1, Math.max(0, currentIndex));
  const prevIndex = safeCurrentIndex - 1;
  
  const timeInSlot = frame % durationPerGroup;
  
  // Transition progress
  // If we are at the very first group, there's no previous group to transition from, 
  // so we might just want to be static or fade in.
  // We'll treat transition as "entering the new slot".
  const progress = interpolate(
    timeInSlot,
    [0, transitionDuration],
    [0, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.19, 1, 0.22, 1), // Expo-like ease
    }
  );

  const isTransitioning = timeInSlot < transitionDuration && safeCurrentIndex > 0;

  return {
    currentIndex: safeCurrentIndex,
    prevIndex,
    isTransitioning,
    progress,
  };
};

// --- Components ---

/**
 * SlideStream: Alternating slide in from left/right.
 * Clean, modern, corporate or creative.
 */
export const SlideStream: React.FC<KineticStreamProps & { direction?: 'left' | 'right' | 'alternate' }> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 12,
  direction = 'alternate',
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];
  
  // Easing
  // A nice snappy easing: cubic-bezier(0.65, 0, 0.35, 1)
  const easeProgress = isTransitioning 
      ? interpolate(progress, [0, 1], [0, 1], { 
          easing: Easing.bezier(0.65, 0, 0.35, 1),
          extrapolateRight: "clamp"
      }) 
      : 1;

  const getDirection = (index: number) => {
    if (direction === 'left') return 'left'; // Enters FROM left
    if (direction === 'right') return 'right'; // Enters FROM right
    return index % 2 === 0 ? 'left' : 'right'; // Alternate
  };

  const currentDir = getDirection(currentIndex);
  
  // Slide logic
  // If direction is 'left', it means it enters FROM the Left (start: -100%).
  // If direction is 'right', it means it enters FROM the Right (start: 100%).
  
  const enterStart = currentDir === 'left' ? -100 : 100;
  
  // Exit transforms (Old word)
  // If New word comes from Left (pushing Right?), usually we want flow.
  // If new comes from Left, old goes to Right.
  const exitEnd = currentDir === 'left' ? 100 : -100;
  
  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Previous Word */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: `translateX(${interpolate(easeProgress, [0, 1], [0, exitEnd])}%)`,
              opacity: interpolate(easeProgress, [0, 0.6], [1, 0]),
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Current Word */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: isTransitioning
                    ? `translateX(${interpolate(easeProgress, [0, 1], [enterStart, 0])}%)`
                    : `translateX(0)`,
                opacity: isTransitioning ? interpolate(easeProgress, [0, 0.3], [0, 1]) : 1,
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};

/**
 * SwipeStream: A very fast, swipe-like transition where words pass each other.
 */
export const SwipeStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 8,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];
  
  // Swipe is aggressive
  const easeProgress = isTransitioning 
      ? interpolate(progress, [0, 1], [0, 1], { 
          easing: Easing.bezier(0.85, 0, 0.15, 1),
          extrapolateRight: "clamp"
      })
      : 1;

  // Alternate swipe direction based on index to keep it dynamic
  // Word 0: Left to Right?
  // Word 1: Right to Left?
  const dir = currentIndex % 2 === 0 ? 1 : -1;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Previous Word */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              // If dir=1, old goes Left (-100%).
              transform: `translateX(${interpolate(easeProgress, [0, 1], [0, -100 * dir])}%) skewX(${interpolate(easeProgress, [0, 0.5, 1], [0, 20 * dir, 0])}deg)`,
              opacity: 1 - easeProgress,
              filter: `blur(${easeProgress * 10}px)`,
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Current Word */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                // If dir=1, new comes from Right (100%).
                transform: isTransitioning
                    ? `translateX(${interpolate(easeProgress, [0, 1], [100 * dir, 0])}%) skewX(${interpolate(easeProgress, [0, 0.5, 1], [20 * dir, 0])}deg)`
                    : `translateX(0)`,
                opacity: isTransitioning ? easeProgress : 1,
                filter: isTransitioning ? `blur(${(1-easeProgress) * 10}px)` : 'none',
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};

/**
 * DynamicSizeStream: Words cycle through but with dynamically changing sizes.
 * Creates a pulsing, rhythmic visual.
 */
export const DynamicSizeStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 10,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];
  
  // Deterministic size generator based on string hash or length
  // Or simply alternate: Big, Small, Big, Small
  // Or randomize within a range.
  
  const getSize = (index: number) => {
      // Simple pseudo-random
      const seed = index * 12345;
      const variation = (Math.sin(seed) + 1) / 2; // 0 to 1
      return 0.7 + variation * 0.8; // 0.7x to 1.5x scale
  };
  
  const currentScale = getSize(currentIndex);
  const prevScale = getSize(prevIndex);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Exiting Word */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: `scale(${prevScale * interpolate(progress, [0, 1], [1, 0.8])}) translateY(${interpolate(progress, [0, 1], [0, -100])}px)`,
              opacity: interpolate(progress, [0, 0.5], [1, 0]),
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Entering Word */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: isTransitioning
                    ? `scale(${currentScale * interpolate(progress, [0, 1], [0.5, 1])}) translateY(${interpolate(progress, [0, 1], [100, 0])}px)`
                    : `scale(${currentScale})`,
                opacity: isTransitioning ? interpolate(progress, [0, 0.8], [0, 1]) : 1,
                willChange: "transform",
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};

/**
 * StompStream: Huge text slams down into the frame.
 * High impact, shakes the screen.
 */
export const StompStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "900", // Default to super bold
  color = "currentColor",
  className,
  style,
  transitionDuration = 10,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  
  // Stomp Animation:
  // Starts huge (Scale 5, Opacity 0)
  // Slams to Scale 1 very fast
  // Shakes a bit after landing
  
  // We don't really transition OUT the old word, it just gets covered or disappears?
  // Let's have the old word just exist until the new one stomps?
  // Or old word fades out as new one stomps.
  
  // Custom timing curve for stomp
  // 0-0.3: Slam down
  // 0.3-1.0: Shake/Settle
  
  const stompProgress = isTransitioning ? progress : 1;
  
  const scale = isTransitioning 
      ? interpolate(stompProgress, [0, 0.3], [3, 1], { extrapolateRight: "clamp", easing: Easing.in(Easing.exp) })
      : 1;
      
  const opacity = isTransitioning 
      ? interpolate(stompProgress, [0, 0.1], [0, 1], { extrapolateRight: "clamp" })
      : 1;

  // Camera Shake (applied to container or word?)
  // Let's apply to word for simplicity
  const shake = (isTransitioning && stompProgress > 0.3 && stompProgress < 0.6)
      ? Math.sin(stompProgress * 50) * 10 * (1 - (stompProgress - 0.3)/0.3)
      : 0;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Previous Word (Disappears quickly) */}
        {isTransitioning && prevIndex >= 0 && (
             <div style={{ position: "absolute", opacity: interpolate(progress, [0, 0.2], [1, 0]) }}>
                 {words[prevIndex]}
             </div>
        )}

        {/* Current Word (Stomping) */}
        <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: `scale(${scale}) translate(${shake}px, ${shake}px)`,
                opacity,
            }}
        >
            {currentWord}
        </div>
    </div>
  );
};

/**
 * SlotMachineStream: Vertical blur roll, like a slot machine reel.
 */
export const SlotMachineStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 15,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];
  
  // Slot machine motion: Fast vertical move with intense vertical blur
  
  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Exiting Word: Moves Down/Up fast */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: `translateY(${interpolate(progress, [0, 1], [0, 200])}%)`,
              filter: `blur(0px ${interpolate(progress, [0, 0.5, 1], [0, 20, 0])}px)`,
              opacity: interpolate(progress, [0, 0.8], [1, 0]),
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Entering Word: Moves In from Top */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: isTransitioning
                    ? `translateY(${interpolate(progress, [0, 1], [-200, 0])}%)`
                    : `translateY(0)`,
                filter: isTransitioning 
                    ? `blur(0px ${interpolate(progress, [0, 0.5, 1], [20, 10, 0])}px)` 
                    : "none",
                opacity: isTransitioning ? interpolate(progress, [0, 0.2], [0, 1]) : 1,
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};

/**
 * OutlineStream: Stroke to Fill animation.
 */
export const OutlineStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "900",
  color = "currentColor",
  className,
  style,
  transitionDuration = 20,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  
  // Animation:
  // 0.0 - 0.3: Text appears as Outline
  // 0.3 - 0.7: Text fills in
  // 0.7 - 1.0: Text stays filled
  
  // Or better:
  // Always outline, fills up like water?
  // Let's do: Outline Stroke Dashoffset animation? (Hard with variable text width)
  // Easier: Two layers (Outline and Fill). Fill clips in or opacity fades in.
  
  const fillProgress = isTransitioning 
      ? interpolate(progress, [0.2, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Previous Word (Fades out) */}
        {isTransitioning && prevIndex >= 0 && (
            <div style={{ position: "absolute", opacity: interpolate(progress, [0, 0.2], [1, 0]) }}>
                {words[prevIndex]}
            </div>
        )}

        {/* Current Word */}
        <div style={{ position: "relative" }}>
             {/* Outline Layer (Always visible) */}
             <div style={{ 
                 position: "absolute", 
                 top: 0, left: 0, 
                 WebkitTextStroke: `2px ${color}`,
                 color: "transparent",
                 opacity: isTransitioning ? interpolate(progress, [0, 0.2], [0, 1]) : 1
             }}>
                 {currentWord}
             </div>
             
             {/* Fill Layer (Reveals) */}
             <div style={{ 
                 position: "relative",
                 color: color,
                 opacity: fillProgress,
                 transform: `scale(${interpolate(fillProgress, [0, 1], [1.1, 1])})`, // Slight scale in effect
             }}>
                 {currentWord}
             </div>
        </div>
    </div>
  );
};

/**
 * ElasticStream: Words pop in with a strong elastic bounce and subtle rotation.
 * Very energetic and playful.
 */
export const ElasticStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 12,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];

  // Elastic easing for the enter animation
  const elasticEnter = isTransitioning 
    ? interpolate(progress, [0, 1], [0, 1], {
        easing: Easing.elastic(1.5), // Bouncy
      })
    : 1;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Exiting Word: Scales Down quickly */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: `scale(${interpolate(progress, [0, 0.3], [1, 0])}) rotate(${interpolate(progress, [0, 0.3], [0, -15])}deg)`,
              opacity: interpolate(progress, [0, 0.2], [1, 0]),
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Entering Word: Elastic Pop from 0 */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: `scale(${elasticEnter})`,
                opacity: 1, // Always visible during its slot (after scale > 0)
                willChange: "transform",
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};

/**
 * BlockStream: A solid block wipes the text to reveal new text.
 * Clean, modern, and professional.
 */
export const BlockStream: React.FC<KineticStreamProps & { blockColor?: string }> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  blockColor = "currentColor",
  className,
  style,
  transitionDuration = 15,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];

  // Block Animation Timing
  // 0.0 - 0.5: Block grows to cover text
  // 0.5: Text swaps
  // 0.5 - 1.0: Block shrinks to reveal new text
  
  // Better Block logic:
  // Phase 1 (0-0.5): Block scales X from 0 to 1 (origin left). Text Visible.
  // Phase 2 (0.5): Swap Text.
  // Phase 3 (0.5-1): Block scales X from 1 to 0 (origin right). New Text Visible.
  
  const isPhase1 = progress < 0.5;
  const blockScale = isPhase1 
      ? interpolate(progress, [0, 0.5], [0, 1.1]) 
      : interpolate(progress, [0.5, 1], [1.1, 0]);
      
  const blockOrigin = isPhase1 ? "left" : "right";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        ...style,
      }}
    >
        <div style={{ position: "relative" }}>
            {/* The Text */}
            <div style={{ opacity: isTransitioning ? 0 : 1 }}>
                {/* During transition, we hide the main text container and rely on logic below? 
                    Actually, we just show either Prev or Current based on phase. */}
                {isTransitioning 
                    ? (isPhase1 ? prevWord : currentWord) 
                    : currentWord} 
            </div>
            
             {/* During transition, we overlay the block logic */}
             {isTransitioning && (
                 <>
                    {/* The text being covered/revealed */}
                    <div style={{ position: "absolute", top: 0, left: 0, opacity: 1 }}>
                        {isPhase1 ? prevWord : currentWord}
                    </div>
                    
                    {/* The Block */}
                    <div 
                        style={{
                            position: "absolute",
                            top: -10,
                            bottom: -10,
                            left: -20,
                            right: -20,
                            backgroundColor: blockColor,
                            transform: `scaleX(${blockScale})`,
                            transformOrigin: blockOrigin,
                            zIndex: 10
                        }}
                    />
                 </>
             )}
        </div>
    </div>
  );
};


/**
 * ChromaticStream: RGB split / Glitch effect on transition.
 */
export const ChromaticStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 8,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  
  // Glitch intensity curve
  const intensity = isTransitioning 
    ? interpolate(progress, [0, 0.5, 1], [0, 1, 0], { easing: Easing.bounce }) 
    : 0;

  // Random offsets based on intensity
  // Since we can't do random per frame easily without seed, we use deterministic math
  const redOffset = intensity * 10;
  const blueOffset = intensity * -10;
  const opacity = isTransitioning ? interpolate(progress, [0, 0.5, 1], [1, 0.5, 1]) : 1;

  // Text content swap at 50%
  const displayText = isTransitioning && progress < 0.5 ? words[prevIndex] : currentWord;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        ...style,
      }}
    >
        <div style={{ position: "relative" }}>
             {/* Main Text */}
             <div style={{ opacity, filter: `blur(${intensity * 2}px)` }}>
                 {displayText}
             </div>
             
             {/* Red Channel */}
             {isTransitioning && (
                 <div style={{ 
                     position: "absolute", top: 0, left: 0, 
                     transform: `translate(${redOffset}px, ${intensity * 2}px)`,
                     color: "rgba(255,0,0,0.8)",
                     mixBlendMode: "screen",
                     opacity: intensity
                 }}>
                     {displayText}
                 </div>
             )}
             
             {/* Blue Channel */}
             {isTransitioning && (
                 <div style={{ 
                     position: "absolute", top: 0, left: 0, 
                     transform: `translate(${blueOffset}px, ${intensity * -2}px)`,
                     color: "rgba(0,0,255,0.8)",
                     mixBlendMode: "screen",
                     opacity: intensity
                 }}>
                     {displayText}
                 </div>
             )}
        </div>
    </div>
  );
};

/**
 * FlipTextStream: Words flip in 3D like a mechanical display.
 */
export const FlipTextStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 10,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1000px", // Essential for 3D
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        ...style,
      }}
    >
      <div style={{ position: "relative", transformStyle: "preserve-3d", display: "grid", placeItems: "center" }}>
        {/* Exiting Word: Flips Up/Out (Rotation X 0 -> -90) */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              transformOrigin: "center bottom", // Pivot at bottom
              transform: `translate3d(0, -50%, 0) rotateX(${interpolate(progress, [0, 1], [0, 90])}deg) translateZ(${interpolate(progress, [0, 1], [0, 50])}px)`,
              opacity: interpolate(progress, [0, 0.5], [1, 0]),
              backfaceVisibility: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Entering Word: Flips In (Rotation X -90 -> 0) */}
        {currentWord && (
          <div
            style={{
                position: isTransitioning ? "absolute" : "relative",
                transformOrigin: "center top",
                // Start from -90 (perpendicular, bottom facing out) to 0
                transform: isTransitioning
                    ? `translate3d(0, -50%, 0) rotateX(${interpolate(progress, [0, 1], [-90, 0])}deg)`
                    : `translate3d(0, 0, 0)`,
                opacity: isTransitioning ? interpolate(progress, [0.4, 1], [0, 1]) : 1,
                backfaceVisibility: "hidden",
                whiteSpace: "nowrap",
            }}
          >
            {currentWord}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ZoomTextStream: Current word flies towards camera, new word flies in from distance.
 * High impact.
 */
export const ZoomTextStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 15,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        ...style,
      }}
    >
        {/* Exiting Word: Scales Up and Fades Out (Fly Through) */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: `scale(${interpolate(progress, [0, 1], [1, 3])})`,
              filter: `blur(${interpolate(progress, [0, 1], [0, 20])}px)`,
              opacity: interpolate(progress, [0, 0.8], [1, 0]),
              willChange: "transform, opacity, filter",
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Entering Word: Scales Up from 0 (From Distance) */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: isTransitioning
                    ? `scale(${interpolate(progress, [0, 1], [0.2, 1])})`
                    : `scale(1)`,
                opacity: isTransitioning ? interpolate(progress, [0, 0.6], [0, 1]) : 1,
                willChange: "transform, opacity",
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};


/**
 * BlurTextStream: Cinematic horizontal blur transition.
 * Words slide slightly and blur violently during transition.
 */
export const BlurTextStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 8,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Exiting Word: Slides Left + Motion Blur */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: `translateX(${interpolate(progress, [0, 1], [0, -100])}px) scale(${interpolate(progress, [0, 0.5, 1], [1, 0.9, 0.8])})`,
              filter: `blur(${interpolate(progress, [0, 0.5, 1], [0, 10, 20])}px)`,
              opacity: interpolate(progress, [0, 0.5], [1, 0]),
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Entering Word: Slides In from Right + Motion Blur */}
        {currentWord && (
          <div
            style={{
                position: "absolute",
                whiteSpace: "nowrap",
                transform: isTransitioning
                    ? `translateX(${interpolate(progress, [0, 1], [100, 0])}px) scale(${interpolate(progress, [0, 0.5, 1], [0.8, 1.1, 1])})`
                    : `scale(1)`,
                filter: isTransitioning 
                    ? `blur(${interpolate(progress, [0, 0.5, 1], [20, 10, 0])}px)` 
                    : "none",
                opacity: isTransitioning ? interpolate(progress, [0, 0.5], [0, 1]) : 1,
            }}
          >
            {currentWord}
          </div>
        )}
    </div>
  );
};

/**
 * SlicedStream: Words are sliced horizontally and slide together.
 * High-end fashion / cinematic look.
 */
export const SlicedStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 15,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  
  // Animation:
  // Top half slides in from Left
  // Bottom half slides in from Right
  // (Or Split Out for exit)
  
  // Actually, let's just animate the ENTRY. The EXIT can be a simple fade or slide out.
  // Or better: Current word splits out, New word splits in.
  
  const offset = isTransitioning 
      ? interpolate(progress, [0, 1], [100, 0], { easing: Easing.bezier(0.2, 1, 0.3, 1) })
      : 0;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* Previous Word (Fades out) */}
        {isTransitioning && prevIndex >= 0 && (
            <div style={{ position: "absolute", opacity: interpolate(progress, [0, 0.3], [1, 0]) }}>
                {words[prevIndex]}
            </div>
        )}

        {/* Current Word */}
        <div style={{ position: "relative" }}>
             {/* Top Half */}
             <div style={{ 
                 position: "absolute", 
                 top: 0, left: 0, 
                 clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                 transform: `translateX(${-offset}px)`,
                 opacity: isTransitioning ? interpolate(progress, [0, 0.2], [0, 1]) : 1
             }}>
                 {currentWord}
             </div>
             
             {/* Bottom Half */}
             <div style={{ 
                 position: "relative", // Keeps layout size
                 clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                 transform: `translateX(${offset}px)`,
                 opacity: isTransitioning ? interpolate(progress, [0, 0.2], [0, 1]) : 1
             }}>
                 {currentWord}
             </div>
        </div>
    </div>
  );
};

/**
 * TurbulenceStream: Words distort turbulently like heat haze or water.
 * Requires SVG filters.
 */
export const TurbulenceStream: React.FC<KineticStreamProps> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 20,
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  
  // Unique ID for filter
  const filterId = useMemo(() => `turb-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Distortion amount
  // 0 -> High -> 0
  const scale = isTransitioning 
      ? interpolate(progress, [0, 0.5, 1], [0, 50, 0]) // Displacement scale
      : 0;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
        {/* SVG Filter Definition */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
                <filter id={filterId}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} />
                </filter>
            </defs>
        </svg>

        {/* Previous Word (Fades out) */}
        {isTransitioning && prevIndex >= 0 && (
            <div style={{ position: "absolute", opacity: interpolate(progress, [0, 0.5], [1, 0]) }}>
                {words[prevIndex]}
            </div>
        )}

        {/* Current Word */}
        <div style={{ 
            position: "relative",
            filter: `url(#${filterId})`,
            opacity: isTransitioning ? interpolate(progress, [0, 0.5], [0, 1]) : 1,
            willChange: "filter",
        }}>
            {currentWord}
        </div>
    </div>
  );
};

/**
 * NeonStream: Flickering neon light effect.
 */
export const NeonStream: React.FC<KineticStreamProps & { neonColor?: string }> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "white",
  neonColor = "#ff00ff",
  className,
  style,
  transitionDuration = 5, // Short transition, mostly about the effect
  duration,
  delayAfterLastWord = 0,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const frame = useCurrentFrame();
  
  // Flicker effect
  // Random opacity jumps between 0.8 and 1, with occasional drops to 0.2
  // Deterministic random based on frame
  const noise = (f: number) => {
      return (Math.sin(f * 0.5) + Math.sin(f * 3.3) + Math.sin(f * 10)) / 3;
  };
  
  // Base flicker
  const opacity = 0.9 + noise(frame) * 0.1;
  
  // Text Shadow (Glow)
  const glow = `
    0 0 5px ${neonColor},
    0 0 10px ${neonColor},
    0 0 20px ${neonColor},
    0 0 40px ${neonColor}
  `;
  
  // Transition logic
  // Just hard cut or quick fade
  const transitionOpacity = isTransitioning 
    ? interpolate(progress, [0, 0.5], [0, 1])
    : 1;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize,
        fontWeight,
        color, // Core color usually white
        fontFamily: "inherit",
        ...style,
      }}
    >
         {/* Previous Word */}
         {isTransitioning && prevIndex >= 0 && (
            <div style={{ 
                position: "absolute", 
                opacity: interpolate(progress, [0, 0.2], [1, 0]),
                textShadow: glow 
            }}>
                {words[prevIndex]}
            </div>
        )}
        
        {/* Current Word */}
        <div style={{ 
            position: "relative",
            opacity: opacity * transitionOpacity,
            textShadow: glow,
        }}>
            {currentWord}
        </div>
    </div>
  );
};

export type PushDirection = "up" | "down" | "left" | "right";

/**
 * PushStream: Words push each other out in a specified direction.
 * Clean, high-energy kinetic typography effect.
 */
export const PushStream: React.FC<KineticStreamProps & { 
  direction?: PushDirection;
  /** Apply motion blur-like skew during movement */
  withSkew?: boolean;
}> = ({
  text,
  fontSize = 80,
  fontWeight = "bold",
  color = "currentColor",
  className,
  style,
  transitionDuration = 10,
  duration,
  delayAfterLastWord = 0,
  direction = "up",
  withSkew = true,
}) => {
  const words = useWords(text);
  const { currentIndex, prevIndex, isTransitioning, progress } = useStreamTiming(words.length, transitionDuration, duration, delayAfterLastWord);
  
  const currentWord = words[currentIndex];
  const prevWord = words[prevIndex];

  // Helper to calculate transform based on progress
  const getTransform = (type: "enter" | "exit", p: number) => {
    // Skew logic: Max skew in middle of movement
    const skewMax = 20;
    const currentSkew = withSkew 
      ? interpolate(p, [0, 0.2, 0.8, 1], [0, skewMax, skewMax, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;

    let x = "0", y = "0";
    let skewX = "0deg", skewY = "0deg";

    if (direction === "up") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [100, 0]);
          y = `${val}%`;
          skewY = `${-currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, -100]);
          y = `${val}%`;
          skewY = `${-currentSkew}deg`;
       }
    } else if (direction === "down") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [-100, 0]);
          y = `${val}%`;
          skewY = `${currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, 100]);
          y = `${val}%`;
          skewY = `${currentSkew}deg`;
       }
    } else if (direction === "left") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [100, 0]);
          x = `${val}%`;
          skewX = `${currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, -100]);
          x = `${val}%`;
          skewX = `${currentSkew}deg`;
       }
    } else if (direction === "right") {
       if (type === "enter") {
          const val = interpolate(p, [0, 1], [-100, 0]);
          x = `${val}%`;
          skewX = `${-currentSkew}deg`;
       } else {
          const val = interpolate(p, [0, 1], [0, 100]);
          x = `${val}%`;
          skewX = `${-currentSkew}deg`;
       }
    }

    return `translate3d(${x}, ${y}, 0) skew(${skewX}, ${skewY})`;
  };

  // Easing for smooth motion
  const easeProgress = isTransitioning 
    ? interpolate(progress, [0, 1], [0, 1], { 
        easing: Easing.bezier(0.2, 0.0, 0.2, 1),
        extrapolateRight: "clamp"
      }) 
    : 1;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontSize,
        fontWeight,
        color,
        fontFamily: "inherit",
        ...style,
      }}
    >
      <div style={{ position: "relative", textAlign: "center", display: "grid", placeItems: "center" }}>
        
        {/* Previous Word (Exiting) */}
        {isTransitioning && prevWord && (
          <div
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              transform: getTransform("exit", easeProgress),
              opacity: interpolate(easeProgress, [0.6, 1], [1, 0]),
              willChange: "transform, opacity",
            }}
          >
            {prevWord}
          </div>
        )}

        {/* Current Word (Entering or Static) */}
        {currentWord && (
          <div
            style={{
              position: isTransitioning ? "absolute" : "relative",
              whiteSpace: "nowrap",
              transform: isTransitioning 
                ? getTransform("enter", easeProgress)
                : "translate3d(0,0,0)",
              willChange: "transform",
              opacity: 1,
            }}
          >
            {currentWord}
          </div>
        )}
        
      </div>
    </div>
  );
};
