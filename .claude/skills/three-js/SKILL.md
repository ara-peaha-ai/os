---
name: three-js
description: Three.js r186 (WebGLRenderer and WebGPURenderer) for 3D scenes, GLTF models, materials, lights and shadows, animation, raycasting and controls, custom shaders, post-processing. Use when writing or reviewing code that imports `three` or `three/addons`, including Nuxt/Vue components with a 3D canvas.
---

# Three.js

Baseline: three **r186** (npm `three@0.186.x`), JavaScript ES modules, addons imported from `three/addons/...` only. WebGL1 is gone (r163): GLSL ES 3.0 features, NPOT mipmaps and MSAA render targets are always available.

Your training data is full of pre-r150 tutorials. The table below is what they get wrong; every row was checked against the r186 source. Read it before writing code.

## Default scene

```javascript
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const mountScene = (container) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(3, 2, 5);

  // Image-based lighting without asset files; replace with an HDR for real scenes
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Size from the container, not the window
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  const timer = new THREE.Timer();
  timer.connect(document); // delta = 0 while the tab is hidden

  renderer.setAnimationLoop((time) => {
    timer.update(time);
    const dt = timer.getDelta();
    controls.update(dt);
    renderer.render(scene, camera);
  });

  return {
    scene,
    camera,
    renderer,
    dispose: () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      timer.dispose();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};
```

## Don't / Do

