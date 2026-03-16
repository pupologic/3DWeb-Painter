import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Palette, Eclipse, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from './ColorPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MaterialPanelProps {
  color: string;
  onColorChange: (color: string) => void;
  colorHistory?: string[];
  saoEnabled: boolean;
  onSaoEnabledChange: (v: boolean) => void;
  saoIntensity: number;
  onSaoIntensityChange: (v: number) => void;
  saoScale: number;
  onSaoScaleChange: (v: number) => void;
  flatShading: boolean;
  onFlatShadingChange: (v: boolean) => void;
  pbrMode: boolean;
  onPbrModeChange: (v: boolean) => void;
}

export const MaterialPanel: React.FC<MaterialPanelProps> = ({
  color,
  onColorChange,
  colorHistory = [],
  saoEnabled,
  onSaoEnabledChange,
  saoIntensity,
  onSaoIntensityChange,
  saoScale,
  onSaoScaleChange,
  flatShading,
  onFlatShadingChange,
  pbrMode,
  onPbrModeChange
}) => {
  return (
    <div className="space-y-6 p-5 bg-[#09090b] rounded-xl border border-white/5 shadow-lg">
      <h3 className="text-zinc-100 font-semibold text-sm tracking-wide uppercase flex items-center gap-2">
        <Eclipse className="w-4 h-4 text-zinc-400" />
        Shader / Material
      </h3>

      <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-white/5 rounded-xl">
        <div className="space-y-0.5">
          <Label className="text-zinc-100 text-xs font-bold flex items-center gap-2">
            PBR MODE
          </Label>
          <p className="text-[10px] text-zinc-500 italic">Unlocks PBR channels & setup</p>
        </div>
        <Switch 
          checked={pbrMode}
          onCheckedChange={onPbrModeChange}
          className="data-[state=checked]:bg-blue-500"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wide flex items-center gap-1">
          <Palette className="w-3 h-3" />
          Base Color
        </Label>
        <div className="flex gap-3 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="w-10 h-10 rounded-lg border border-white/10 shrink-0 shadow-inner overflow-hidden cursor-pointer active:scale-95 transition-transform"
                style={{ backgroundColor: color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" side="right" align="start">
              <ColorPicker color={color} onColorChange={onColorChange} recentColors={colorHistory} />
            </PopoverContent>
          </Popover>
          <input 
            type="text" 
            value={color.toUpperCase()} 
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-zinc-600 font-mono uppercase"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Shading Style</Label>
            <p className="text-[10px] text-zinc-400">{flatShading ? 'Flat / Poligonal' : 'Smooth / Suave'}</p>
          </div>
          <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-lg">
             <button 
               onClick={() => onFlatShadingChange(false)}
               className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${!flatShading ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               SMOOTH
             </button>
             <button 
               onClick={() => onFlatShadingChange(true)}
               className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${flatShading ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               FLAT
             </button>
          </div>
        </div>

      </div>
      
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-zinc-100 text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Ambient Occlusion
            </Label>
            <p className="text-[10px] text-zinc-500">Realça as sombras nos detalhes 3D</p>
          </div>
          <Switch 
            checked={saoEnabled}
            onCheckedChange={onSaoEnabledChange}
          />
        </div>

        {saoEnabled && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Intensidade</Label>
                <span className="text-zinc-500 font-mono text-[10px]">{Math.round(saoIntensity * 100)}%</span>
              </div>
              <Slider
                value={[saoIntensity]}
                onValueChange={([val]) => onSaoIntensityChange(val)}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Escala (Alcance)</Label>
                <span className="text-zinc-500 font-mono text-[10px]">{saoScale.toFixed(1)}x</span>
              </div>
              <Slider
                value={[saoScale]}
                onValueChange={([val]) => onSaoScaleChange(val)}
                min={0.1}
                max={10.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
