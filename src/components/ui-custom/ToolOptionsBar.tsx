import React from 'react';
import { MousePointer2, Layout, Circle, Lock, Unlock, Ban } from 'lucide-react';
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
  const isLocked = gradientSession?.isLocked ?? true;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 md:gap-4 px-2 md:px-6 py-1.5 md:py-3 bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-w-[95vw] overflow-x-auto no-scrollbar">
      {/* Tool Icon & Label */}
      <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-6 border-r border-white/10 shrink-0">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
          <MousePointer2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 rotate-45" />
        </div>
        <span className="text-[10px] md:text-xs font-semibold text-zinc-100 uppercase tracking-widest hidden lg:block">Gradient Tool</span>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-black/40 rounded-xl border border-white/5 p-0.5 md:p-1 shrink-0">
        <button
          onClick={() => setBrushSettings({ ...brushSettings, gradientType: 'linear' })}
          className={`flex items-center justify-center gap-1.5 md:gap-2 py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-all ${
            brushSettings.gradientType === 'linear' 
              ? 'bg-zinc-700 text-zinc-100 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
          title="Linear Gradient"
        >
          <Layout className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="text-[9px] md:text-[11px] font-medium text-nowrap">Linear</span>
        </button>
        <button
          onClick={() => setBrushSettings({ ...brushSettings, gradientType: 'radial' })}
          className={`flex items-center justify-center gap-1.5 md:gap-2 py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-all ${
            brushSettings.gradientType === 'radial' 
              ? 'bg-zinc-700 text-zinc-100 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
          title="Radial Gradient"
        >
          <Circle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="text-[9px] md:text-[11px] font-medium text-nowrap">Radial</span>
        </button>
      </div>

      {/* Transparency Toggles & Preview */}
      <div className="flex items-center gap-1.5 md:gap-3 px-1.5 md:px-4 border-l border-white/10">
        <div className="flex flex-col items-center">
            <button
            onClick={() => setBrushSettings({ ...brushSettings, gradientColor1Transparent: !brushSettings.gradientColor1Transparent })}
            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border transition-all ${
                brushSettings.gradientColor1Transparent 
                ? 'bg-amber-500 border-amber-400 text-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                : 'bg-zinc-800 border-white/10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
            }`}
            title="Toggle Start Transparency"
            >
            {brushSettings.gradientColor1Transparent ? <Ban className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Circle className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />}
            </button>
        </div>

        {/* Gradient Preview with Checkerboard */}
        <div className="relative w-16 md:w-32 h-5 md:h-6 rounded-full border border-white/20 bg-zinc-950 p-[1px] shadow-inner overflow-hidden shrink-0">
          <div 
            className="absolute inset-0 opacity-20"
            style={{ 
              backgroundImage: `conic-gradient(#fff 90deg, #888 90deg 180deg, #fff 180deg 270deg, #888 270deg)`,
              backgroundSize: '8px 8px'
            }}
          />
          <div 
            className="relative w-full h-full rounded-full"
            style={{ 
              backgroundImage: `linear-gradient(to right, 
                ${brushSettings.gradientColor1Transparent ? 'transparent' : color1}, 
                ${brushSettings.gradientColor2Transparent ? 'transparent' : color2}
              )`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>

        <div className="flex flex-col items-center">
            <button
            onClick={() => setBrushSettings({ ...brushSettings, gradientColor2Transparent: !brushSettings.gradientColor2Transparent })}
            className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border transition-all ${
                brushSettings.gradientColor2Transparent 
                ? 'bg-amber-500 border-amber-400 text-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                : 'bg-zinc-800 border-white/10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
            }`}
            title="Toggle End Transparency"
            >
            {brushSettings.gradientColor2Transparent ? <Ban className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Circle className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />}
            </button>
        </div>
      </div>

      {/* Opacity Control */}
      <div className="flex items-center gap-1.5 md:gap-3 w-16 md:w-40 pl-1.5 md:pl-6 border-l border-white/10">
        <div className="flex-1">
          <Slider
            value={[brushSettings.opacity * 100]}
            max={100}
            step={1}
            onValueChange={(vals) => setBrushSettings({ ...brushSettings, opacity: vals[0] / 100 })}
            className="h-4"
          />
        </div>
        <span className="text-[9px] md:text-[10px] text-zinc-100 font-mono w-6 md:w-8 text-right shrink-0">{Math.round(brushSettings.opacity * 100)}%</span>
      </div>

      {/* Navigation Lock */}
      <div className="pl-2 md:pl-6 border-l border-white/10 flex items-center shrink-0">
        <button
          onClick={() => setGradientSession?.(prev => prev ? { ...prev, isLocked: !isLocked } : { isLocked: !isLocked, isCreating: false, start: new THREE.Vector3(), end: new THREE.Vector3(), mid: new THREE.Vector3() } as any)}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border flex items-center justify-center transition-all ${
            isLocked 
              ? 'bg-amber-500 border-amber-400 text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
              : 'bg-zinc-800 border-white/10 text-zinc-400 hover:bg-zinc-700'
          }`}
          title={isLocked ? "Lock Navigation (Paint Mode)" : "Unlock Navigation (Camera Mode)"}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" /> : <Unlock className="w-3.5 h-3.5 md:w-4 md:h-4" />}
        </button>
      </div>
    </div>
  );
};
