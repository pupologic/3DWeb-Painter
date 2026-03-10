import { useState, useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Scene3D } from '@/components/3d/Scene3D';
import { BrushControls } from '@/components/ui-custom/BrushControls';
import { ColorPicker } from '@/components/ui-custom/ColorPicker';
import { TexturePreview } from '@/components/ui-custom/TexturePreview';
import { MeshSelector } from '@/components/ui-custom/MeshSelector';
import { LayersPanel } from '@/components/ui-custom/LayersPanel';
import { EnvironmentPanel } from '@/components/ui-custom/EnvironmentPanel';
import type { BrushSettings } from '@/hooks/use3DPaint';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Paintbrush, Grid3X3, Box, Layers, Info, Github } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import suzanneObjStr from '@/models/Suzanne.obj?raw';
import './App.css';

function App() {
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    size: 20,
    color: '#ff0000',
    opacity: 1,
    hardness: 1,
    spacing: 0.25,
    type: 'circle',
  });

  const [modelName, setModelName] = useState<string>('Suzanne');
  const [customGeometry, setCustomGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [flatShading, setFlatShading] = useState(false);
  const [textureResolution, setTextureResolution] = useState<number>(2048);
  const [currentTexture, setCurrentTexture] = useState<THREE.CanvasTexture | null>(null);
  const [layerControls, setLayerControls] = useState<any>(null);
  
  // Environment controls
  const [matcapName, setMatcapName] = useState<string | null>(null);
  const [lightSetup, setLightSetup] = useState<'3point' | 'directional' | 'ambient'>('3point');
  const [lightIntensity, setLightIntensity] = useState<number>(1);

  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    try {
      const loader = new OBJLoader();
      const object = loader.parse(suzanneObjStr);
      let geometry: THREE.BufferGeometry | null = null;
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (!geometry) {
            geometry = child.geometry;
          }
        }
      });

      if (geometry) {
        let mergedGeometry: THREE.BufferGeometry = geometry as THREE.BufferGeometry;
        try {
          mergedGeometry = mergeVertices(geometry as THREE.BufferGeometry);
        } catch (e) {
          console.warn('Failed to merge vertices', e);
        }
        mergedGeometry.computeVertexNormals();
        setCustomGeometry(mergedGeometry);
      }
    } catch (err) {
      console.error('Failed to parse Suzanne.obj', err);
    }
  }, []);

  const handleTextureChange = useCallback((texture: THREE.CanvasTexture | null) => {
    setCurrentTexture(texture);
    textureRef.current = texture;
  }, []);

  const handleExport = useCallback(() => {
    if (textureRef.current && textureRef.current.image) {
      const canvas = textureRef.current.image as HTMLCanvasElement;
      const link = document.createElement('a');
      link.download = 'texture-paint.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Textura exportada com sucesso!');
    } else {
      toast.error('Nenhuma textura para exportar');
    }
  }, []);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (textureRef.current && textureRef.current.image) {
          const canvas = textureRef.current.image as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            textureRef.current.needsUpdate = true;
            toast.success('Textura importada com sucesso!');
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    if (layerControls?.clearCanvas) {
      layerControls.clearCanvas();
      toast.info('Textura limpa na camada ativa!');
    } else if (textureRef.current && textureRef.current.image) {
      const canvas = textureRef.current.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        textureRef.current.needsUpdate = true;
        toast.info('Cena limpa (Textura resetada)');
      }
    }
  }, [layerControls]);

  const handleObjUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      const loader = new OBJLoader();
      try {
        const object = loader.parse(contents);
        let geometry: THREE.BufferGeometry | null = null;
        
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (!geometry) {
              geometry = child.geometry;
            }
          }
        });

        if (geometry) {
          let mergedGeometry: THREE.BufferGeometry = geometry as THREE.BufferGeometry;
          try {
            mergedGeometry = mergeVertices(geometry as THREE.BufferGeometry);
          } catch (e) {
            console.warn('Failed to merge vertices', e);
          }
          mergedGeometry.computeVertexNormals();
          setCustomGeometry(mergedGeometry);
          setModelName(file.name.replace(/\.obj$/i, ''));
          toast.success('Modelo OBJ carregado com sucesso!');
        } else {
          toast.error('O arquivo OBJ não contém geometrias válidas.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Erro ao processar o arquivo OBJ.');
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <Toaster position="top-right" theme="dark" />
      
      <header className="bg-[#09090b] border-b border-white/5 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
            <Paintbrush className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 tracking-wide">3D TEXTURE PAINT</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Minimalist Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="grid" checked={showGrid} onCheckedChange={setShowGrid} className="scale-75 origin-right" />
            <Label htmlFor="grid" className="text-zinc-400 text-xs flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition-colors">
              <Grid3X3 className="w-3.5 h-3.5" />
              Grid
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch id="wireframe" checked={showWireframe} onCheckedChange={setShowWireframe} className="scale-75 origin-right" />
            <Label htmlFor="wireframe" className="text-zinc-400 text-xs flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition-colors">
              <Box className="w-3.5 h-3.5" />
              Wire
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="flatshading" checked={flatShading} onCheckedChange={setFlatShading} className="scale-75 origin-right" />
            <Label htmlFor="flatshading" className="text-zinc-400 text-xs flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition-colors">
              <Layers className="w-3.5 h-3.5" />
              Flat
            </Label>
          </div>

          <div className="w-px h-4 bg-white/10 mx-2" />

          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-[#09090b] border-r border-white/5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="p-5 space-y-6">
            <MeshSelector 
              modelName={modelName}
              onNameChange={setModelName}
              onObjUpload={handleObjUpload}
            />
            <ColorPicker color={brushSettings.color} onColorChange={(color) => setBrushSettings({ ...brushSettings, color })} />
            <BrushControls brushSettings={brushSettings} onBrushSettingsChange={setBrushSettings} />
            <EnvironmentPanel
              matcapName={matcapName}
              onMatcapChange={setMatcapName}
              lightSetup={lightSetup}
              onLightSetupChange={setLightSetup}
              lightIntensity={lightIntensity}
              onLightIntensityChange={setLightIntensity}
            />
            <LayersPanel layerControls={layerControls} />
            <TexturePreview 
              texture={currentTexture} 
              onClear={handleClear} 
              onExport={handleExport} 
              onImport={handleImport}
              resolution={textureResolution}
              onResolutionChange={setTextureResolution}
            />
          </div>
        </aside>

        <main className="flex-1 relative">
          <Scene3D
            brushSettings={brushSettings}
            customGeometry={customGeometry}
            showGrid={showGrid}
            showWireframe={showWireframe}
            flatShading={flatShading}
            textureResolution={textureResolution}
            matcapName={matcapName}
            lightSetup={lightSetup}
            lightIntensity={lightIntensity}
            onTextureChange={handleTextureChange}
            onLayerControlsReady={setLayerControls}
          />

          <div className="absolute bottom-4 left-4 bg-[#09090b]/80 backdrop-blur-md rounded-xl p-3 border border-white/5 shadow-2xl">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-zinc-500 mt-0.5" />
              <div className="text-xs text-zinc-400">
                <p className="font-semibold text-zinc-200 mb-1.5 font-mono text-[10px] uppercase tracking-wider">Controls</p>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-zinc-600">•</span> <strong>LMB</strong> to paint</li>
                  <li className="flex gap-2"><span className="text-zinc-600">•</span> <strong>RMB</strong> to orbit</li>
                  <li className="flex gap-2"><span className="text-zinc-600">•</span> <strong>Scroll</strong> to zoom</li>
                  <li className="flex gap-2"><span className="text-zinc-600">•</span> <strong>Shift+LMB</strong> to pan</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-[#09090b]/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ backgroundColor: brushSettings.color }} />
              <span className="text-xs text-zinc-400 font-mono tracking-wide">
                {brushSettings.size}PX <span className="text-zinc-700">|</span> {Math.round(brushSettings.opacity * 100)}%
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
