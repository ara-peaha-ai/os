# Post-processing

## EffectComposer (WebGLRenderer)

```javascript
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FXAAPass } from "three/addons/postprocessing/FXAAPass.js";

const composer = new EffectComposer(renderer); // picks up renderer pixel ratio
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.6, 0.4, 0.9); // strength, radius, threshold
composer.addPass(bloom);
composer.addPass(new OutputPass()); // tone mapping + sRGB: after the HDR effects
composer.addPass(new FXAAPass()); // FXAA works on the final sRGB image

// resize: renderer.setSize(w, h); composer.setSize(w, h);  (passes resize themselves)
// loop:   composer.render();  instead of renderer.render()
```

- `renderer.toneMapping` is applied by `OutputPass`, not by the RenderPass. Without OutputPass the image is linear and dark/washed out.
- `antialias: true` on the renderer doesn't apply inside the composer. Use `SMAAPass` before OutputPass or `FXAAPass` after it, or an MSAA target: `new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 }))`.
- Toggle without rebuilding: `pass.enabled = false`. Every pass is a full-screen draw, so on mobile drop the expensive ones or render the composer at a lower size.
- `composer.dispose()` on teardown.

## Effects (all in `three/addons/postprocessing/` unless noted)

| Effect | Construct | Notes |
|---|---|---|
| Bloom | `UnrealBloomPass(resolution, strength, radius, threshold)` | Glow from bright pixels; emissive > 1 + threshold ≈ 1 = only emissive objects glow |
| Outline | `OutlinePass(resolution, scene, camera)` | `selectedObjects = [mesh]`, `edgeStrength`, `edgeThickness`, `visibleEdgeColor`, `hiddenEdgeColor` |
| SSAO | `SSAOPass(scene, camera, w, h)` or `GTAOPass(scene, camera, w, h)` | GTAO looks better; `output` modes for debugging (`SSAOPass.OUTPUT.SSAO`) |
| Depth of field | `BokehPass(scene, camera, { focus, aperture, maxblur })` | Update `uniforms.focus.value` with the focus distance |
| FXAA / SMAA | `new FXAAPass()` / `new SMAAPass()` | FXAA after OutputPass, SMAA before it (linear input) |
| Film grain | `FilmPass(intensity, grayscale)` | |
| Glitch | `GlitchPass()` | `goWild = true` for constant glitching |
| Pixelate | `RenderPixelatedPass(pixelSize, scene, camera)` | Replaces the RenderPass |
| Halftone | `HalftonePass(params)` | `{ shape, radius, rotateR, rotateG, rotateB, scatter, blending, greyscale }` |
| After image | `AfterimagePass(damp)` | Motion trails |
| Vignette, color correction, sepia, RGB shift | `ShaderPass(VignetteShader)` etc. from `three/addons/shaders/` | `pass.uniforms.offset.value = ...` |

## Custom pass

```javascript
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const chromatic = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, amount: { value: 0.004 } }, // tDiffuse = previous pass
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 dir = (vUv - 0.5) * amount;
      gl_FragColor = vec4(
        texture2D(tDiffuse, vUv - dir).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv + dir).b,
        1.0
      );
    }
  `,
});
composer.addPass(chromatic); // before OutputPass for linear-space effects, after it for display-space ones
```

## Selective bloom (official pattern)

Simplest option first: if only emissive objects must glow, set `bloom.threshold = 1` and give those materials `emissiveIntensity > 1` with a HalfFloat composer target. Use the layer approach below when bright non-emissive objects must not glow.

```javascript
const BLOOM_LAYER = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);
glowing.layers.enable(BLOOM_LAYER);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0);

const bloomComposer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType }));
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const mixPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: { baseTexture: { value: null }, bloomTexture: { value: bloomComposer.renderTarget2.texture } },
    vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main() { gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv); }",
  }),
  "baseTexture",
);
mixPass.needsSwap = true;

const finalComposer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 }));
finalComposer.addPass(renderScene);
finalComposer.addPass(mixPass);
finalComposer.addPass(new OutputPass());

const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
const saved = new Map();
const render = () => {
  const background = scene.background;
  scene.background = null; // or the background blooms too
  scene.traverse((o) => {
    if (o.isMesh && !bloomLayer.test(o.layers)) { saved.set(o, o.material); o.material = black; }
  });
  bloomComposer.render();
  for (const [o, m] of saved) o.material = m;
  saved.clear();
  scene.background = background;
  finalComposer.render(); // not renderer.render(): that would overwrite the result
};
```

## WebGPURenderer: RenderPipeline (TSL)

```javascript
import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

const pipeline = new THREE.RenderPipeline(renderer); // "PostProcessing" before r183
const scenePass = pass(scene, camera);
const sceneColor = scenePass.getTextureNode("output");
pipeline.outputNode = sceneColor.add(bloom(sceneColor)); // bloom(node, strength, radius, threshold)

renderer.setAnimationLoop(() => pipeline.render());
```

Other TSL effects live in `three/addons/tsl/display/` (FXAA, SMAA, DOF, GTAO, SSR, outline, film, ...): check that folder for the current names. Tone mapping and color space are applied at the end automatically.
