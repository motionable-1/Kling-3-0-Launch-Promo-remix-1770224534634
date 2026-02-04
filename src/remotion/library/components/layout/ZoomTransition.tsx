import React from 'react';
import { interpolate } from 'remotion';

export interface ZoomTransitionProps {
  children: React.ReactNode;
  progress: number; // 0 to 1
  startScale?: number;
  endScale?: number;
}

export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  children,
  progress,
  startScale = 1,
  endScale = 50,
}) => {
  const scale = interpolate(progress, [0, 1], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};
