import React, { CSSProperties, ReactNode } from "react";
import { useCurrentFrame } from "remotion";

export interface NeonProps {
  children: ReactNode;
  /** Neon color */
  color?: string;
  /** Glow intensity (blur radius) */
  glow?: number;
  /** Flicker intensity (0-1) */
  flicker?: number;
  /** Flicker speed */
  flickerSpeed?: number;
  /** Inner color (usually white or lighter version of color) */
  innerColor?: string;
  /** Border width (if outlining box) */
  borderWidth?: number;
  /** Border radius */
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Neon glow effect container.
 * Adds a realistic neon glow with optional flickering.
 * 
 * @example
 * <Neon color="#ff0055" glow={20}>
 *   <Text>OPEN</Text>
 * </Neon>
 */
export const Neon: React.FC<NeonProps> = ({
  children,
  color = "#00ff00",
  glow = 15,
  flicker = 0.05,
  flickerSpeed = 1,
  innerColor = "#ffffff",
  borderWidth = 0,
  borderRadius = 0,
  className,
  style,
}) => {
  const frame = useCurrentFrame();

  // Flicker effect
  const flickerOp = flicker > 0
    ? 1 - (Math.random() * flicker * (Math.sin(frame * flickerSpeed) > 0 ? 1 : 0.5))
    : 1;

  const shadow = `
    0 0 ${glow * 0.2}px ${color},
    0 0 ${glow * 0.5}px ${color},
    0 0 ${glow}px ${color},
    0 0 ${glow * 2}px ${color},
    0 0 ${glow * 4}px ${color}
  `;
  
  const textShadow = `
    0 0 ${glow * 0.1}px ${innerColor},
    0 0 ${glow * 0.3}px ${color},
    0 0 ${glow * 0.6}px ${color},
    0 0 ${glow}px ${color}
  `;

  // Determine if we applying to text or box based on border
  const isBox = borderWidth > 0;

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        opacity: flickerOp,
        color: innerColor,
        textShadow: !isBox ? textShadow : undefined,
        boxShadow: isBox ? shadow : undefined,
        border: isBox ? `${borderWidth}px solid ${innerColor}` : undefined,
        borderRadius: isBox ? borderRadius : undefined,
        backgroundColor: isBox ? `${color}10` : "transparent", // Subtle background tint for boxes
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Neon;
