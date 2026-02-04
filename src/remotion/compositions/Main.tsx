import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
  Img,
  Audio,
  Sequence,
} from "remotion";
import { TextAnimation } from "../library/components/text/TextAnimation";
import { Glow } from "../library/components/effects/Glow";
import { TrimPath } from "../library/components/paths/TrimPath";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// Refresh on HMR
const hmrKey = Date.now();

// ===== COLOR PALETTE =====
const colors = {
  bg: "#0B0B0F",
  bgAlt: "#111118",
  neonRed: "#FF0033",
  cyan: "#00F0FF",
  white: "#FFFFFF",
  gray: "#8D99AE",
  darkGray: "#2B2D42",
};

// ===== MUSIC =====
const music = {
  // Dark cinematic electronic ambient
  bgTrack:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/music/1770224297936_e388x3y25r4_music_Cinematic_dark_elect.mp3",
};

// ===== SOUND EFFECTS (Custom Generated) =====
const sfx = {
  // Cinematic whoosh sweep for logo reveal
  whoosh:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/mp3/1770223291658_ffr9yrfyvj9_sfx_cinematic_whoosh_sweep__fast_f.sfx-cinematic-whoosh-sweep--fast-f",
  // Neon light electric buzz powering on for frame draw
  neonPowerOn:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/mp3/1770223295306_fjp63sjxqqt_sfx_neon_light_electric_buzz_power.sfx-neon-light-electric-buzz-power",
  // Deep cinematic impact hit for title reveal
  impact:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/mp3/1770223297840_9xohvwon0wd_sfx_deep_cinematic_impact_hit_with.sfx-deep-cinematic-impact-hit-with",
  // Soft digital UI pop for feature items
  blip:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/mp3/1770223300464_guwmt2873go_sfx_soft_digital_UI_pop_click__sub.sfx-soft-digital-UI-pop-click--sub",
  // Tech glitch slice for API badge
  slideIn:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/mp3/1770223302839_lngnhsp4ts_sfx_tech_glitch_slice_swoosh__digi.sfx-tech-glitch-slice-swoosh--digi",
};

// ===== FLOATING PARTICLES COMPONENT =====
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7.3) % 100;
    const y = (seed * 11.7) % 100;
    const size = 2 + (seed % 4);
    const speed = 0.3 + (seed % 0.5);
    const delay = seed % 60;

    const yOffset = Math.sin((frame + delay) / (fps * speed)) * 15;
    const opacity =
      0.1 + (Math.sin((frame + delay * 2) / (fps * 0.8)) + 1) * 0.15;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: i % 3 === 0 ? colors.neonRed : colors.cyan,
          opacity,
          transform: `translateY(${yOffset}px)`,
          filter: `blur(${size > 3 ? 1 : 0}px)`,
        }}
      />
    );
  });

  return <>{particles}</>;
};

