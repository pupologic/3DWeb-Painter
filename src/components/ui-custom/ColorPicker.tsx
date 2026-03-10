import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onColorChange,
}) => {
  const [customColor, setCustomColor] = useState(color);

  const handleColorClick = (newColor: string) => {
    onColorChange(newColor);
    setCustomColor(newColor);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      onColorChange(newColor);
    }
  };

  return (
    <div className="space-y-5 p-5 bg-[#09090b] rounded-xl border border-white/5 shadow-lg">
      <h3 className="text-zinc-100 font-semibold text-sm tracking-wide uppercase">Colors</h3>
      
      {/* Current Color Display */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-md border border-white/10 ring-4 ring-[#09090b]"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">HEX</Label>
          <Input
            type="text"
            value={customColor}
            onChange={handleCustomColorChange}
            className="mt-1 bg-transparent border-white/10 text-zinc-300 text-xs focus-visible:ring-1 focus-visible:ring-zinc-600 font-mono"
            placeholder="#000000"
          />
        </div>
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wide">Picker</Label>
          <div className="mt-1 relative w-10 h-10 rounded-md overflow-hidden border border-white/10">
            <Input
              type="color"
              value={color}
              onChange={(e) => handleColorClick(e.target.value)}
              className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer p-0 border-0"
            />
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div className="pt-2">
        <Label className="text-zinc-500 text-[10px] tracking-wide uppercase mb-3 block">Preset Palette</Label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => handleColorClick(presetColor)}
              className={`w-full aspect-square rounded-md border transition-all hover:scale-110 ${
                color === presetColor ? 'border-white scale-110 ring-2 ring-zinc-800' : 'border-white/5'
              }`}
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>

      {/* Recent Colors */}
      <div className="hidden">
        {/* Hiding recent colors for ultra-minimalism, but kept logically to not break anything if used */}
      </div>
    </div>
  );
};