| Area | Don't | Do | Why |
|---|---|---|---|
| Loop | `requestAnimationFrame(animate)` | `renderer.setAnimationLoop(animate)`, `null` to stop | Required for WebXR and WebGPURenderer |
| Time | `THREE.Clock` | `THREE.Timer` + `timer.update(time)` once per frame | Clock is deprecated since r183. Its `getElapsedTime()` calls `getDelta()`, so a later `getDelta()` returns ≈ 0 |
| Imports | Mixing `three/examples/jsm/...` and `three/addons/...` | `three/addons/...` everywhere | Same files, one style |
| HDR | `RGBELoader` | `HDRLoader` (`three/addons/loaders/HDRLoader.js`) | Deprecated since r180 |
| Color | `outputEncoding`, `sRGBEncoding` | `texture.colorSpace = THREE.SRGBColorSpace` on color maps only (`map`, `emissiveMap`, `sheenColorMap`, `specularColorMap`) | Normal, roughness, metalness and AO maps stay `NoColorSpace`. GLTFLoader already sets them |
| Lights | Old-tutorial intensities, `useLegacyLights`, `physicallyCorrectLights` | Physical units (default since r155): Point/Spot in candela with `decay = 2` | `new PointLight(0xffffff, 1)` 5 m away is very dim. Start around 20–100 and tune |
| AO map | Second UV set as `uv2` | Second set is `uv1`; `aoMap.channel = 1` (0 = `uv`, 1 = `uv1`, 2 = `uv2`) | Renamed in r151: old `uv2` is now `uv1`, `uv2` is the third set |
| Shadows | `PCFSoftShadowMap` | `PCFShadowMap` + `light.shadow.radius` (or `VSMShadowMap`) | Removed: r186 warns and falls back to PCF |
| Light layers | `light.layers.set(1)` to light only some meshes | Separate scenes rendered with `autoClear = false` | Light layers only decide whether a light is active for a camera, not which meshes it hits |
| Contact shadow | `import { ContactShadows } from "three/..."` | `ShadowMaterial` on a ground plane, or a baked blob texture | Doesn't exist in three: it's drei (React Three Fiber) |
| Controls | `scene.add(transformControls)` | `scene.add(transformControls.getHelper())` | Controls are no longer `Object3D` (r169) |
| Clone | `gltf.scene.clone()` on a skinned/animated model | `SkeletonUtils.clone(gltf.scene)` | A plain clone stays bound to the original skeleton |
| Highlight | `hit.object.material.emissive.set(...)` on a GLTF mesh | `mesh.material = mesh.material.clone()` once (each entry if it is an array), then change it | GLTF materials are shared, so the whole model lights up |
| Bones | Set a bone rotation, then `mixer.update()` | `mixer.update(dt)` first, then override the bone | The mixer overwrites animated bones |
| Skinned culling | Ignore meshes vanishing at screen edges | `skinnedMesh.computeBoundingSphere()` after the pose changes, or `frustumCulled = false` | The bounds come from the bind pose |
| Fit model | `model.position.sub(center); model.scale.setScalar(s)` | On a fresh root (position 0, scale 1): `model.scale.setScalar(s); model.position.copy(center).multiplyScalar(-s)` | Scaling also moves the offset center |
| Composer | `GammaCorrectionShader` as the final pass | effects → `SMAAPass` → `OutputPass` → `FXAAPass` | OutputPass applies tone mapping and sRGB; SMAA works in linear, FXAA on the sRGB image |
| Selective bloom | `composer.render(); renderer.render(scene, camera)` | Two composers + mix pass ([postprocessing](references/postprocessing.md)) | The second render overwrites the bloom |
| Pass ctors | `FilmPass(n, s, c, g)`, `SMAAPass(w, h)`, `HalftonePass(w, h, p)` | `FilmPass(intensity, grayscale)`, `new SMAAPass()`, `HalftonePass(params)` | r186 signatures |
| Shader ext. | `extensions: { derivatives, fragDepth, drawBuffers, shaderTextureLOD }` | Remove; only `clipCullDistance` and `multiDraw` remain | `dFdx`, `gl_FragDepth` and `textureLod` are always available |
| Chunks | `#include <output_fragment>` in `onBeforeCompile` | `#include <opaque_fragment>` | Renamed in r154 |
| WebGPU | `three/addons/nodes/Nodes.js`, `THREE.PostProcessing`, `renderAsync()` | `three/webgpu` + `three/tsl`, `THREE.RenderPipeline`, `await renderer.init()` then `render()` | Renamed in r183; `renderAsync` deprecated in r181 |
| ArrayCamera | `viewport` in 0–1 | Pixels × `devicePixelRatio` | See the official `webgl_camera_array` example |
| Lines | `LineBasicMaterial({ linewidth: 3 })` | `Line2` + `LineMaterial` (`three/addons/lines/`); WebGPU: `Line2NodeMaterial` | `linewidth > 1` is ignored by WebGL |
| Draw calls | "Same material = batched" | `InstancedMesh`, `BatchedMesh`, `mergeGeometries` | Three never batches on its own |
| Transparency | `transparent: true` for cutouts (leaves, fences) | `alphaTest: 0.5` or `alphaHash: true` | No sorting artifacts, cheaper |
| Textures | `tex.needsUpdate = true` after `TextureLoader` | Only after changing `DataTexture`/`CanvasTexture` contents | The loader already flags it |
| Picking | `raycaster.intersectObjects(scene.children)` | An explicit list of pickable objects | Otherwise it hits helpers and gizmos (recursive by default) |
| Pointer | NDC from `window.innerWidth` on a non-fullscreen canvas | NDC from `canvas.getBoundingClientRect()` | Offsets break picking |
| Loop GC | `new THREE.Vector3()` inside the frame loop | Allocate once outside, reuse | GC stutter |
| Dispose | `scene.remove(mesh)` and done | `.dispose()` geometry, materials, textures, render targets, controls, renderer | Removing a mesh frees no GPU memory. Check `renderer.info.memory` |
| SSR (Nuxt) | Top-level `import * as THREE` in a page/component | `onMounted` + dynamic `import("three")`, or a `.client.vue` component; dispose in `onBeforeUnmount` | No WebGL on the server |
| KTX2 | Basis transcoder from a CDN pinned to another three version | Copy `node_modules/three/examples/jsm/libs/basis/` into `public/` | The transcoder must match KTX2Loader |

## References (read only the one the task needs)

| File | Read when |
|---|---|
| [scene-setup.md](references/scene-setup.md) | Renderer options, WebGPU renderer, cameras, controls list, Nuxt component, disposal |
| [assets.md](references/assets.md) | GLTF/Draco/KTX2/Meshopt, HDR environments, fit-to-view, other formats, 3D text |
| [materials-textures.md](references/materials-textures.md) | Picking a material, glass/car paint/toon recipes, texture settings, instancing, points, lines |
| [lighting-shadows.md](references/lighting-shadows.md) | Light setups with physical intensities, shadow tuning, area lights |
| [animation.md](references/animation.md) | GLTF clips, crossfade, weight blending, additive, keyframe tracks, morph targets, bones, procedural motion |
| [interaction.md](references/interaction.md) | Click/hover picking, drag, gizmo, ray-plane, HTML labels, world↔screen |
| [shaders.md](references/shaders.md) | ShaderMaterial, onBeforeCompile, fresnel/rim/dissolve/noise recipes, debugging |
| [postprocessing.md](references/postprocessing.md) | EffectComposer chain, effect constructors, custom pass, selective bloom, WebGPU RenderPipeline |
