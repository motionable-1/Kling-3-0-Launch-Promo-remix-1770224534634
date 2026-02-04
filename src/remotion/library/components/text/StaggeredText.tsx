import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StaggeredTextProps {
  text: string;
  className?: string;
  stagger?: number;
  style?: React.CSSProperties;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  className,
  stagger = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', ...style }}>
      {words.map((word, i) => {
        const delay = i * stagger;
        
        const opacity = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200, stiffness: 200 },
        });

        const translateY = spring({
          frame: frame - delay,
          fps,
          from: 20,
          to: 0,
          config: { damping: 12, stiffness: 100 },
        });

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
