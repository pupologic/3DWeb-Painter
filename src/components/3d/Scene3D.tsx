import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { PaintableMesh } from './PaintableMesh';
import type { BrushSettings } from '@/hooks/use3DPaint';

interface Scene3DProps {
  brushSettings: BrushSettings;
  customGeometry?: THREE.BufferGeometry | null;
  showGrid?: boolean;
  showWireframe?: boolean;
  flatShading?: boolean;
  textureResolution?: number;
  backgroundColor?: string;
  matcapName?: string | null;
  lightSetup?: '3point' | 'directional' | 'ambient';
  lightIntensity?: number;
  onTextureChange?: (texture: THREE.CanvasTexture | null) => void;
  onLayerControlsReady?: (controls: any) => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  brushSettings,
  customGeometry,
  showGrid = true,
  showWireframe = false,
  flatShading = false,
  textureResolution = 2048,
  backgroundColor = '#1a1a1a',
  matcapName = null,
  lightSetup = '3point',
  lightIntensity = 1,
  onTextureChange,
  onLayerControlsReady,
}) => {
  const [cameraPosition] = useState<[number, number, number]>([0, 0, 8]);
  const controlsRef = useRef<any>(null);

  const handlePaintingChange = useCallback((isPainting: boolean) => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isPainting;
      controlsRef.current.enablePan = !isPainting;
      controlsRef.current.enableZoom = !isPainting;
      controlsRef.current.enableRotate = !isPainting;
    }
  }, []);

  const handleTextureChange = useCallback((texture: THREE.CanvasTexture | null) => {
    if (onTextureChange) {
      onTextureChange(texture);
    }
  }, [onTextureChange]);

  return (
    <div className="w-full h-full" style={{ backgroundColor }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={[backgroundColor]} />
        
        {/* Performance Stats */}
        <Stats />
        
        {/* Environment (fallback when no lights or just a small reflection) */}
        {!matcapName && <Environment preset="studio" />}
        
        {/* Grid */}
        {showGrid && (
          <Grid
            position={[0, -3, 0]}
            args={[20, 20]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#444444"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#666666"
            fadeDistance={25}
            fadeStrength={1}
            infiniteGrid
          />
        )}

        {/* Paintable Mesh */}
        <PaintableMesh
          brushSettings={brushSettings}
          customGeometry={customGeometry}
          onTextureChange={handleTextureChange}
          showWireframe={showWireframe}
          flatShading={flatShading}
          textureResolution={textureResolution}
          matcapName={matcapName}
          onPaintingChange={handlePaintingChange}
          onLayerControlsReady={onLayerControlsReady}
        />

        {/* Lights */}
        {lightSetup === '3point' && (
          <group>
            <ambientLight intensity={0.6 * lightIntensity} />
            <directionalLight position={[5, 5, 5]} intensity={1 * lightIntensity} />
            <directionalLight position={[-5, -5, -5]} intensity={0.5 * lightIntensity} />
            <pointLight position={[0, 5, 0]} intensity={0.5 * lightIntensity} />
          </group>
        )}
        
        {lightSetup === 'directional' && (
          <group>
            <ambientLight intensity={0.2 * lightIntensity} />
            <directionalLight position={[10, 10, 5]} intensity={1.5 * lightIntensity} />
          </group>
        )}

        {lightSetup === 'ambient' && (
          <ambientLight intensity={1.5 * lightIntensity} />
        )}

        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};
