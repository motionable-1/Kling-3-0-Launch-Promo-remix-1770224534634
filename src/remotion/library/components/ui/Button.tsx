import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Button style variants.
 */
export type ButtonStyle =
  | "glossy"
  | "glass"
  | "neon"
  | "gradient"
  | "soft"
  | "outline"
  | "solid"
  | "pill"
  | "rounded"
  | "sharp";

/**
 * Button size variants.
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Props for Button component.
 */
export interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** Button style variant */
  variant?: ButtonStyle;
  /** Button size */
  size?: ButtonSize;
  /** Primary color */
  color?: string;
  /** Secondary color for gradients */
  secondaryColor?: string;
  /** Text color */
  textColor?: string;
  /** Icon to display before text */
  icon?: ReactNode;
  /** Icon to display after text */
  iconRight?: ReactNode;
  /** Whether button appears pressed */
  pressed?: boolean;
  /** Whether button appears disabled */
  disabled?: boolean;
  /** Animate on appear */
  animate?: boolean;
  /** Animation type */
  animationType?: "fadeIn" | "scaleIn" | "slideUp" | "bounce";
  /** Animation delay in seconds */
  delay?: number;
  /** Hover state simulation (for demos) */
  hover?: boolean;
  /** Additional styles */
  style?: CSSProperties;
  className?: string;
}

/**
 * Size configurations.
 */
const sizes: Record<
  ButtonSize,
  {
    padding: string;
    fontSize: number;
    height: number;
    borderRadius: number;
    gap: number;
  }
> = {
  xs: {
    padding: "6px 12px",
    fontSize: 12,
    height: 28,
    borderRadius: 6,
    gap: 4,
  },
  sm: {
    padding: "8px 16px",
    fontSize: 13,
    height: 34,
    borderRadius: 8,
    gap: 6,
  },
  md: {
    padding: "10px 20px",
    fontSize: 14,
    height: 40,
    borderRadius: 10,
    gap: 8,
  },
  lg: {
    padding: "12px 28px",
    fontSize: 16,
    height: 48,
    borderRadius: 12,
    gap: 10,
  },
  xl: {
    padding: "16px 36px",
    fontSize: 18,
    height: 56,
    borderRadius: 14,
    gap: 12,
  },
};

/**
 * Adjust color brightness.
 */
function adjustColor(hex: string, percent: number): string {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.min(255, Math.max(0, r + (r * percent) / 100));
  g = Math.min(255, Math.max(0, g + (g * percent) / 100));
  b = Math.min(255, Math.max(0, b + (b * percent) / 100));
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

/**
 * Convert hex to rgba.
 */
function hexToRgba(hex: string, alpha: number): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get styles for each button variant.
 */
function getVariantStyles(
  variant: ButtonStyle,
  color: string,
  secondaryColor: string,
  textColor: string,
  pressed: boolean,
  hover: boolean,
  borderRadius: number,
): CSSProperties {
  const darkerColor = adjustColor(color, -20);

  const baseStyles: CSSProperties = {
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
    transform: pressed ? "scale(0.96)" : hover ? "scale(1.02)" : "scale(1)",
  };

  switch (variant) {
    case "glossy": {
      // Modern glossy - subtle gradient with soft glow
      const slightlyLight = adjustColor(color, 8);
      const slightlyDark = adjustColor(color, -12);
      return {
        ...baseStyles,
        background: pressed
          ? `linear-gradient(180deg, ${slightlyDark} 0%, ${darkerColor} 100%)`
          : `linear-gradient(180deg, ${slightlyLight} 0%, ${color} 50%, ${slightlyDark} 100%)`,
        color: textColor,
        borderRadius,
        border: "none",
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.2)`
          : [
              // Subtle top highlight
              `inset 0 1px 0 rgba(255,255,255,0.15)`,
              // Soft outer glow
              `0 1px 2px rgba(0,0,0,0.1)`,
              `0 4px 12px ${hexToRgba(color, 0.25)}`,
              `0 8px 24px ${hexToRgba(color, 0.15)}`,
            ].join(", "),
        textShadow: "none",
      };
    }

    case "glass":
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: textColor,
        borderRadius,
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.1)`
          : `0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)`,
      };

    case "neon":
      return {
        ...baseStyles,
        background: "transparent",
        color: color,
        borderRadius,
        border: `2px solid ${color}`,
        boxShadow: pressed
          ? `0 0 5px ${color}, inset 0 0 10px ${color}40`
          : hover
            ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}60, inset 0 0 20px ${color}20`
            : `0 0 5px ${color}, 0 0 15px ${color}60`,
        textShadow: `0 0 10px ${color}`,
      };

    case "gradient":
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${color} 0%, ${secondaryColor} 100%)`,
        color: textColor,
        borderRadius,
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.2)`
          : `0 4px 15px ${color}40, 0 2px 6px rgba(0,0,0,0.1)`,
      };

    case "soft":
      return {
        ...baseStyles,
        background: `${color}15`,
        color: color,
        borderRadius,
        boxShadow: pressed ? "none" : hover ? `0 2px 8px ${color}20` : "none",
      };

    case "outline":
      return {
        ...baseStyles,
        background: pressed
          ? `${color}10`
          : hover
            ? `${color}08`
            : "transparent",
        color: color,
        borderRadius,
        border: `2px solid ${color}`,
        boxShadow: "none",
      };

    case "solid":
      return {
        ...baseStyles,
        background: color,
        color: textColor,
        borderRadius,
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.2)`
          : `0 2px 8px ${color}30`,
      };

    case "pill": {
      // Modern pill - clean with soft depth
      const pillLight = adjustColor(color, 6);
      const pillDark = adjustColor(color, -10);
      return {
        ...baseStyles,
        background: pressed
          ? `linear-gradient(180deg, ${pillDark} 0%, ${darkerColor} 100%)`
          : `linear-gradient(180deg, ${pillLight} 0%, ${color} 45%, ${pillDark} 100%)`,
        color: textColor,
        borderRadius: 999,
        border: "none",
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.15)`
          : [
              `inset 0 1px 0 rgba(255,255,255,0.12)`,
              `0 2px 6px rgba(0,0,0,0.08)`,
              `0 4px 16px ${hexToRgba(color, 0.2)}`,
            ].join(", "),
        textShadow: "none",
      };
    }

    case "rounded":
      return {
        ...baseStyles,
        background: color,
        color: textColor,
        borderRadius: borderRadius * 2,
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.15)`
          : `0 4px 12px rgba(0,0,0,0.12)`,
      };

    case "sharp":
      return {
        ...baseStyles,
        background: color,
        color: textColor,
        borderRadius: 0,
        boxShadow: pressed
          ? `inset 2px 2px 0 rgba(0,0,0,0.2)`
          : `4px 4px 0 ${darkerColor}`,
        transform: pressed ? "translate(2px, 2px)" : "translate(0, 0)",
      };

    default:
      return {
        ...baseStyles,
        background: color,
        color: textColor,
        borderRadius,
      };
  }
}

