import React from 'react';
import { Input } from '@/components/ui/input';

interface TransformPanelProps {
  modelTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  onUpdateTransform: (transformType: 'position' | 'rotation' | 'scale', axis: 0 | 1 | 2 | 'all', value: number) => void;
}

export const TransformPanel: React.FC<TransformPanelProps> = ({
  modelTransform,
  onUpdateTransform,
}) => {
  return (
    <div className="space-y-4 p-5 bg-[#09090b] rounded-xl border border-white/5 shadow-lg">
      <h3 className="text-zinc-100 font-semibold text-sm tracking-wide uppercase">TRANSFORM</h3>
      
      <div className="space-y-4 pt-4 border-t border-white/10 mt-1">
        {/* Position */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-zinc-500 font-medium">Position</span>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axisLabel, i) => (
              <div key={`pos-${i}`} className="relative flex items-center">
                <span className="absolute left-2 text-[10px] text-zinc-600 font-mono">{axisLabel}</span>
                <Input 
                  type="number" 
                  step="0.1"
                  value={modelTransform.position[i as 0|1|2]}
                  onChange={(e) => onUpdateTransform('position', i as 0|1|2, parseFloat(e.target.value) || 0)}
                  className="h-8 text-[11px] text-zinc-100 pl-6 pr-2 bg-zinc-900 border-white/10 focus-visible:ring-1 focus-visible:ring-zinc-600 font-mono"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Rotation */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-zinc-500 font-medium">Rotation</span>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axisLabel, i) => (
              <div key={`rot-${i}`} className="relative flex items-center">
                <span className="absolute left-2 text-[10px] text-zinc-600 font-mono">{axisLabel}</span>
                <Input 
                  type="number" 
                  step="0.1"
                  value={modelTransform.rotation[i as 0|1|2]}
                  onChange={(e) => onUpdateTransform('rotation', i as 0|1|2, parseFloat(e.target.value) || 0)}
                  className="h-8 text-[11px] text-zinc-100 pl-6 pr-2 bg-zinc-900 border-white/10 focus-visible:ring-1 focus-visible:ring-zinc-600 font-mono"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Scale */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-zinc-500 font-medium">Uniform Scale</span>
          <div className="relative flex items-center">
            <span className="absolute left-2 text-[10px] text-zinc-600 font-mono">XYZ</span>
            <Input 
              type="number" 
              step="0.1"
              value={modelTransform.scale[0]}
              onChange={(e) => onUpdateTransform('scale', 'all', parseFloat(e.target.value) || 0)}
              className="h-8 text-[11px] text-zinc-100 pl-8 pr-2 bg-zinc-900 border-white/10 focus-visible:ring-1 focus-visible:ring-zinc-600 font-mono w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
