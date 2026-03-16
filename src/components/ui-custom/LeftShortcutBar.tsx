import React from 'react';
import { Brush, Eraser, Droplet, Hand, Undo2, Redo2, ArrowRightLeft, Layers, MousePointer2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker } from '@/components/ui-custom/ColorPicker';
import type { BrushSettings } from '@/hooks/useWebGLPaint';

export interface LeftShortcutBarProps {
  brushSettings: BrushSettings;
  setBrushSettings: (v: BrushSettings) => void;
  layerControls: any;
  isMaskEditing: boolean;
  setIsMaskEditing: (v: boolean) => void;
  primaryColor: string;
  setPrimaryColor: (v: string) => void;
  secondaryColor: string;
  setSecondaryColor: (v: string) => void;
  colorHistory: string[];
}

export const LeftShortcutBar: React.FC<LeftShortcutBarProps> = ({
  brushSettings,
  setBrushSettings,
  layerControls,
  isMaskEditing,
  setIsMaskEditing,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  colorHistory
}) => {
  const layerColorsRef = React.useRef({ primary: primaryColor, secondary: secondaryColor });

  const handleSwapColors = () => {
    const temp = primaryColor;
    setPrimaryColor(secondaryColor);
    setSecondaryColor(temp);
    setBrushSettings({ ...brushSettings, color: secondaryColor, secondaryColor: temp });
  };

  const handleColorChange = (newColor: string, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryColor(newColor);
      setBrushSettings({ ...brushSettings, color: newColor });
    } else {
      setSecondaryColor(newColor);
      setBrushSettings({ ...brushSettings, secondaryColor: newColor });
    }
  };

  return (
    <div 
      className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 flex flex-col justify-center pointer-events-none z-20"
      style={{
        '--bar-py': 'clamp(0.35rem, 1.8vh, 1.5rem)',
        '--bar-px': 'clamp(0.25rem, 1vh, 0.75rem)',
        '--bar-gap': 'clamp(0.15rem, 1vh, 0.75rem)',
        '--box-size': 'clamp(1.5rem, 4vh, 2.6rem)',
        '--icon-box': 'clamp(1.3rem, 3.5vh, 2.4rem)',
        '--slider-size-h': 'clamp(2.5rem, 12vh, 9rem)',
        '--slider-opacity-h': 'clamp(2rem, 8vh, 7rem)',
        maxHeight: 'calc(100vh - 8rem)'
      } as React.CSSProperties}
    >
      <div 
        className="bg-[#121214]/70 hover:bg-[#121214]/95 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 shadow-3xl flex flex-col items-center z-20 transition-all duration-300 group/sidebar pointer-events-auto overflow-y-auto no-scrollbar shrink-0"
        style={{
            padding: 'var(--bar-py) var(--bar-px)',
            gap: 'var(--bar-gap)',
        }}
      >
      
      {/* Layer/Mask Toggle */}
      <div className="flex flex-col items-center gap-1 group shrink-0">
        <div 
            className="relative shrink-0"
            style={{ width: 'var(--box-size)', height: 'var(--box-size)' }}
        >
          {/* Mask Square (Back) */}
          <div 
            className={`absolute right-0 bottom-0 rounded shadow-sm border cursor-pointer hover:scale-110 transition-all duration-200 overflow-hidden ${isMaskEditing ? 'z-10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/10 opacity-70 hover:opacity-100'}`}
            style={{ width: 'calc(var(--box-size) * 0.7)', height: 'calc(var(--box-size) * 0.7)' }}
            onClick={() => {
              if (isMaskEditing) return;
              
              const activeLayer = layerControls?.layers?.find((l: any) => l.id === layerControls.activeLayerId);
              if (activeLayer) {
                // Save current layer colors before switching to mask
                layerColorsRef.current = { primary: primaryColor, secondary: secondaryColor };
                
                if (!activeLayer.maskTarget) {
                  layerControls.createLayerMask?.(activeLayer.id);
                }
                layerControls.setEditingMask?.(activeLayer.id, true);
                setIsMaskEditing(true);
                
                // Set mask colors (White/Black)
                setPrimaryColor('#ffffff');
                setSecondaryColor('#000000');
                setBrushSettings({ ...brushSettings, color: '#ffffff' });
              }
            }}
            title="Mask"
          >
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full opacity-60" />
            </div>
          </div>
          {/* Layer Square (Front) */}
          <div 
            className={`absolute left-0 top-0 rounded shadow-md border cursor-pointer hover:scale-110 transition-all duration-200 overflow-hidden ${!isMaskEditing ? 'z-10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/10 opacity-70 hover:opacity-100'}`}
            style={{ width: 'calc(var(--box-size) * 0.7)', height: 'calc(var(--box-size) * 0.7)' }}
            onClick={() => {
              if (!isMaskEditing) return;

              if (layerControls?.activeLayerId) {
                layerControls.setEditingMask?.(layerControls.activeLayerId, false);
                setIsMaskEditing(false);
                
                // Restore layer colors
                setPrimaryColor(layerColorsRef.current.primary);
                setSecondaryColor(layerColorsRef.current.secondary);
                setBrushSettings({ ...brushSettings, color: layerColorsRef.current.primary });
              }
            }}
            title="Layer"
          >
            <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
              <Layers className="text-white/70" style={{ width: '50%', height: '50%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Dual Color Swatches */}
      <div className="flex flex-col items-center gap-1 relative mt-1 shrink-0">
        <div 
            className="relative shrink-0"
            style={{ width: 'var(--box-size)', height: 'var(--box-size)' }}
        >
          <Popover>
            <PopoverTrigger className="absolute right-0 bottom-0 z-0">
              <div 
                className="rounded-sm shadow-sm border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                style={{ 
                    backgroundColor: secondaryColor,
                    width: 'calc(var(--box-size) * 0.7)', 
                    height: 'calc(var(--box-size) * 0.7)' 
                }}
                title="Cor Secundária"
              />
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#121214] border-white/10 p-5" side="right" align="start">
              <ColorPicker 
                color={secondaryColor} 
                onColorChange={(c) => handleColorChange(c, false)} 
                recentColors={colorHistory}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="absolute left-0 top-0 z-10">
              <div 
                className="rounded-sm shadow-md border border-white/40 cursor-pointer hover:scale-110 transition-transform"
                style={{ 
                    backgroundColor: primaryColor,
                    width: 'calc(var(--box-size) * 0.7)', 
                    height: 'calc(var(--box-size) * 0.7)' 
                }}
                title="Cor Primária"
              />
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#121214] border-white/10 p-5" side="right" align="start">
              <ColorPicker 
                color={primaryColor} 
                onColorChange={(c) => handleColorChange(c, true)} 
                recentColors={colorHistory}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <button 
          onClick={handleSwapColors}
          className="absolute -top-1.5 -right-1.5 p-0.5 bg-[#1a1a1c] border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-20"
          title="Alternar Cores (X)"
        >
          <ArrowRightLeft className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="w-full h-px bg-white/10 my-0.5 shrink-0"/>

      {/* Tools */}
      <button 
        onClick={() => setBrushSettings({...brushSettings, mode: 'paint'})}
        className={`rounded-xl transition-all shrink-0 flex items-center justify-center ${brushSettings.mode !== 'erase' ? 'bg-zinc-700 text-zinc-100 shadow-md scale-110' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
        style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
        title="Paint"
      >
        <Brush style={{ width: '60%', height: '60%' }} />
      </button>
      <button 
        onClick={() => setBrushSettings({...brushSettings, mode: 'erase'})}
        className={`rounded-xl transition-all shrink-0 flex items-center justify-center ${brushSettings.mode === 'erase' ? 'bg-zinc-700 text-zinc-100 shadow-md scale-110' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
        style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
        title="Erase"
      >
        <Eraser style={{ width: '60%', height: '60%' }} />
      </button>

      <Popover>
        <PopoverTrigger asChild>
            <button 
              onClick={() => setBrushSettings({...brushSettings, mode: 'blur'})}
              className={`rounded-xl transition-all shrink-0 flex items-center justify-center ${brushSettings.mode === 'blur' ? 'bg-zinc-700 text-zinc-100 shadow-md scale-110' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
              style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
              title="Blur (Strength)"
            >
              <Droplet style={{ width: '60%', height: '60%' }} />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-12 h-40 p-3 bg-zinc-800 border-zinc-700">
            <div className="flex flex-col items-center h-full gap-2">
              <span className="text-[10px] text-zinc-400 font-medium">Blur</span>
              <Slider 
                orientation="vertical"
                value={[brushSettings.blurStrength || 1.0]}
                onValueChange={([val]) => setBrushSettings({...brushSettings, blurStrength: val})}
                min={0.1}
                max={4.0}
                step={0.1}
              />
            </div>
          </PopoverContent>
        </Popover>
  
        <Popover>
          <PopoverTrigger asChild>
            <button 
              onClick={() => setBrushSettings({...brushSettings, mode: 'smudge'})}
              className={`rounded-xl transition-all shrink-0 flex items-center justify-center ${brushSettings.mode === 'smudge' ? 'bg-zinc-700 text-zinc-100 shadow-md scale-110' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
              style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
              title="Smudge (Strength)"
            >
              <Hand style={{ width: '60%', height: '60%' }} />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-12 h-40 p-3 bg-zinc-800 border-zinc-700">
            <div className="flex flex-col items-center h-full gap-2">
              <span className="text-[10px] text-zinc-400 font-medium">Smudge</span>
              <Slider 
                orientation="vertical"
                value={[brushSettings.smudgeStrength !== undefined ? brushSettings.smudgeStrength : 1.0]}
                onValueChange={([val]) => setBrushSettings({...brushSettings, smudgeStrength: val})}
                min={0.1}
                max={3.0}
                step={0.1}
              />
            </div>
          </PopoverContent>
        </Popover>
        <button 
          onClick={() => setBrushSettings({...brushSettings, mode: 'gradient'})}
          className={`rounded-xl transition-all shrink-0 flex items-center justify-center ${brushSettings.mode === 'gradient' ? 'bg-zinc-700 text-zinc-100 shadow-md scale-110' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
          style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
          title="Gradient Tool"
        >
          <MousePointer2 className="rotate-45" style={{ width: '60%', height: '60%' }} />
        </button>
      
      {/* Sliders */}
      <div 
        className="w-6 py-1 flex justify-center shrink-0" 
        style={{ height: 'var(--slider-size-h)' }}
        title="Brush Size"
      >
        <Slider 
          orientation="vertical"
          value={[brushSettings.size]}
          onValueChange={([val]) => setBrushSettings({...brushSettings, size: val})}
          min={2}
          max={150}
          step={1}
          className="h-full"
        />
      </div>
      
      <div 
        className="w-6 py-1 flex justify-center shrink-0" 
        style={{ height: 'var(--slider-opacity-h)' }}
        title="Brush Opacity"
      >
        <Slider 
          orientation="vertical"
          value={[brushSettings.opacity]}
          onValueChange={([val]) => setBrushSettings({...brushSettings, opacity: val})}
          min={0.01}
          max={1}
          step={0.01}
          className="h-full"
        />
      </div>

      <div className="w-full h-px bg-white/10 my-0.5 shrink-0"/>

      <button 
        onClick={() => layerControls?.undo?.()}
        className="text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl transition-colors shrink-0 flex items-center justify-center"
        style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
        title="Undo"
      >
        <Undo2 style={{ width: '65%', height: '65%' }} />
      </button>
      <button 
        onClick={() => layerControls?.redo?.()}
        className="text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl transition-colors shrink-0 flex items-center justify-center"
        style={{ width: 'var(--icon-box)', height: 'var(--icon-box)' }}
        title="Redo"
      >
        <Redo2 style={{ width: '65%', height: '65%' }} />
      </button>

      </div>
    </div>
  );
};
