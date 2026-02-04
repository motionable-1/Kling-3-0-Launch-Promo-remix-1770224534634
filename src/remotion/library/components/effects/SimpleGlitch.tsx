import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SimpleGlitchProps {
  children: React.ReactNode;
  intensity?: number;
  active?: boolean;
}

export const SimpleGlitch: React.FC<SimpleGlitchProps> = ({ 
  children, 
  intensity = 5, 
  active = true 
}) => {
  const frame = useCurrentFrame();
  
  if (!active) return <>{children}</>;

  const offsetX = Math.sin(frame * 0.5) * intensity;
  const offsetY = Math.cos(frame * 0.3) * intensity;
  
  const jump = Math.random() > 0.95 ? intensity * 2 : 0;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${offsetX + jump}px, ${offsetY}px)`,
          opacity: 0.7,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(2px 0 red)',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${-offsetX - jump}px, ${-offsetY}px)`,
          opacity: 0.7,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(-2px 0 blue)',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};
