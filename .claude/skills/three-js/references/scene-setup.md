# Scene setup

## Renderer options

```javascript
const renderer = new THREE.WebGLRenderer({
  canvas, // optional existing <canvas>
  antialias: true,
  alpha: true, // transparent background (leave scene.background null)
  powerPreference: "high-performance",
  preserveDrawingBuffer: true, // only for canvas.toDataURL() screenshots, costs perf
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // >2 is mostly wasted fill rate
renderer.toneMapping = THREE.ACESFilmicToneMapping; // or AgXToneMapping, NeutralToneMapping
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; // or VSMShadowMap
// outputColorSpace already defaults to SRGBColorSpace
```

Scene background and fog: `scene.background = new THREE.Color(0x111111)`, `scene.fog = new THREE.Fog(color, near, far)` or `FogExp2(color, density)`. With an env map: `scene.backgroundBlurriness` (0–1), `backgroundIntensity`, `backgroundRotation`, `environmentIntensity`, `environmentRotation`.

## WebGPURenderer

Falls back to WebGL2 automatically. Use it when you need TSL node materials, compute, or the new post-processing.

```javascript
import * as THREE from "three/webgpu"; // includes the whole core
import { color, positionLocal, sin, time } from "three/tsl";

const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init(); // before the first render() outside setAnimationLoop

const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = color(0x3399ff);
material.positionNode = positionLocal.add(sin(time).mul(0.1)); // SkinnedMesh: start from positionGeometry

renderer.setAnimationLoop(() => renderer.render(scene, camera));
```

Don't mix `three` and `three/webgpu` imports in one bundle: two copies of the core, and `instanceof` checks break. `ShaderMaterial`/`onBeforeCompile` (GLSL) don't run on WebGPURenderer: use node materials.

## Cameras

```javascript
// Perspective: call updateProjectionMatrix() after changing fov/aspect/near/far
const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100); // keep far/near small for depth precision

// Orthographic (isometric/2D): frustum in world units
const s = 10;
const ortho = new THREE.OrthographicCamera((-s * aspect) / 2, (s * aspect) / 2, s / 2, -s / 2, 0.1, 100);
// on resize: update left/right from the new aspect, then updateProjectionMatrix()

// ArrayCamera: viewport in PIXELS, already multiplied by devicePixelRatio
const w = (window.innerWidth / 2) * window.devicePixelRatio;
const h = (window.innerHeight / 2) * window.devicePixelRatio;
sub.viewport = new THREE.Vector4(Math.floor(x * w), Math.floor(y * h), Math.ceil(w), Math.ceil(h));

// CubeCamera: dynamic reflections. Hide the reflecting object while updating.
const cubeRT = new THREE.WebGLCubeRenderTarget(256); // WebGPURenderer: THREE.CubeRenderTarget
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
shiny.material.envMap = cubeRT.texture;
// per frame (expensive; update every N frames if possible)
shiny.visible = false;
cubeCamera.position.copy(shiny.position);
cubeCamera.update(renderer, scene);
shiny.visible = true;
```

Coordinates: right-handed, +Y up, +Z toward the viewer. Units are meters (GLTF is meters; lights and physics assume it). `new THREE.AxesHelper(5)`: red X, green Y, blue Z.

## Controls (all in `three/addons/controls/`)

| Control | Use | Update call |
|---|---|---|
| `OrbitControls` | Product viewer, orbit around `controls.target` | `controls.update(dt)` each frame if damping/autoRotate (`dt` is used by autoRotate only) |
| `MapControls` | Top-down maps, pan with left button | same as Orbit |
| `TrackballControls` | Free rotation, no up-vector lock | `controls.update()` |
| `PointerLockControls(camera, document.body)` | FPS mouse look; `controls.lock()` from a click handler | move with `moveForward(d)`, `moveRight(d)` |
| `FlyControls`, `FirstPersonControls` | Free flight / walk with mouse look | `controls.update(dt)` |
| `TransformControls` | Move/rotate/scale gizmo | `scene.add(tc.getHelper())` |
| `DragControls(objects, camera, dom)` | Drag meshes on the view plane | event based |

Useful Orbit limits: `minDistance`, `maxDistance`, `minPolarAngle`, `maxPolarAngle = Math.PI / 2` (stay above ground), `minAzimuthAngle`, `maxAzimuthAngle`, `enablePan`, `autoRotate`, `autoRotateSpeed`. Render-on-demand (static scenes, battery): no loop, `controls.addEventListener("change", render)`, only with damping and autoRotate off.

## Object3D essentials

- `position`, `rotation` (Euler, radians, order `"XYZ"`; set `rotation.order = "YXZ"` for yaw-pitch cameras), `quaternion`, `scale`, `lookAt(x, y, z)`.
- World values: `getWorldPosition(target)`, `getWorldQuaternion(target)`, `getWorldDirection(target)` (pass a reused vector).
- `traverse(cb)`, `getObjectByName(name)`, `attach(child)` (re-parent keeping the world transform; `add()` keeps the local one).
- Static objects: `matrixAutoUpdate = false` + `updateMatrix()` once.
- `renderOrder` for draw order of transparent/overlay objects; `layers` for per-camera visibility and raycaster filtering.
- `THREE.LOD`: `lod.addLevel(mesh, distance)`.
- Math helpers: `THREE.MathUtils.clamp`, `lerp`, `damp(x, y, lambda, dt)` (frame-rate independent smoothing), `mapLinear`, `degToRad`, `smoothstep`, `randFloat`.

## Disposal

```javascript
const disposeObject = (root) => {
  root.traverse((obj) => {
    obj.geometry?.dispose();
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) {
        if (value?.isTexture) value.dispose();
      }
      material.dispose();
    }
  });
  root.removeFromParent();
};
```

Also dispose render targets, `PMREMGenerator`, composers (`composer.dispose()`), controls, then `renderer.dispose()`. Shared geometries/materials/textures: dispose only when no other mesh still uses them.

## Nuxt 3 component

```vue
<template>
  <div ref="container" class="h-[60vh] w-full" />
</template>

<script setup>
const container = ref(null);
let scene3d = null;

onMounted(async () => {
  const { mountScene } = await import("~/utils/three-scene.js"); // client-only chunk
  scene3d = mountScene(container.value);
});

onBeforeUnmount(() => scene3d?.dispose());
</script>
```

`mountScene` is the default scene in SKILL.md. Keep THREE objects out of `ref()`/`reactive()`: Vue proxies break three internals and slow every access (use plain `let` or `shallowRef`/`markRaw`). If the 3D canvas is SEO-irrelevant decoration, keep the page SSR and render only the canvas client-side.
