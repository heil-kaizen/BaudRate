import React, { useState, useEffect, useRef } from 'react';
import Terminal from './components/Terminal';
import Scanlines from './components/Scanlines';
import Dashboard from './components/Dashboard';
import { ThemeColor, THEMES } from './utils/constants';

// Side Graphics Component (Pyramids + ZigZag + Particles)
const SideGraphics: React.FC<{ side: 'left' | 'right'; theme: ThemeColor }> = ({ side, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Persistent particle state
  const particles = useRef(Array.from({ length: 40 }, () => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.002 + Math.random() * 0.004,
    size: Math.random() * 2 + 1
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use ResizeObserver for robust sizing
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let frame = 0;
    let animationId: number;
    
    // Theme color setup
    const activeTheme = THEMES[theme];
    const color = activeTheme.hex;
    
    // Parse Hex to RGB for alpha usage
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const colorRGB = `${r}, ${g}, ${b}`;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      
      if (w === 0 || h === 0) {
          animationId = requestAnimationFrame(render);
          return;
      }

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      
      frame++;
      
      // --- 0. Background Particles ---
      particles.current.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = 1;
        
        ctx.globalAlpha = 0.5; // Increased opacity
        ctx.fillRect(p.x * w, p.y * h, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      // --- 1. Rotating Pyramid (Wireframe) & Rings ---
      const pySize = Math.min(w, 120) * 0.6; 
      const pyCx = w / 2;
      const pyCy = h * 0.2; // Position at top
      
      const angle = frame * 0.02;
      
      // Draw Holographic Rings
      ctx.beginPath();
      ctx.ellipse(pyCx, pyCy + 30, pySize * 1.6, pySize * 0.6, Math.sin(frame * 0.01) * 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${colorRGB}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([4, 15]);
      ctx.ellipse(pyCx, pyCy + 30, pySize * 1.9, pySize * 0.7, -frame * 0.015, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      // Tetrahedron vertices
      const vertices = [
        {x: 0, y: -1.2, z: 0},       // Top
        {x: 1, y: 0.5, z: 0},        // Base 1
        {x: -0.5, y: 0.5, z: 0.866}, // Base 2
        {x: -0.5, y: 0.5, z: -0.866} // Base 3
      ];
      
      const projected = vertices.map(v => {
        // Rotate Y
        let x = v.x * Math.cos(angle) - v.z * Math.sin(angle);
        let z = v.x * Math.sin(angle) + v.z * Math.cos(angle);
        
        // Rotate X (tilt)
        const tilt = 0.5;
        let y = v.y * Math.cos(tilt) - z * Math.sin(tilt);
        z = v.y * Math.sin(tilt) + z * Math.cos(tilt);
        
        const scale = 300 / (300 + z * 50); // Perspective
        return {
          x: pyCx + x * pySize * scale,
          y: pyCy + y * pySize * scale
        };
      });
      
      ctx.beginPath();
      // Connect Top to Base vertices
      [1, 2, 3].forEach(i => {
         ctx.moveTo(projected[0].x, projected[0].y);
         ctx.lineTo(projected[i].x, projected[i].y);
      });
      // Connect Base vertices
      ctx.moveTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[2].x, projected[2].y);
      ctx.lineTo(projected[3].x, projected[3].y);
      ctx.lineTo(projected[1].x, projected[1].y);
      ctx.stroke();
      
      // --- 2. ZigZag Wave (Middle) ---
      const waveTop = h * 0.4;
      const waveBot = h * 0.8;
      const waveAmp = w * 0.35;
      const wavePeriod = 50; 
      const scrollSpeed = 2;
      const yOffset = (frame * scrollSpeed) % wavePeriod;

      const drawWave = (offsetY: number, alpha: number, phaseShift: number) => {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = `rgba(${colorRGB}, ${alpha})`;
          
          let first = true;
          for (let y = waveTop; y <= waveBot; y += 5) {
             const relativeY = y + offsetY;
             const cycle = relativeY % wavePeriod;
             let phase = cycle / wavePeriod; 
             phase = (phase + phaseShift) % 1; // Shift

             let val = 0;
             if (phase < 0.5) val = phase * 2; 
             else val = 2 - (phase * 2);      
             
             const x = (w / 2) - waveAmp + (val * 2 * waveAmp);
             
             if (first) {
                 ctx.moveTo(x, y);
                 first = false;
             } else {
                 ctx.lineTo(x, y);
             }
          }
          ctx.stroke();
      };

      // Main Wave
      drawWave(yOffset, 1.0, 0);
      // Ghost Wave (Visual Echo)
      drawWave(yOffset - 15, 0.4, 0);

      // --- 3. Loading Bars (Bottom) ---
      const barTop = h * 0.85;
      const barCount = 3;
      const barHeight = 6;
      const barGap = 10;
      
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      for(let i=0; i<barCount; i++) {
        const y = barTop + i * (barHeight + barGap);
        const speed = 0.05 + (i * 0.03);
        const fill = (Math.sin(frame * speed) + 1) / 2;
        
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(10, y, w - 20, barHeight);
        ctx.fillRect(10, y, (w - 20) * fill, barHeight);
      }
      ctx.globalAlpha = 1.0;
      
      // --- 4. Glitch Effect ---
      if (Math.random() > 0.98) {
         const gx = Math.random() * w;
         const gy = Math.random() * h;
         const gw = Math.random() * 40;
         const gh = Math.random() * 10;
         ctx.fillStyle = `rgba(${colorRGB}, 0.8)`;
         ctx.fillRect(gx, gy, gw, gh);
      }

      // --- 5. Text Label ---
      ctx.font = '14px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = color;
      ctx.fillText(side === 'left' ? 'ENCRYPTING...' : 'DECRYPTING...', w/2, h * 0.96);
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(render);
    };
    render();
    
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [side, theme]);

  return <canvas ref={canvasRef} className="w-full h-full opacity-100" />;
};

// Ambient Background Component
const AmbientBackground: React.FC<{ theme: ThemeColor }> = ({ theme }) => {
  const activeTheme = THEMES[theme];

  return (
    // Changed z-index from -10 to 0 (or simply removed negative z-index) so it sits above the base background layer
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Grid Floor */}
      <div className="absolute bottom-[-30%] left-[-50%] right-[-50%] h-[60%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%)] [transform:perspective(600px)_rotateX(70deg)] opacity-40">
        <div className="w-full h-[200%] bg-[linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px] animate-[slide-v_10s_linear_infinite]" />
      </div>

      {/* Animated Side Graphics (Pyramids & ZigZags) */}
      <div className="absolute left-0 lg:left-4 top-0 bottom-0 w-28 lg:w-40 hidden md:block">
        <SideGraphics side="left" theme={theme} />
      </div>

      <div className="absolute right-0 lg:right-4 top-0 bottom-0 w-28 lg:w-40 hidden md:block">
        <SideGraphics side="right" theme={theme} />
      </div>
      
      {/* Decorative Server Lights Left/Right (Background) - Using Theme Color */}
      <div className="absolute left-2 top-1/4 bottom-1/4 w-1 hidden lg:flex flex-col gap-4 opacity-30">
        {Array.from({length: 8}).map((_, i) => (
             <div 
               key={`led-l-${i}`} 
               className="w-1 h-8 rounded-full animate-pulse" 
               style={{
                 backgroundColor: activeTheme.hex,
                 animationDuration: `${Math.random() + 0.5}s`,
                 boxShadow: `0 0 5px ${activeTheme.hex}`
               }} 
             />
        ))}
      </div>
      <div className="absolute right-2 top-1/4 bottom-1/4 w-1 hidden lg:flex flex-col gap-4 opacity-30">
        {Array.from({length: 8}).map((_, i) => (
             <div 
               key={`led-r-${i}`} 
               className="w-1 h-8 rounded-full animate-pulse" 
               style={{
                 backgroundColor: activeTheme.hex,
                 animationDuration: `${Math.random() + 0.5}s`,
                 boxShadow: `0 0 5px ${activeTheme.hex}`
               }} 
             />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeColor>(ThemeColor.AMBER);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewConfig, setViewConfig] = useState({ rotateX: 0, rotateY: 0 });
  
  const activeTheme = THEMES[theme];

  const toggleMode = () => {
    setIsTerminalMode(!isTerminalMode);
  };

  return (
    // Removed bg-[#050505] from here to allow proper layering
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden text-white">
      
      {/* 1. Base Background Layer (Deepest) */}
      <div className="fixed inset-0 bg-[#050505] -z-50" />

      {/* 2. Ambient Background Gradient (Deep) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] -z-40 opacity-80"></div>

      {/* 3. Ambient Animations (Middle Layer - now visible above background) */}
      <AmbientBackground theme={theme} />
      
      {/* Settings Modal (In-world style) */}
      {showSettings && (
        <div className={`absolute top-10 right-10 z-50 p-4 border bg-black/90 backdrop-blur-sm ${activeTheme.border} ${activeTheme.text} w-64 shadow-[0_0_20px_rgba(0,0,0,0.8)]`}>
          <h3 className="uppercase text-sm mb-4 border-b border-current pb-2">Display Config</h3>
          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase block mb-2 opacity-70">Phosphor Type</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(ThemeColor).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t as ThemeColor)}
                    className={`text-xs border px-2 py-1 uppercase transition-colors ${
                      theme === t 
                      ? 'bg-current text-black' 
                      : 'hover:bg-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase block mb-2 opacity-70">Screen Projection</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-4 font-mono">X</span>
                  <input 
                    type="range" 
                    min="-25" 
                    max="25" 
                    step="0.5"
                    value={viewConfig.rotateX} 
                    onChange={(e) => setViewConfig(prev => ({...prev, rotateX: parseFloat(e.target.value)}))}
                    className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-current"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-4 font-mono">Y</span>
                  <input 
                    type="range" 
                    min="-25" 
                    max="25" 
                    step="0.5"
                    value={viewConfig.rotateY} 
                    onChange={(e) => setViewConfig(prev => ({...prev, rotateY: parseFloat(e.target.value)}))}
                    className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-current"
                  />
                </div>
                <div className="flex justify-between text-[10px] opacity-50 pt-1 font-mono">
                   <button onClick={() => setViewConfig({rotateX: 0, rotateY: 0})} className="hover:text-white hover:underline">[RESET]</button>
                   <span>X:{viewConfig.rotateX.toFixed(1)} Y:{viewConfig.rotateY.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] opacity-50 pt-2 border-t border-white/10">
              SYS_ID: #8921-XG<br/>
              MEM: 64KB OK
            </div>
          </div>
        </div>
      )}

      {/* Control Panel (Sticky) */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`px-4 py-2 border border-gray-800 text-gray-500 hover:text-white hover:border-white font-mono uppercase text-xs transition-all backdrop-blur-md bg-black/40`}
        >
          {showSettings ? 'Hide Config' : 'Config'}
        </button>
        <button
          onClick={toggleMode}
          className={`px-6 py-2 border font-mono uppercase text-xs font-bold transition-all backdrop-blur-md bg-black/40 ${
            isTerminalMode
              ? 'border-red-900 text-red-900 hover:bg-red-900/20 hover:text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
              : `${activeTheme.border} ${activeTheme.text} hover:bg-white/10`
          }`}
          style={!isTerminalMode ? { boxShadow: `0 0 15px ${activeTheme.hex}40` } : undefined}
        >
          {isTerminalMode ? 'EXIT TERMINAL' : 'INITIALIZE'}
        </button>
      </div>

      {/* 4. Main Content (Top Layer) */}
      <div 
        className="relative z-10 w-[95vw] h-[85vh] md:w-[90vw] md:h-[80vh] lg:w-[1000px] lg:h-[700px]"
        style={{ perspective: '1000px' }}
      >
        {/* The Monitor Shell */}
        <div 
          className={`
            relative w-full h-full 
            rounded-[3rem]
            border-[3px] ${activeTheme.border}
            bg-black
            shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]
            overflow-hidden
            transition-all duration-300 ease-out
            ${activeTheme.glow}
            group
          `}
          style={{
             boxShadow: `0 0 40px ${activeTheme.hex}20, inset 0 0 120px rgba(0,0,0,0.9)`,
             transform: `rotateX(${viewConfig.rotateX}deg) rotateY(${viewConfig.rotateY}deg)`,
             transformStyle: 'preserve-3d'
          }}
        >
           {/* Screen Bezel / Curvature Vignette */}
           <div className={`absolute inset-0 pointer-events-none rounded-[3rem] border-[1px] opacity-30 ${activeTheme.border} blur-[1px] z-20`}></div>
           <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_90px_rgba(0,0,0,0.8)] rounded-[3rem]"></div>

          {/* CRT Effects Layer */}
          <Scanlines />

          {/* Content Layer */}
          <div className="relative h-full w-full crt-turn-on p-6 sm:p-8">
             {isTerminalMode ? (
               <Terminal theme={theme} setTheme={setTheme} isPowered={true} />
             ) : (
               <Dashboard theme={theme} />
             )}
          </div>

          {/* Screen Glare/Reflection */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none mix-blend-overlay z-30"></div>
        </div>
      </div>

    </div>
  );
};

export default App;