// ===== GEOMETRIC BACKGROUND =====
const GeometricBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated gradient position
  const gradientX = 50 + Math.sin(frame / (fps * 3)) * 10;
  const gradientY = 50 + Math.cos(frame / (fps * 4)) * 10;

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${gradientX}% ${gradientY}%, ${colors.bgAlt} 0%, ${colors.bg} 70%)`,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${colors.darkGray}15 1px, transparent 1px),
            linear-gradient(90deg, ${colors.darkGray}15 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.3,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles count={25} />
    </AbsoluteFill>
  );
};

// ===== NEON FRAME COMPONENT =====
const NeonFrame: React.FC<{
  width: number;
  height: number;
  progress: number;
  borderRadius?: number;
  strokeWidth?: number;
}> = ({ width, height, progress, borderRadius = 16, strokeWidth = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // SVG strokes are centered on the path, so we draw the path at the center
  // of where we want the stroke. For the stroke's INNER edge to align with
  // the panel edge, we offset the path outward by half the stroke width.
  const halfStroke = strokeWidth / 2;
  const r = borderRadius + halfStroke;

  // Total SVG size includes the stroke extending outward
  const svgWidth = width + strokeWidth;
  const svgHeight = height + strokeWidth;

  // Path starts at halfStroke offset so inner edge of stroke aligns with panel
  const rectPath = `
    M ${r} ${halfStroke}
    L ${svgWidth - r} ${halfStroke}
    Q ${svgWidth - halfStroke} ${halfStroke}, ${svgWidth - halfStroke} ${r}
    L ${svgWidth - halfStroke} ${svgHeight - r}
    Q ${svgWidth - halfStroke} ${svgHeight - halfStroke}, ${svgWidth - r} ${svgHeight - halfStroke}
    L ${r} ${svgHeight - halfStroke}
    Q ${halfStroke} ${svgHeight - halfStroke}, ${halfStroke} ${svgHeight - r}
    L ${halfStroke} ${r}
    Q ${halfStroke} ${halfStroke}, ${r} ${halfStroke}
    Z
  `;

  // Pulsing glow effect after frame is drawn
  const pulseIntensity =
    progress >= 1 ? 60 + Math.sin(frame / (fps * 0.5)) * 15 : 60;

  return (
    <Glow
      color={colors.neonRed}
      intensity={pulseIntensity}
      layers={4}
      decay={1.2}
    >
      <TrimPath
        path={rectPath}
        start={0}
        end={progress}
        duration={2}
        stroke={colors.neonRed}
        strokeWidth={strokeWidth}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={svgWidth}
        height={svgHeight}
      />
    </Glow>
  );
};

// ===== GLASS PANEL DIMENSIONS (shared for frame alignment) =====
const PANEL_WIDTH = 520;
const PANEL_HEIGHT = 320;
const PANEL_BORDER_RADIUS = 16;

// ===== GLASS PANEL COMPONENT =====
const GlassPanel: React.FC<{
  children: React.ReactNode;
  visible: boolean;
  neonProgress: number;
}> = ({ children, visible, neonProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle floating animation
  const floatY = Math.sin(frame / (fps * 2)) * 8;
  const floatRotate = Math.sin(frame / (fps * 3)) * 0.5;

  const opacity = visible ? 1 : 0;
  const scale = visible ? 1 : 0.95;

  return (
    <div
      style={{
        position: "relative",
        transform: `translateY(${floatY}px) rotate(${floatRotate}deg) scale(${scale})`,
        opacity,
        transition: "opacity 0.3s, transform 0.3s",
      }}
    >
      {/* Glass effect container */}
      <div
        style={{
          position: "relative",
          width: PANEL_WIDTH,
          height: PANEL_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
          backdropFilter: "blur(20px)",
          borderRadius: PANEL_BORDER_RADIUS,
          border: `1px solid rgba(255,255,255,0.1)`,
          boxShadow: `
            0 25px 50px -12px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {children}
      </div>

      {/* Neon Frame - positioned to wrap around the glass panel */}
      <div
        style={{
          position: "absolute",
          top: -2, // Offset by half stroke width (4/2 = 2)
          left: -2,
          pointerEvents: "none",
        }}
      >
        <NeonFrame
          width={PANEL_WIDTH}
          height={PANEL_HEIGHT}
          progress={neonProgress}
          borderRadius={PANEL_BORDER_RADIUS}
        />
      </div>
    </div>
  );
};