/**
 * Beautiful glossy button component with multiple style variants.
 *
 * @example
 * // Glossy button
 * <Button variant="glossy" color="#3b82f6">Click me</Button>
 *
 * @example
 * // Neon button
 * <Button variant="neon" color="#00ff88">Neon</Button>
 *
 * @example
 * // Gradient with icon
 * <Button variant="gradient" color="#667eea" secondaryColor="#764ba2" icon={<Icon />}>
 *   Get Started
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "glossy",
  size = "md",
  color = "#3b82f6",
  secondaryColor,
  textColor = "#ffffff",
  icon,
  iconRight,
  pressed = false,
  disabled = false,
  animate = false,
  animationType = "fadeIn",
  delay = 0,
  hover = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sizeConfig = sizes[size];
  const effectiveSecondaryColor = secondaryColor || adjustColor(color, -30);

  // Animation
  const delayFrames = Math.round(delay * fps);
  const animationProgress = useMemo(() => {
    if (!animate) return 1;
    const progress = interpolate(frame - delayFrames, [0, fps * 0.4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.5)),
    });
    return progress;
  }, [animate, frame, delayFrames, fps]);

  const animationStyles = useMemo((): CSSProperties => {
    if (!animate || animationProgress >= 1) return {};

    switch (animationType) {
      case "fadeIn":
        return { opacity: animationProgress };
      case "scaleIn":
        return {
          opacity: animationProgress,
          transform: `scale(${0.8 + animationProgress * 0.2})`,
        };
      case "slideUp":
        return {
          opacity: animationProgress,
          transform: `translateY(${(1 - animationProgress) * 20}px)`,
        };
      case "bounce":
        const bounceScale = interpolate(
          animationProgress,
          [0, 0.6, 0.8, 1],
          [0.3, 1.1, 0.95, 1],
          { extrapolateRight: "clamp" },
        );
        return {
          opacity: Math.min(animationProgress * 2, 1),
          transform: `scale(${bounceScale})`,
        };
      default:
        return {};
    }
  }, [animate, animationType, animationProgress]);

  const variantStyles = getVariantStyles(
    variant,
    color,
    effectiveSecondaryColor,
    textColor,
    pressed,
    hover,
    variant === "pill" ? 999 : sizeConfig.borderRadius,
  );

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeConfig.gap,
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        height: sizeConfig.height,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        boxSizing: "border-box",
        ...variantStyles,
        ...animationStyles,
        ...style,
      }}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      <span>{children}</span>
      {iconRight && (
        <span style={{ display: "flex", alignItems: "center" }}>
          {iconRight}
        </span>
      )}
    </div>
  );
};

// Preset button components

export const GlossyButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button {...props} variant="glossy" />
);

export const GlassButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button {...props} variant="glass" />
);

export const NeonButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button {...props} variant="neon" />
);

export const GradientButton: React.FC<Omit<ButtonProps, "variant">> = (
  props,
) => <Button {...props} variant="gradient" />;

export const SoftButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button {...props} variant="soft" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, "variant">> = (
  props,
) => <Button {...props} variant="outline" />;

export const PillButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button {...props} variant="pill" />
);

export default Button;
