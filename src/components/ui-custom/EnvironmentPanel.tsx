import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sun, Image as ImageIcon, Grid3X3 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface EnvironmentPanelProps {
  matcapName: string | null;
  onMatcapChange: (matcap: string | null) => void;
  lastMatcap: string;
  lightSetup: '3point' | 'directional' | 'ambient';
  onLightSetupChange: (setup: '3point' | 'directional' | 'ambient') => void;
  lightIntensity: number;
  onLightIntensityChange: (intensity: number) => void;
  showGrid?: boolean;
  setShowGrid?: (show: boolean) => void;
  focalLength: number;
  onFocalLengthChange: (val: number) => void;
  envIntensity: number;
  onEnvIntensityChange: (val: number) => void;
}

const MATCAPS = [
  { id: null, label: 'Nenhum' },
  { id: 'gray_clay_010001.png', label: 'Gray Clay' },
  { id: 'light_grey_010001.png', label: 'Light Grey' },
  { id: 'merge0001.png', label: 'Merge 1' },
  { id: 'merge0002.png', label: 'Merge 2' },
  { id: 'warm_clay_010001.png', label: 'Warm Clay' },
  { id: 'softlight_grey.png', label: 'Soft Light Grey' },
];

export const EnvironmentPanel: React.FC<EnvironmentPanelProps> = ({
  matcapName,
  onMatcapChange,
  lastMatcap,
  lightSetup,
  onLightSetupChange,
  lightIntensity,
  onLightIntensityChange,
  showGrid = true,
  setShowGrid,
  focalLength,
  onFocalLengthChange,
  envIntensity,
  onEnvIntensityChange,
}) => {
  const isMatcapEnabled = matcapName !== null;
  return (
    <div className="space-y-6 p-5 bg-[#09090b] rounded-xl border border-white/5 shadow-lg">
      <h3 className="text-zinc-100 font-semibold text-sm tracking-wide uppercase flex items-center gap-2">
        <Sun className="w-4 h-4 text-zinc-400" />
        Environment
      </h3>

      <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-white/5 rounded-xl mb-2">
        <Label className="text-zinc-100 text-xs font-bold flex items-center gap-2">
          MATCAP ENABLED
        </Label>
        <Switch 
          checked={isMatcapEnabled}
          onCheckedChange={(checked) => {
            if (checked) {
              onMatcapChange(lastMatcap || 'softlight_grey.png');
            } else {
              onMatcapChange(null);
            }
          }}
          className="data-[state=checked]:bg-blue-500"
        />
      </div>

      {isMatcapEnabled && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wide flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            MatCap Selection
          </Label>
          <select
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-zinc-600 font-bold"
            value={matcapName || ''}
            onChange={(e) => onMatcapChange(e.target.value === '' ? null : e.target.value)}
          >
            {MATCAPS.filter(m => m.id !== null).map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
            Overrides basic lighting
          </p>
        </div>
      )}

      {setShowGrid && (
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="grid-toggle"
              checked={showGrid} 
              onChange={(e) => setShowGrid(e.target.checked)} 
              className="accent-zinc-500 w-3.5 h-3.5"
            />
            <label htmlFor="grid-toggle" className="text-zinc-400 text-xs flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition-colors">
              <Grid3X3 className="w-3.5 h-3.5" />
              Grid
            </label>
          </div>
        </div>
      )}

      {!isMatcapEnabled && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-3 pt-2 border-t border-white/5">
            <Label className="text-zinc-500 text-[10px] uppercase tracking-wide font-bold">Lighting Setup</Label>
            <select
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-zinc-600 font-bold"
              value={lightSetup}
              onChange={(e) => onLightSetupChange(e.target.value as any)}
            >
              <option value="3point">3-Point Light</option>
              <option value="directional">Directional (Sun)</option>
              <option value="ambient">Ambient Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-zinc-500 text-[10px] uppercase tracking-wide font-bold">Light Intensity</Label>
              <span className="text-zinc-500 font-mono text-[10px]">{Math.round(lightIntensity * 100)}%</span>
            </div>
            <Slider
              value={[lightIntensity]}
              onValueChange={([val]) => onLightIntensityChange(val)}
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5 text-zinc-300">
            <div className="flex justify-between">
              <Label className="text-zinc-500 text-[10px] uppercase tracking-wide font-bold">Environment Strength</Label>
              <span className="text-zinc-500 font-mono text-[10px]">{Math.round(envIntensity * 100)}%</span>
            </div>
            <Slider
              value={[envIntensity]}
              onValueChange={([val]) => onEnvIntensityChange(val)}
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Environment rotation hidden temporarily 
      <div className="space-y-2 pt-2 border-t border-white/5 text-zinc-300">
        <div className="flex justify-between">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Environment Rotation</Label>
          <span className="text-zinc-500 font-mono text-[10px]">{Math.round(envRotation * (180 / Math.PI))}°</span>
        </div>
        <Slider
          value={[envRotation]}
          onValueChange={([val]) => onEnvRotationChange(val)}
          min={0}
          max={Math.PI * 2}
          step={0.01}
          className="w-full"
        />
      </div>
      */}

      <div className="space-y-2 pt-2 border-t border-white/5 text-zinc-300">
        <div className="flex justify-between">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Focal Length (mm)</Label>
          <span className="text-zinc-500 font-mono text-[10px]">{focalLength}MM</span>
        </div>
        <Slider
          value={[focalLength]}
          onValueChange={([val]) => onFocalLengthChange(val)}
          min={10}
          max={150}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
