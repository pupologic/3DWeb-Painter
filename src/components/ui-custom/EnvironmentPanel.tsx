import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sun, Image as ImageIcon } from 'lucide-react';

interface EnvironmentPanelProps {
  matcapName: string | null;
  onMatcapChange: (matcap: string | null) => void;
  lightSetup: '3point' | 'directional' | 'ambient';
  onLightSetupChange: (setup: '3point' | 'directional' | 'ambient') => void;
  lightIntensity: number;
  onLightIntensityChange: (intensity: number) => void;
}

const MATCAPS = [
  { id: null, label: 'Nenhum' },
  { id: 'gray_clay_010001.png', label: 'Gray Clay' },
  { id: 'light_grey_010001.png', label: 'Light Grey' },
  { id: 'merge0001.png', label: 'Merge 1' },
  { id: 'merge0002.png', label: 'Merge 2' },
  { id: 'warm_clay_010001.png', label: 'Warm Clay' },
];

export const EnvironmentPanel: React.FC<EnvironmentPanelProps> = ({
  matcapName,
  onMatcapChange,
  lightSetup,
  onLightSetupChange,
  lightIntensity,
  onLightIntensityChange,
}) => {
  return (
    <div className="space-y-6 p-5 bg-[#09090b] rounded-xl border border-white/5 shadow-lg">
      <h3 className="text-zinc-100 font-semibold text-sm tracking-wide uppercase flex items-center gap-2">
        <Sun className="w-4 h-4 text-zinc-400" />
        Environment
      </h3>

      <div className="space-y-3">
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wide flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          MatCap
        </Label>
        <select
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-zinc-600"
          value={matcapName || ''}
          onChange={(e) => onMatcapChange(e.target.value === '' ? null : e.target.value)}
        >
          {MATCAPS.map(m => (
            <option key={m.id || 'none'} value={m.id || ''}>{m.label}</option>
          ))}
        </select>
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest">
          Overrides basic lighting
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-white/5">
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Lighting Setup</Label>
        <select
          className={`w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-zinc-600 ${matcapName ? 'opacity-50 cursor-not-allowed' : ''}`}
          value={lightSetup}
          onChange={(e) => onLightSetupChange(e.target.value as any)}
          disabled={matcapName !== null}
        >
          <option value="3point">3-Point Light</option>
          <option value="directional">Directional (Sun)</option>
          <option value="ambient">Ambient Only</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Light Intensity</Label>
          <span className="text-zinc-500 font-mono text-[10px]">{Math.round(lightIntensity * 100)}%</span>
        </div>
        <div className={matcapName ? 'opacity-50 pointer-events-none' : ''}>
          <Slider
            value={[lightIntensity]}
            onValueChange={([val]) => onLightIntensityChange(val)}
            min={0}
            max={2}
            step={0.05}
            className="w-full"
            disabled={matcapName !== null}
          />
        </div>
      </div>
    </div>
  );
};
