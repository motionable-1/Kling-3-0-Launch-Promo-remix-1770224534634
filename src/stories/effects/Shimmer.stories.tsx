import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import {
  Shimmer,
  ShimmerText,
} from "../../remotion/library/components/effects";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Shimmer> = {
  title: "Effects/Shimmer",
  component: Shimmer,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f5f5f5">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    width: { control: { type: "range", min: 50, max: 400, step: 10 } },
    height: { control: { type: "range", min: 10, max: 100, step: 5 } },
    baseColor: { control: "color" },
    highlightColor: { control: "color" },
    angle: { control: { type: "range", min: -45, max: 45, step: 5 } },
    duration: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Shimmer>;

// ============================================
// BASIC EXAMPLES
// ============================================

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
  render: (args) => <Shimmer {...args} />,
};

export const CardSkeleton: Story = {
  render: () => (
    <div
      style={{
        width: 300,
        padding: 20,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Shimmer
        width={260}
        height={150}
        style={{ borderRadius: 8, marginBottom: 16 }}
      />
      <Shimmer width={200} height={20} style={{ marginBottom: 8 }} />
      <Shimmer width={260} height={14} style={{ marginBottom: 4 }} />
      <Shimmer width={180} height={14} />
    </div>
  ),
};

export const TextShimmer: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <div
      style={{ fontSize: 28, fontWeight: 700, fontFamily: "Inter, system-ui" }}
    >
      <ShimmerText baseColor="#666" highlightColor="#fff" duration={1.5}>
        Shimmering Text
      </ShimmerText>
    </div>
  ),
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Shimmer
        width={250}
        height={16}
        baseColor="#2a2a4e"
        highlightColor="#3a3a6e"
      />
      <Shimmer
        width={200}
        height={16}
        baseColor="#2a2a4e"
        highlightColor="#3a3a6e"
      />
      <Shimmer
        width={280}
        height={16}
        baseColor="#2a2a4e"
        highlightColor="#3a3a6e"
      />
    </div>
  ),
};

export const GoldTextShimmer: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#0f0f23">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <div
      style={{ fontSize: 32, fontWeight: 700, fontFamily: "Inter, system-ui" }}
    >
      <ShimmerText baseColor="#b8860b" highlightColor="#ffd700" duration={2}>
        Premium Gold
      </ShimmerText>
    </div>
  ),
};

export const MultiLineShimmer: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#0a0a0a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <div style={{ textAlign: "center", fontFamily: "Inter, system-ui" }}>
      <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>
        <ShimmerText baseColor="#444" highlightColor="#fff" duration={1.8}>
          LOADING
        </ShimmerText>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500 }}>
        <ShimmerText baseColor="#333" highlightColor="#888" duration={1.8}>
          Please wait while we prepare your content...
        </ShimmerText>
      </div>
    </div>
  ),
};

// ============================================
// PROFESSIONAL COMPOSITIONS
// ============================================

export const PremiumHeroText: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#0a0a0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 3,
          color: "#6366f1",
        }}
      >
        INTRODUCING
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          fontFamily: "Inter, system-ui",
        }}
      >
        <ShimmerText baseColor="#fff" highlightColor="#a5b4fc" duration={2}>
          The Future
        </ShimmerText>
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          fontFamily: "Inter, system-ui",
          marginTop: -8,
        }}
      >
        <ShimmerText baseColor="#6366f1" highlightColor="#c4b5fd" duration={2}>
          Is Here
        </ShimmerText>
      </div>
    </AbsoluteFill>
  ),
};

export const LuxuryBrandReveal: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#0f0f0f">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 9, letterSpacing: 6, color: "#666" }}>
        LUXURY COLLECTION
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 300,
          fontFamily: "Georgia, serif",
          letterSpacing: 5,
        }}
      >
        <ShimmerText
          baseColor="#8b7355"
          highlightColor="#d4af37"
          duration={2.5}
        >
          ELEGANCE
        </ShimmerText>
      </div>
      <div
        style={{
          width: 80,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #d4af37, transparent)",
        }}
      />
      <div
        style={{ fontSize: 9, letterSpacing: 4, color: "#555", marginTop: 4 }}
      >
        <ShimmerText baseColor="#555" highlightColor="#888" duration={2.5}>
          SINCE 1924
        </ShimmerText>
      </div>
    </AbsoluteFill>
  ),
};

export const AppLoadingState: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#fafafa">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 12, height: "100%" }}>
        {/* Sidebar skeleton */}
        <div
          style={{
            width: 120,
            background: "#fff",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Shimmer
            width={50}
            height={14}
            style={{ borderRadius: 4, marginBottom: 16 }}
          />
          {[90, 70, 80, 60, 75].map((w, i) => (
            <Shimmer
              key={i}
              width={w}
              height={8}
              style={{ borderRadius: 3, marginBottom: 10 }}
            />
          ))}
        </div>
        {/* Main content skeleton */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}
        >
          {/* Header */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div>
              <Shimmer
                width={100}
                height={16}
                style={{ borderRadius: 4, marginBottom: 6 }}
              />
              <Shimmer width={70} height={8} style={{ borderRadius: 3 }} />
            </div>
            <Shimmer width={28} height={28} style={{ borderRadius: "50%" }} />
          </div>
          {/* Stats cards */}
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 10,
                  padding: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Shimmer
                  width={40}
                  height={8}
                  style={{ borderRadius: 3, marginBottom: 8 }}
                />
                <Shimmer
                  width={60}
                  height={18}
                  style={{ borderRadius: 4, marginBottom: 4 }}
                />
                <Shimmer width={30} height={8} style={{ borderRadius: 3 }} />
              </div>
            ))}
          </div>
          {/* Chart area */}
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 10,
              padding: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Shimmer
              width={60}
              height={12}
              style={{ borderRadius: 4, marginBottom: 12 }}
            />
            <Shimmer width="100%" height={100} style={{ borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  ),
};

export const ChromeTextEffect: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#0a0a0a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          fontFamily: "Inter, system-ui",
          textTransform: "uppercase",
          letterSpacing: -1,
        }}
      >
        <ShimmerText
          baseColor="#888"
          highlightColor="#fff"
          duration={1.5}
          angle={15}
        >
          Chrome
        </ShimmerText>
      </div>
    </AbsoluteFill>
  ),
};

export const NotificationCardSkeleton: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={150} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}
      >
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Shimmer
              width={30}
              height={30}
              style={{ borderRadius: 8, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <Shimmer
                width={80}
                height={10}
                style={{ borderRadius: 3, marginBottom: 6 }}
              />
              <Shimmer width={120} height={8} style={{ borderRadius: 3 }} />
            </div>
            <Shimmer width={28} height={8} style={{ borderRadius: 3 }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  ),
};

export const AwardBadgeShimmer: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={180} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 30px rgba(251, 191, 36, 0.4)",
        }}
      >
        <div style={{ fontSize: 36 }}>🏆</div>
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "Inter, system-ui",
        }}
      >
        <ShimmerText
          baseColor="#fbbf24"
          highlightColor="#fef08a"
          duration={1.8}
        >
          Winner
        </ShimmerText>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 2 }}>
        <ShimmerText
          baseColor="#64748b"
          highlightColor="#94a3b8"
          duration={1.8}
        >
          BEST IN CLASS 2024
        </ShimmerText>
      </div>
    </AbsoluteFill>
  ),
};
