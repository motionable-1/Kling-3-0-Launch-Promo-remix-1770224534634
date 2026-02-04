import React, { CSSProperties, ReactNode } from "react";

export interface ReflectionProps {
  children: ReactNode;
  /** Opacity of the reflection (0-1) */
  opacity?: number;
  /** Blur of the reflection in pixels */
  blur?: number;
  /** Distance from the object in pixels */
  offset?: number;
  /** Vertical scale of the reflection (usually -1 for flip, but can be used for stretching) */
  scale?: number;
  /** Gradient mask fade start (0-1) */
  maskStart?: number;
  /** Gradient mask fade end (0-1) */
  maskEnd?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Creates a realistic floor reflection for the content.
 * 
 * @example
 * <Reflection opacity={0.3} blur={4} offset={10}>
 *   <ProductCard />
 * </Reflection>
 */
export const Reflection: React.FC<ReflectionProps> = ({
  children,
  opacity = 0.3,
  blur = 2,
  offset = 0,
  scale = 1,
  maskStart = 0.2,
  maskEnd = 1,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block", // Wrap content tightly
        ...style,
      }}
    >
      {/* Original Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>

      {/* Reflection */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: offset,
          transform: `scaleY(-${scale})`,
          transformOrigin: "top",
          opacity,
          filter: `blur(${blur}px)`,
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
          // Fade out reflection
          maskImage: `linear-gradient(to bottom, rgba(0,0,0,1) ${maskStart * 100}%, rgba(0,0,0,0) ${maskEnd * 100}%)`,
          WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) ${maskStart * 100}%, rgba(0,0,0,0) ${maskEnd * 100}%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Reflection;
