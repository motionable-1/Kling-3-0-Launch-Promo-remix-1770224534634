import React, { type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * SearchBar variant styles.
 */
export type SearchBarVariant = "default" | "pill" | "minimal" | "glass";

/**
 * Props for SearchBar component.
 */
export interface SearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value?: string;
  /** Visual variant */
  variant?: SearchBarVariant;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Whether the input appears focused */
  focused?: boolean;
  /** Show search icon */
  showIcon?: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Background color */
  backgroundColor?: string;
  /** Border color */
  borderColor?: string;
  /** Focus ring color */
  focusColor?: string;
  /** Text color */
  textColor?: string;
  /** Placeholder color */
  placeholderColor?: string;
  /** Animate entrance */
  animate?: boolean;
  /** Animation delay in seconds */
  delay?: number;
  /** Additional styles */
  style?: CSSProperties;
}

const SearchIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

/**
 * Animated search bar component.
 *
 * @example
 * <SearchBar placeholder="Search..." variant="pill" width={320} />
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  variant = "default",
  width = 320,
  height = 44,
  focused = false,
  showIcon = true,
  icon,
  backgroundColor,
  borderColor,
  focusColor = "#3b82f6",
  textColor,
  placeholderColor,
  animate = true,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const animationDuration = 15;

  const progress = animate
    ? interpolate(frame - delayFrames, [0, animationDuration], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const opacity = progress;
  const translateY = (1 - progress) * 10;
  const scale = 0.95 + progress * 0.05;

  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case "pill":
        return {
          backgroundColor: backgroundColor || "#f1f5f9",
          border: `1px solid ${borderColor || "#e2e8f0"}`,
          borderRadius: height / 2,
        };
      case "minimal":
        return {
          backgroundColor: backgroundColor || "transparent",
          border: "none",
          borderBottom: `2px solid ${borderColor || "#e2e8f0"}`,
          borderRadius: 0,
        };
      case "glass":
        return {
          backgroundColor: backgroundColor || "rgba(255, 255, 255, 0.1)",
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          borderRadius: 12,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        };
      default:
        return {
          backgroundColor: backgroundColor || "#ffffff",
          border: `1px solid ${borderColor || "#e2e8f0"}`,
          borderRadius: 8,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isGlass = variant === "glass";

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 14px",
        boxSizing: "border-box",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        boxShadow: focused
          ? `0 0 0 3px ${focusColor}40, 0 1px 3px rgba(0,0,0,0.1)`
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s ease",
        ...variantStyles,
        ...style,
      }}
    >
      {showIcon && (
        <div
          style={{
            color: isGlass
              ? "rgba(255,255,255,0.6)"
              : placeholderColor || "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon || <SearchIcon />}
        </div>
      )}
      <div
        style={{
          flex: 1,
          fontSize: 15,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: value
            ? isGlass
              ? "rgba(255,255,255,0.95)"
              : textColor || "#1e293b"
            : isGlass
              ? "rgba(255,255,255,0.5)"
              : placeholderColor || "#94a3b8",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || placeholder}
      </div>
      {focused && (
        <div
          style={{
            width: 2,
            height: 20,
            backgroundColor: focusColor,
            borderRadius: 1,
            animation: "blink 1s infinite",
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
