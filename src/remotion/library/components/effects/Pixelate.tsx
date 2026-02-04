import React from "react";

export interface PixelateProps {
  children: React.ReactNode;
  /** Pixel size in px */
  pixelSize?: number;
  /** Additional CSS class names */
  className?: string;
  /** Additional CSS styles */
  style?: React.CSSProperties;
}

export const Pixelate: React.FC<PixelateProps> = ({
  children,
  pixelSize = 10,
  className,
  style,
}) => {
  // SVG filter for pixelation
  // Logic: 
  // 1. Dilate/Erode is one way, but flood+composite is better for "mosaic".
  // Actually, a simpler approximation for DOM elements is strict upscaling or
  // using an SVG filter with feImage (complex).
  // The most reliable cross-browser way for *dynamic* content without Canvas 
  // is often SVG feMorphology (blocky) or a specific matrix, but true pixelation 
  // is hard with just CSS filters on vector content.
  // 
  // However, there is a trick using multiple SVG filters:
  // 1. Scale down using a transform
  // 2. Scale up using 'image-rendering: pixelated'
  // BUT that only works on Raster images usually.
  //
  // Let's use the SVG filter method:
  // <feFlood x="0" y="0" width="1" height="1" ... /> tile pattern?
  //
  // A robust method for "Mosaic" in SVG filters:
  // Unfortunately standard SVG filters don't have a direct "Mosaic" primitive.
  //
  // ALTERNATIVE: Use the CSS "backdrop-filter" trick if supported? No.
  //
  // Let's stick to a very high quality SVG filter implementation if possible.
  // Actually, for Remotion (Chrome/Headless), we can use a specific SVG filter chain.
  //
  // <filter id="pixelate" x="0" y="0">
  //   <feFlood x="2" y="2" height="1" width="1"/>
  //   <feComposite width="4" height="4"/>
  //   <feTile result="a"/>
  //   <feComposite in="SourceGraphic" in2="a" operator="in"/>
  //   <feMorphology operator="dilate" radius="2"/>
  // </filter>
  //
  // Wait, the standard "easy" way is actually not easy in CSS.
  // Let's assume we want a "Blocky" look. `feMorphology` dilate makes things look blocky.
  //
  // Better approach for general usage:
  // Simply wrap the content in a div that is scaled down and then scaled back up 
  // with `image-rendering: pixelated`. This is supported in Chrome (Remotion's engine).
  
  const scaleFactor = 1 / Math.max(1, pixelSize);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
        <div style={{
            width: `${100 / scaleFactor}%`,
            height: `${100 / scaleFactor}%`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
             // Force hardware acceleration and pixelated rendering
            imageRendering: "pixelated", 
        }}>
            {children}
        </div>
    </div>
  );
};
