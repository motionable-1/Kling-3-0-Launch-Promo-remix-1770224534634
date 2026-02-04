import React from 'react';

export interface PerspectiveCardProps {
  children: React.ReactNode;
  className?: string;
  rotateX?: number;
  rotateY?: number;
  perspective?: number;
  shadowColor?: string;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  children,
  className,
  rotateX = 5,
  rotateY = -15,
  perspective = 1000,
  shadowColor = 'rgba(0, 0, 0, 0.25)',
}) => {
  return (
    <div
      className={className}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
          boxShadow: `0 25px 50px -12px ${shadowColor}`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};