// ===== FEATURE ITEM COMPONENT =====
const FeatureItem: React.FC<{
  icon: string;
  text: string;
  delay: number;
  frame: number;
  startFrame: number;
}> = ({ icon, text, delay, frame, startFrame }) => {
  const { fps } = useVideoConfig();
  const { fontFamily: interFont } = loadInter();

  const itemFrame = frame - startFrame - delay * fps;
  const progress = spring({
    frame: itemFrame,
    fps,
    config: { damping: 15, stiffness: 150, mass: 1 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const x = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `translateX(${x}px)`,
        marginBottom: 16,
      }}
    >
      <Img
        src={`https://api.iconify.design/ph/${icon}.svg?color=%2300F0FF&width=24`}
        width={24}
        height={24}
      />
      <span
        style={{
          fontFamily: interFont,
          fontSize: 18,
          color: colors.gray,
          fontWeight: 400,
          textWrap: "balance",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ===== MAIN COMPOSITION =====
export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fontFamily: bebasFont } = loadBebasNeue();
  const { fontFamily: interFont } = loadInter();

  // ===== TIMELINE =====
  const LOGO_REVEAL_START = 15;
  const NEON_DRAW_START = 45;
  const TITLE_START = 90;
  const FEATURES_START = 130;
  const OUTRO_START = 240;

  // Calculate neon frame progress (completes faster for full border visibility)
  const neonProgress = interpolate(
    frame,
    [NEON_DRAW_START, NEON_DRAW_START + 35],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  // Panel visibility
  const panelVisible = frame >= LOGO_REVEAL_START;

  // Logo scale animation
  const logoScale = spring({
    frame: frame - LOGO_REVEAL_START,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Title opacity
  const titleOpacity = interpolate(
    frame,
    [TITLE_START, TITLE_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Outro fade
  const outroOpacity = interpolate(
    frame,
    [OUTRO_START, OUTRO_START + 30],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      {/* Thumbnail generation */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      {/* ===== BACKGROUND MUSIC ===== */}
      <Audio src={music.bgTrack} volume={0.35} />

      {/* ===== SOUND EFFECTS ===== */}
      {/* Logo reveal whoosh */}
      <Sequence from={LOGO_REVEAL_START - 5}>
        <Audio src={sfx.whoosh} volume={0.6} />
      </Sequence>

      {/* Neon frame power-on */}
      <Sequence from={NEON_DRAW_START}>
        <Audio src={sfx.neonPowerOn} volume={0.5} />
      </Sequence>

      {/* Title reveal impact */}
      <Sequence from={TITLE_START}>
        <Audio src={sfx.impact} volume={0.4} />
      </Sequence>

      {/* Features pop in */}
      <Sequence from={FEATURES_START}>
        <Audio src={sfx.blip} volume={0.4} />
      </Sequence>

      <AbsoluteFill
        style={{ backgroundColor: colors.bg, opacity: outroOpacity }}
      >
        {/* Background layer */}
        <GeometricBackground />

        {/* Main content layer */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Glass Panel with Logo */}
          <GlassPanel visible={panelVisible} neonProgress={neonProgress}>
            {/* Kling 3.0 Logo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${logoScale})`,
              }}
            >
              {/* "Introducing" label */}
              <div style={{ opacity: titleOpacity >= 0.5 ? 1 : 0 }}>
                <TextAnimation
                  key={`intro-${hmrKey}`}
                  className="text-sm tracking-[0.3em] uppercase"
                  style={{
                    fontFamily: interFont,
                    color: colors.gray,
                    marginBottom: 16,
                  }}
                  startFrom={TITLE_START}
                  createTimeline={({ textRef, tl, SplitText }) => {
                    const split = new SplitText(textRef.current, {
                      type: "chars",
                    });
                    tl.fromTo(
                      split.chars,
                      { opacity: 0, y: 10 },
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.03,
                        ease: "power2.out",
                      },
                    );
                    return tl;
                  }}
                >
                  Introducing
                </TextAnimation>
              </div>

              {/* Main Logo Text */}
              <Glow color={colors.cyan} intensity={20} layers={2}>
                <TextAnimation
                  key={`logo-${hmrKey}`}
                  style={{
                    fontFamily: bebasFont,
                    fontSize: 120,
                    fontWeight: 400,
                    color: colors.white,
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                  }}
                  startFrom={LOGO_REVEAL_START}
                  createTimeline={({ textRef, tl, SplitText }) => {
                    const split = new SplitText(textRef.current, {
                      type: "chars",
                    });
                    tl.fromTo(
                      split.chars,
                      { opacity: 0, y: 80, rotationX: -90, scale: 0.5 },
                      {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.04,
                        ease: "back.out(1.7)",
                      },
                    );
                    return tl;
                  }}
                >
                  KLING 3.0
                </TextAnimation>
              </Glow>

              {/* Tagline */}
              <div style={{ opacity: frame >= TITLE_START + 20 ? 1 : 0 }}>
                <TextAnimation
                  key={`tagline-${hmrKey}`}
                  style={{
                    fontFamily: interFont,
                    fontSize: 24,
                    fontWeight: 300,
                    color: colors.cyan,
                    marginTop: 20,
                    letterSpacing: "0.1em",
                    textWrap: "balance",
                  }}
                  startFrom={TITLE_START + 20}
                  createTimeline={({ textRef, tl, SplitText }) => {
                    const split = new SplitText(textRef.current, {
                      type: "words",
                    });
                    tl.fromTo(
                      split.words,
                      { opacity: 0, filter: "blur(10px)" },
                      {
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power2.out",
                      },
                    );
                    return tl;
                  }}
                >
                  Cinematic AI Video Generation
                </TextAnimation>
              </div>
            </div>
          </GlassPanel>

          {/* Features Section */}
          <div
            style={{
              position: "absolute",
              bottom: 120,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 60,
            }}
          >
            <FeatureItem
              icon="video-bold"
              text="15-second videos with scene cuts"
              delay={0}
              frame={frame}
              startFrame={FEATURES_START}
            />
            <FeatureItem
              icon="microphone-bold"
              text="Native multi-language audio"
              delay={0.15}
              frame={frame}
              startFrame={FEATURES_START}
            />
            <FeatureItem
              icon="sparkle-bold"
              text="Best-in-class consistency"
              delay={0.3}
              frame={frame}
              startFrame={FEATURES_START}
            />
          </div>

          {/* API Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 50,
              opacity:
                frame >= FEATURES_START + 45
                  ? interpolate(
                      frame,
                      [FEATURES_START + 45, FEATURES_START + 60],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    )
                  : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 24px",
                background: `linear-gradient(90deg, ${colors.neonRed}20, transparent)`,
                borderLeft: `3px solid ${colors.neonRed}`,
                borderRadius: "0 8px 8px 0",
              }}
            >
              <span
                style={{
                  fontFamily: interFont,
                  fontSize: 14,
                  color: colors.gray,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Available via API on
              </span>
              <span
                style={{
                  fontFamily: bebasFont,
                  fontSize: 24,
                  color: colors.white,
                  letterSpacing: "0.05em",
                }}
              >
                fal.ai
              </span>
            </div>
          </div>
        </AbsoluteFill>

        {/* Red accent lines - decorative */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${colors.neonRed}, transparent)`,
            opacity: interpolate(frame, [0, 30], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${colors.neonRed}, transparent)`,
            opacity: interpolate(frame, [0, 30], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
    </>
  );
};
