# Shaders (GLSL, WebGLRenderer)

For WebGPURenderer use TSL node materials instead (`three/tsl`, see [scene-setup.md](scene-setup.md)); GLSL `ShaderMaterial` doesn't run there.

## ShaderMaterial template

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x3399ff) },
    uMap: { value: texture },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 4.0 + uTime) * 0.1;
      vec4 world = modelMatrix * vec4(pos, 1.0);
      vWorldPos = world.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal); // world-space normal (uniform scale)
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform sampler2D uMap;
    varying vec2 vUv;
    void main() {
      vec4 tex = texture2D(uMap, vUv);
      gl_FragColor = vec4(uColor * tex.rgb, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
});

// loop
material.uniforms.uTime.value = timer.getElapsed();
```

- ShaderMaterial provides `modelMatrix`, `modelViewMatrix`, `projectionMatrix`, `viewMatrix`, `normalMatrix`, `cameraPosition` and the attributes `position`, `normal`, `uv`. `RawShaderMaterial` provides nothing.
- End the fragment shader with `#include <tonemapping_fragment>` and `#include <colorspace_fragment>`, or colors look washed out/dark next to built-in materials.
- `texture2D`/`gl_FragColor` work (three maps them to GLSL 3.00). With `glslVersion: THREE.GLSL3` write `texture()`, `in`/`out` and `out vec4 fragColor` yourself.
- Uniform types: number → `float`/`int`, `Vector2/3/4` → `vec2/3/4`, `Color` → `vec3`, `Matrix3/4` → `mat3/4`, `Texture` → `sampler2D`, `CubeTexture` → `samplerCube`, arrays → `float u[3]`.
- `uniforms.x.value` must stay the same object; mutate it (`.value.set(...)`) or reassign `.value`, never replace `uniforms`.
- Lights, fog, shadows: set `lights: true` / `fog: true` and merge `THREE.UniformsLib` uniforms. That usually means `onBeforeCompile` on a built-in material is simpler.
- Shaders in files with Vite: `import frag from "./water.frag?raw"`.
- Per-instance data: `geometry.setAttribute("aOffset", new THREE.InstancedBufferAttribute(arr, 3))` on an `InstancedMesh` geometry, then `attribute vec3 aOffset;`. In custom shaders also apply `instanceMatrix` yourself: `#ifdef USE_INSTANCING pos = (instanceMatrix * vec4(pos, 1.0)).xyz; #endif`.

## Extending a built-in material (keeps PBR, lights, shadows)

```javascript
const material = new THREE.MeshStandardMaterial({ color: 0x88ccff });
const uniforms = { uTime: { value: 0 } };

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = uniforms.uTime; // shared reference, update via `uniforms`
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\nuniform float uTime;")
    .replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\ntransformed.y += sin(position.x * 4.0 + uTime) * 0.1;",
    );
};
material.customProgramCacheKey = () => "wave"; // distinct key if other variants share the material type

// loop
uniforms.uTime.value = timer.getElapsed();
```

Injection points: vertex `begin_vertex` (object-space `transformed`), `beginnormal_vertex` (`objectNormal`), `project_vertex`; fragment `color_fragment` (`diffuseColor`), `emissivemap_fragment` (`totalEmissiveRadiance`), `opaque_fragment` (final `outgoingLight`; formerly `output_fragment`). Read the chunk sources in `three/src/renderers/shaders/ShaderChunk/` before patching: names change between releases.

Displacing vertices in a shader doesn't update the shadow, the bounds or the raycasting. For shadows set `customDepthMaterial`/`customDistanceMaterial` with the same patch.

## Recipes (fragment snippets)

```glsl
// Fresnel / rim (world space; vNormal, vWorldPos from the template)
vec3 viewDir = normalize(cameraPosition - vWorldPos);
float fresnel = pow(1.0 - clamp(dot(viewDir, normalize(vNormal)), 0.0, 1.0), 3.0);
vec3 col = mix(baseColor, rimColor, fresnel);

// Hash + value noise
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

// Dissolve with glowing edge (uProgress 0 → 1)
float n = texture2D(uNoise, vUv).r;
if (n < uProgress) discard;
float edge = 1.0 - smoothstep(uProgress, uProgress + 0.05, n);
gl_FragColor = vec4(mix(baseColor, vec3(1.0, 0.5, 0.1) * 3.0, edge), 1.0);

// Gradients
vec3 linear = mix(colorA, colorB, vUv.y);
vec3 radial = mix(colorA, colorB, distance(vUv, vec2(0.5)) * 2.0);

// Branchless select
color = mix(colorB, colorA, step(0.5, value));
```

`discard` disables early-Z: avoid it on large full-screen surfaces. Prefer `alphaTest` on built-in materials.

## Debugging

- Visualize values: `gl_FragColor = vec4(vUv, 0.0, 1.0);`, `vec4(normalize(vNormal) * 0.5 + 0.5, 1.0)`.
- Compile errors print to the console with the line; `renderer.debug.checkShaderErrors` (true by default, set it to false in production for faster compiles).
- Print the final patched source: `console.log(shader.fragmentShader)` inside `onBeforeCompile`.
- Avoid first-use hitches: `renderer.compileAsync(scene, camera)` after loading.
