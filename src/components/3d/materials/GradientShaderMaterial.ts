import * as THREE from 'three';

const vertexShader = `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    // Map UV to NDC (Normalized Device Coordinates) [-1, 1]
    gl_Position = vec4(uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uAlpha1;
  uniform float uAlpha2;
  uniform vec3 uStartPoint;
  uniform vec3 uEndPoint;
  uniform vec3 uPlaneNormal;
  uniform float uMidpoint; // 0.0 to 1.0 (default 0.5)
  uniform int uType; // 0: Linear, 1: Radial
  uniform float uOpacity;
  
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    float t = 0.0;
    
    // Project world position onto the camera plane defined by uStartPoint and uPlaneNormal
    vec3 projectedPos = vWorldPos - dot(vWorldPos - uStartPoint, uPlaneNormal) * uPlaneNormal;
    
    if (uType == 0) {
      // Linear Gradient
      vec3 dir = uEndPoint - uStartPoint;
      float lenSq = dot(dir, dir);
      if (lenSq > 0.00001) {
        t = dot(projectedPos - uStartPoint, dir) / lenSq;
      }
    } else {
      // Radial Gradient
      float dist = distance(projectedPos, uStartPoint);
      float maxDist = distance(uStartPoint, uEndPoint);
      if (maxDist > 0.00001) {
        t = dist / maxDist;
      }
    }
    
    t = clamp(t, 0.0, 1.0);
    
    // Apply midpoint bias
    if (uMidpoint != 0.5 && uMidpoint > 0.0 && uMidpoint < 1.0) {
      if (t < uMidpoint) {
        t = 0.5 * (t / uMidpoint);
      } else {
        t = 0.5 + 0.5 * ((t - uMidpoint) / (1.0 - uMidpoint));
      }
    }

    vec3 finalColor = mix(uColor1, uColor2, t);
    float finalAlpha = mix(uAlpha1, uAlpha2, t) * uOpacity;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

export class GradientShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor1: { value: new THREE.Color('#ff0000') },
        uColor2: { value: new THREE.Color('#0000ff') },
        uAlpha1: { value: 1.0 },
        uAlpha2: { value: 1.0 },
        uStartPoint: { value: new THREE.Vector3(0, 0, 0) },
        uEndPoint: { value: new THREE.Vector3(0, 1, 0) },
        uPlaneNormal: { value: new THREE.Vector3(0, 0, 1) },
        uMidpoint: { value: 0.5 },
        uType: { value: 0 },
        uOpacity: { value: 1.0 }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  setGradient(
    color1: string,
    color2: string,
    start: THREE.Vector3,
    end: THREE.Vector3,
    type: 'linear' | 'radial',
    cameraDirection: THREE.Vector3,
    opacity: number = 1.0,
    alpha1: number = 1.0,
    alpha2: number = 1.0,
    midpoint: number = 0.5
  ) {
    this.uniforms.uColor1.value.set(color1);
    this.uniforms.uColor2.value.set(color2);
    this.uniforms.uAlpha1.value = alpha1;
    this.uniforms.uAlpha2.value = alpha2;
    this.uniforms.uStartPoint.value.copy(start);
    this.uniforms.uEndPoint.value.copy(end);
    this.uniforms.uPlaneNormal.value.copy(cameraDirection).normalize();
    this.uniforms.uMidpoint.value = midpoint;
    this.uniforms.uType.value = type === 'linear' ? 0 : 1;
    this.uniforms.uOpacity.value = opacity;
  }
}
