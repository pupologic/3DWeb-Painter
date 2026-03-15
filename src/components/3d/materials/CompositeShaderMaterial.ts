import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform sampler2D tBackground;
  uniform sampler2D tLayerMask;
  uniform float uOpacity;
  uniform float uIntensity;
  uniform bool uHasMask;
  uniform int uBlendMode; // 0: Normal, 1: Additive, 2: Subtractive, 3: Multiply, 4: Screen, 5: Overlay, 6: SoftLight, 7: HardLight, 8: Difference, 9: Erase
  
  varying vec2 vUv;

  vec3 blendOp(vec3 base, vec3 blend, int mode) {
    if (mode == 0) return blend; // Normal
    if (mode == 1) return base + blend; // Additive
    if (mode == 2) return max(base - blend, 0.0); // Subtractive
    if (mode == 3) return base * blend; // Multiply
    if (mode == 4) return base + (blend - base * blend) * 0.8; // Screen (Tamed)
    if (mode == 5) { // Overlay
      return mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, base));
    }
    if (mode == 6) { // Soft Light (Pegtop formula)
      return (1.0 - 2.0 * blend) * base * base + 2.0 * blend * base;
    }
    if (mode == 7) { // Hard Light
      return mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, blend));
    }
    if (mode == 8) return abs(base - blend); // Difference
    if (mode == 9) return max(base - blend, 0.0); // Erase (Subtractive)
    return blend;
  }
  
  void main() {
    vec4 texColor = texture2D(tDiffuse, vUv);
    vec4 bgColor = texture2D(tBackground, vUv);
    
    if (uHasMask) {
      vec4 maskColor = texture2D(tLayerMask, vUv);
      texColor.a *= (maskColor.a * maskColor.r);
    }
    
    float as = texColor.a * uOpacity;
    float ab = bgColor.a;
    vec3 Cs = texColor.rgb * uIntensity;
    vec3 Cb = bgColor.rgb;
    
    vec3 blended = blendOp(Cb, Cs, uBlendMode);
    
    float finalAlpha = max(ab, as);
    if (uBlendMode == 9) { // Erase mode
       finalAlpha = max(ab - as, 0.0);
    }
    
    gl_FragColor = vec4(mix(Cb, blended, as), finalAlpha);
  }
`;

export class CompositeShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        tBackground: { value: null },
        tLayerMask: { value: null },
        uOpacity: { value: 1.0 },
        uIntensity: { value: 1.0 },
        uHasMask: { value: false },
        uBlendMode: { value: 0 }
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
      blending: THREE.NoBlending // Handled manually in shader
    });
  }

  setLayer(texture: THREE.Texture, bgResult: THREE.Texture, opacity: number, blendMode: number, intensity: number = 1.0) {
    this.uniforms.tDiffuse.value = texture;
    this.uniforms.tBackground.value = bgResult;
    this.uniforms.uOpacity.value = opacity;
    this.uniforms.uIntensity.value = intensity;
    this.uniforms.uHasMask.value = false;
    this.uniforms.uBlendMode.value = blendMode;
  }

  setLayerMasked(texture: THREE.Texture, bgResult: THREE.Texture, maskTexture: THREE.Texture, opacity: number, blendMode: number, intensity: number = 1.0) {
    this.uniforms.tDiffuse.value = texture;
    this.uniforms.tBackground.value = bgResult;
    this.uniforms.tLayerMask.value = maskTexture;
    this.uniforms.uOpacity.value = opacity;
    this.uniforms.uIntensity.value = intensity;
    this.uniforms.uHasMask.value = true;
    this.uniforms.uBlendMode.value = blendMode;
  }
}
