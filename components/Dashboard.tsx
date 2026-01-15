import React, { useState, useEffect, useRef } from 'react';
import HackerGlobe from './HackerGlobe';
import { ThemeColor, THEMES } from '../utils/constants';

interface DashboardProps {
  theme: ThemeColor;
}

const Waveform: React.FC<{ theme: ThemeColor }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    updateSize();

    let phase = 0;
    const activeTheme = THEMES[theme];

    let animationFrameId: number;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = activeTheme.hex;
      
      const cy = canvas.height / 2;
      const amplitude = canvas.height * 0.25;
      const frequency = 0.02;
      
      // Draw Grid points background with animation
      const gridSize = 20;
      const gridOffset = (phase * 10) % gridSize;
      
      ctx.globalAlpha = 0.2;
      for(let x = 0; x < canvas.width + gridSize; x += gridSize) {
        for(let y = 0; y < canvas.height; y += gridSize) {
            ctx.fillRect(x - gridOffset, y, 1, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw Wave
      const step = 8;
      for (let x = 0; x < canvas.width; x += step) {
        // Primary Wave
        const y1 = cy + Math.sin(x * frequency + phase) * amplitude;
        // Secondary Wave (harmonic)
        const y2 = cy + Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude * 0.5);
        
        // Draw diamond shape for primary
        ctx.beginPath();
        ctx.moveTo(x, y1 - 2);
        ctx.lineTo(x + 2, y1);
        ctx.lineTo(x, y1 + 2);
        ctx.lineTo(x - 2, y1);
        ctx.fill();

        // Draw simple dot for secondary
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, y2, 2, 2);
        ctx.globalAlpha = 1.0;
      }

      phase += 0.08;
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

const ProcessItem: React.FC<{ label: string; activeTheme: any; speed: number }> = ({ label, activeTheme, speed }) => {
  const [progress, setProgress] = useState(Math.random() * 40);

  useEffect(() => {
    // 30ms interval for fluid update (~30fps)
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If complete, loop back to 0
        if (prev >= 100) return 0;
        // Random increment based on speed
        const inc = Math.random() * 0.8 * speed;
        return prev + inc;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-xs font-mono tracking-tight opacity-90">
        <span className="truncate pr-2">{label}</span>
        <span className="whitespace-nowrap">{Math.floor(progress).toString().padStart(3, '0')}%</span>
      </div>
      <div className="w-full h-3 border border-current p-[1px] relative overflow-hidden">
        {/* Fill */}
        <div 
          className={`h-full ${activeTheme.bg} opacity-90`}
          style={{ 
            width: `${progress}%`,
            transition: 'width 30ms linear', // Linear transition matches interval for smooth look
            boxShadow: `0 0 8px ${activeTheme.hex}`
          }}
        ></div>
        
        {/* Subtle texture overlay on the bar */}
        <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.5)_2px,rgba(0,0,0,0.5)_4px)] opacity-30 pointer-events-none"></div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
  const activeTheme = THEMES[theme];

  return (
    <div className={`w-full h-full p-4 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 ${activeTheme.text}`}>
      
      {/* Top Left: Globe */}
      <div className={`relative border border-current p-2 flex flex-col`}>
        <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase tracking-widest">Network Topology</div>
        <div className="flex-1 min-h-0 overflow-hidden relative">
           <HackerGlobe theme={theme} />
           {/* Overlay Stats */}
           <div className="absolute top-2 right-2 text-[10px] text-right opacity-70 leading-tight">
             NODES: 4,096<br/>
             LATENCY: 12ms<br/>
             SECURE: TRUE
           </div>
        </div>
      </div>

      {/* Top Right: Signal Modulation */}
      <div className={`relative border border-current p-2 flex flex-col`}>
        <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase tracking-widest">Signal Modulation</div>
        <div className="flex-1 min-h-0 relative overflow-hidden flex items-center">
          
          {/* Y Axis Labels */}
          <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-[10px] opacity-70 z-10 font-mono">
             <span>1.0</span>
             <span>0.5</span>
             <span>0.0</span>
          </div>

          <div className="flex-1 h-full ml-6">
             <Waveform theme={theme} />
          </div>

           {/* X Axis Labels */}
           <div className="absolute bottom-1 left-8 right-2 flex justify-between text-[10px] opacity-60 font-mono">
             <span>00</span>
             <span>12</span>
             <span>24</span>
             <span>36</span>
             <span>48</span>
             <span>60</span>
           </div>
        </div>
      </div>

      {/* Bottom Left: Tasks */}
      <div className={`relative border border-current p-4 flex flex-col justify-center gap-4`}>
        <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase tracking-widest">Active Processes</div>
        
        <ProcessItem 
          label="[1] DOWNLOADING KERNEL.BIN" 
          activeTheme={activeTheme} 
          speed={1.2} 
        />
        <ProcessItem 
          label="[2] DECRYPTING NEURAL NET" 
          activeTheme={activeTheme} 
          speed={0.7} 
        />
        <ProcessItem 
          label="[3] UPLOADING TELEMETRY" 
          activeTheme={activeTheme} 
          speed={2.0} 
        />
      </div>

      {/* Bottom Right: Info */}
      <div className={`relative border border-current p-4 flex flex-col`}>
        <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase tracking-widest">System Messages</div>
        <div className="flex-1 overflow-hidden text-sm leading-snug opacity-90 font-mono">
          <p className="mb-2">{'>'} SYSTEM INITIALIZED AT 0800 HOURS.</p>
          <p className="mb-2">{'>'} DETECTED UNAUTHORIZED SIGNAL ON PORT 8080.</p>
          <p className="mb-2">{'>'} FIREWALL: ACTIVE</p>
          <p className="mb-2">{'>'} MEMORY INTEGRITY: 99.9%</p>
          <p className="animate-pulse mt-4 text-xs uppercase">
            Waiting for user input...
            <br/>
            [PRESS 'INITIALIZE' TO ACCESS TERMINAL]
          </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;