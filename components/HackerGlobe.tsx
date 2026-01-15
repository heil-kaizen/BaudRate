import React, { useEffect, useRef } from 'react';
import { ThemeColor, THEMES } from '../utils/constants';

interface HackerGlobeProps {
  theme: ThemeColor;
}

const HackerGlobe: React.FC<HackerGlobeProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Parent sizing
    const updateSize = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
    };
    updateSize();

    let rotation = 0;
    
    // Points generation
    const samples = 450;
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    const points: {y: number, theta: number, char: string}[] = [];
    const CHARS = ["0", "1", "x", "•", "+", "*"];

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i; 
        points.push({
            y: y,
            theta: theta,
            char: CHARS[Math.floor(Math.random() * CHARS.length)]
        });
    }

    let frameId: number;
    const activeTheme = THEMES[theme];

    const render = () => {
      if (!canvas || !ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.35;

      rotation += 0.005;

      ctx.fillStyle = activeTheme.hex;
      ctx.font = '12px "VT323"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw Globe
      points.forEach(pt => {
        const r_at_y = Math.sqrt(1 - pt.y * pt.y) * globeRadius;
        
        let x = r_at_y * Math.cos(pt.theta + rotation);
        let z = r_at_y * Math.sin(pt.theta + rotation);
        let y = pt.y * globeRadius;

        const tilt = 0.3; 
        let y_tilted = y * Math.cos(tilt) - z * Math.sin(tilt);
        let z_tilted = y * Math.sin(tilt) + z * Math.cos(tilt);
        
        const scale = 400 / (400 + z_tilted);
        const x2d = cx + x * scale;
        const y2d = cy + y_tilted * scale;
        
        const alpha = (z_tilted + globeRadius) / (2 * globeRadius);
        
        if (alpha > 0) {
            ctx.globalAlpha = Math.max(0.1, alpha); 
            ctx.fillText(pt.char, x2d, y2d);
        }
      });

      // Simple Ring
      ctx.strokeStyle = activeTheme.hex;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, globeRadius * 1.6, globeRadius * 0.6, rotation * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      frameId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', updateSize);
    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', updateSize);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
    />
  );
};

export default HackerGlobe;