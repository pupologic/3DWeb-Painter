import { MousePointer2, Layout, Circle, Lock, Unlock } from 'lucide-react';
import * as THREE from 'three';
import type { BrushSettings } from '@/hooks/useWebGLPaint';
import { Slider } from '@/components/ui/slider';
import type { GradientSession } from '@/components/3d/PaintableMesh';

interface ToolOptionsBarProps {
  brushSettings: BrushSettings;
  setBrushSettings: (settings: BrushSettings) => void;
  gradientSession?: GradientSession | null;
  setGradientSession?: React.Dispatch<React.SetStateAction<GradientSession | null>>;
}

export const ToolOptionsBar: React.FC<ToolOptionsBarProps> = ({ 
  brushSettings, 
  setBrushSettings,
  gradientSession,
  setGradientSession,
}) => {
  if (brushSettings.mode !== 'gradient') return null;

  const color1 = brushSettings.color;
  const color2 = brushSettings.secondaryColor || '#000000';
  const isLocked = gradientSession?.isLocked ?? true; // Default to locked (painting mode)

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 px-6 py-3 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Tool Icon & Label */}
      <div className="flex items-center gap-3 pr-6 border-r border-white/10">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
          <MousePointer2 className="w-4 h-4 text-amber-500 rotate-45" />
        </div>
        <span className="text-xs font-semibold text-zinc-100 uppercase tracking-widest">Gradient Tool</span>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-black/40 rounded-xl border border-white/5 p-1">
        <button
          onClick={() => setBrushSettings({ ...brushSettings, gradientType: 'linear' })}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
            brushSettings.gradientType === 'linear' 
              ? 'bg-zinc-700 text-zinc-100 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
          title="Linear Gradient"
        >
          <Layout className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium text-nowrap">Linear</span>
        </button>
        <button
          onClick={() => setBrushSettings({ ...brushSettings, gradientType: 'radial' })}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
            brushSettings.gradientType === 'radial' 
              ? 'bg-zinc-700 text-zinc-100 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
          title="Radial Gradient"
        >
          <Circle className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium text-nowrap">Radial</span>
        </button>
      </div>

      {/* Gradient Preview */}
      <div className="w-32 h-6 rounded-full border border-white/20 bg-black/40 p-[1px] shadow-inner overflow-hidden mx-2">
        <div 
          className="w-full h-full rounded-full"
          style={{ 
            background: `linear-gradient(to right, ${color1}, ${color2})`,
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>

      {/* Opacity Control */}
      <div className="flex items-center gap-3 w-40 pl-4 border-l border-white/10">
        <div className="flex-1">
          <Slider
            value={[brushSettings.opacity * 100]}
            max={100}
            step={1}
            onValueChange={(vals) => setBrushSettings({ ...brushSettings, opacity: vals[0] / 100 })}
            className="h-4"
          />
        </div>
        <span className="text-[10px] text-zinc-100 font-mono tracking-tighter w-8 text-right">{Math.round(brushSettings.opacity * 100)}%</span>
      </div>

      <div className="pl-6 border-l border-white/10 flex items-center">
        <button
          onClick={() => setGradientSession?.(prev => prev ? { ...prev, isLocked: !isLocked } : { isLocked: !isLocked, isCreating: false, start: new THREE.Vector3(), end: new THREE.Vector3(), mid: new THREE.Vector3() } as any)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
            isLocked 
              ? 'bg-amber-500 border-amber-400 text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
              : 'bg-zinc-800 border-white/10 text-zinc-400 hover:bg-zinc-700'
          }`}
          title={isLocked ? "Lock Navigation (Paint Mode)" : "Unlock Navigation (Camera Mode)"}
        >
          {isLocked ? <Lock className="w-4 h-4 fill-current" /> : <Unlock className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
