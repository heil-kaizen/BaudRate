import React from 'react';

const Scanlines: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden h-full w-full rounded-[inherit]">
      {/* Scanline pattern */}
      <div 
        className="absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"
      />
      {/* Slow moving scanline bar */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,rgba(255,255,255,0.03)50%,rgba(0,0,0,0)100%)] bg-[length:100%_15%] animate-[scanline_8s_linear_infinite] pointer-events-none opacity-40" 
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
};

export default Scanlines;
