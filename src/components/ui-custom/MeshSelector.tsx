import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, PencilLine } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MeshSelectorProps {
  modelName: string;
  onNameChange: (name: string) => void;
  onObjUpload?: (file: File) => void;
}

export const MeshSelector: React.FC<MeshSelectorProps> = ({
  modelName,
  onNameChange,
  onObjUpload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onObjUpload) {
      onObjUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-5 bg-[#09090b] rounded-xl border border-white/5 shadow-lg">
      <h3 className="text-zinc-100 font-semibold text-sm tracking-wide uppercase">MODEL</h3>
      
      <div className="relative">
        <Input 
          type="text"
          value={modelName}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-zinc-900 border-white/10 text-zinc-100 text-sm font-semibold pr-10 focus-visible:ring-1 focus-visible:ring-zinc-600 rounded-lg"
        />
        <PencilLine className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-6 border bg-zinc-800 border-zinc-500 text-zinc-100 shadow-md hover:bg-zinc-700"
        >
          <Box className="w-4 h-4" />
          <span className="text-xs font-medium tracking-wide">UPLOAD NEW OBJ</span>
        </Button>
        <input
          type="file"
          accept=".obj"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
