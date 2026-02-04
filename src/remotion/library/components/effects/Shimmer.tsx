import React, { useMemo, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Props for the Shimmer component.
 */
export interface ShimmerProps {
  /** Width of the shimmer area */
  width?: number | string;
  /** Height of the shimmer area */
  height?: number | string;
  /** Base color */
  baseColor?: string;
  /** Highlight color */
  highlightColor?: string;
  /** Angle of the shimmer sweep in degrees */
  angle?: number;
  /** Duration of one shimmer cycle in seconds */
  duration?: number;
  /** Border radius */
  borderRadius?: number | string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
  children?: React.ReactNode;
}

/**
 * Shimmer/skeleton loading effect.
 *
 * @example
 * // Basic shimmer placeholder
 * <Shimmer width={200} height={20} />
 *
 * @example
 * // Rounded shimmer
 * <Shimmer width={100} height={100} borderRadius="50%" />
 *
 * @example
 * // Custom colors
 * <Shimmer
 *   width="100%"
 *   height={40}
 *   baseColor="#2a2a2a"
 *   highlightColor="#3a3a3a"
 * />
 */
export const Shimmer: React.FC<ShimmerProps> = ({
  width = 200,
  height = 20,
  baseColor = "#e0e0e0",
  highlightColor = "#f5f5f5",
  angle = -20,
  duration = 1.5,
  borderRadius = 4,
  style,
  className,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durationFrames = duration * fps;
  const progress = (frame % durationFrames) / durationFrames;

  // Calculate shimmer position (-100% to 200% to create sweep effect)
  const shimmerPosition = -100 + progress * 300;

  const shimmerStyle: CSSProperties = useMemo(
    () => ({
      width,
      height,
      borderRadius,
      background: `linear-gradient(
        ${angle}deg,
        ${baseColor} 0%,
        ${baseColor} 40%,
        ${highlightColor} 50%,
        ${baseColor} 60%,
        ${baseColor} 100%
      )`,
      backgroundSize: "200% 100%",
      backgroundPosition: `${shimmerPosition}% 0`,
      position: "relative" as const,
      overflow: "hidden",
      ...style,
    }),
    [
      width,
      height,
      borderRadius,
      angle,
      baseColor,
      highlightColor,
      shimmerPosition,
      style,
    ],
  );

  return (
    <div className={className} style={shimmerStyle}>
      {children}
    </div>
  );
};

/**
 * Props for ShimmerText - shimmer effect on text.
 */
export interface ShimmerTextProps {
  children: React.ReactNode;
  /** Base text color */
  baseColor?: string;
  /** Shimmer highlight color */
  highlightColor?: string;
  /** Duration of one shimmer cycle in seconds */
  duration?: number;
  /** Angle of the shimmer */
  angle?: number;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Shimmer effect applied to text.
 *
 * @example
 * <ShimmerText>
 *   <h1>Shimmering Title</h1>
 * </ShimmerText>
 */
export const ShimmerText: React.FC<ShimmerTextProps> = ({
  children,
  baseColor = "#666",
  highlightColor = "#fff",
  duration = 2,
  angle = 120,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durationFrames = duration * fps;
  const progress = (frame % durationFrames) / durationFrames;
  const shimmerPosition = -100 + progress * 300;

  const textStyle: CSSProperties = {
    background: `linear-gradient(
      ${angle}deg,
      ${baseColor} 0%,
      ${baseColor} 40%,
      ${highlightColor} 50%,
      ${baseColor} 60%,
      ${baseColor} 100%
    )`,
    backgroundSize: "200% 100%",
    backgroundPosition: `${shimmerPosition}% 0`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    ...style,
  };

  return (
    <span className={className} style={textStyle}>
      {children}
    </span>
  );
};

export default Shimmer;
