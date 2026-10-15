# Lighting and shadows

Units are physical (default since r155). Point/Spot intensity in candela with `decay = 2`, so brightness falls off with distance²; Directional/Hemisphere/Ambient are unitless multipliers. The values below are starting points with ACES tone mapping and a 1–10 m scene: tune them by eye.

| Light | Shadows | Cost | Typical use |
|---|---|---|---|
| `AmbientLight(color, i)` | no | ~0 | Lift black shadows; prefer an environment map |
| `HemisphereLight(sky, ground, i)` | no | ~0 | Cheap outdoor fill |
| `DirectionalLight(color, i)` | yes (ortho camera) | low | Sun; the direction is position → `target` |
| `PointLight(color, i, distance, decay)` | yes (6 renders) | high with shadows | Bulbs, torches |
| `SpotLight(color, i, distance, angle, penumbra, decay)` | yes | medium | Lamps, stage; `light.map` projects a texture (needs `castShadow = true`) |
| `RectAreaLight(color, i, w, h)` | no | high | Softboxes, windows; Standard/Physical materials only |

Real scenes usually need `scene.environment` (HDR) plus one shadow-casting directional light.

## Setups

```javascript
// Product / studio: environment does most of the work
scene.environment = hdr; // see assets.md
const key = new THREE.DirectionalLight(0xffffff, 2);
key.position.set(3, 5, 2);
key.castShadow = true;
scene.add(key);

// Outdoor
const sun = new THREE.DirectionalLight(0xfff4e0, 3);
sun.position.set(30, 50, 20);
scene.add(sun, new THREE.HemisphereLight(0xbfd8ff, 0x6b5a45, 1));

// Three-point (no environment)
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(5, 5, 5);
const fill = new THREE.DirectionalLight(0xffffff, 0.8);
fill.position.set(-5, 3, 5);
const rim = new THREE.DirectionalLight(0xffffff, 1.5);
rim.position.set(0, 5, -5);
scene.add(keyLight, fill, rim);

// Bulb
const bulb = new THREE.PointLight(0xffd8a0, 40, 0, 2); // distance 0 = no cutoff
bulb.position.set(0, 2, 0);
```

Target: `DirectionalLight` and `SpotLight` aim at `light.target` (default origin). To aim elsewhere: `light.target.position.set(...)` and `scene.add(light.target)`, or follow an object with `light.target = mesh`.

RectAreaLight (WebGLRenderer):

```javascript
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

RectAreaLightUniformsLib.init(); // once, before rendering
const panel = new THREE.RectAreaLight(0xffffff, 5, 2, 1);
panel.position.set(0, 3, 2);
panel.lookAt(0, 0, 0);
panel.add(new RectAreaLightHelper(panel));
```

## Shadows checklist

1. `renderer.shadowMap.enabled = true` (type `PCFShadowMap` or `VSMShadowMap`).
2. `light.castShadow = true`.
3. `mesh.castShadow` / `mesh.receiveShadow` per mesh (GLTF: set them in a `traverse`).
4. Fit the shadow camera tightly around the visible area: this matters more than map size.

```javascript
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); // 1024 is often enough; 4096 is costly
const cam = sun.shadow.camera; // OrthographicCamera
cam.left = cam.bottom = -10;
cam.right = cam.top = 10;
cam.near = 0.5;
cam.far = 60;
cam.updateProjectionMatrix();
sun.shadow.radius = 4; // softness with PCF and VSM
sun.shadow.bias = -0.0005; // acne (stripes) → more negative; peter-panning (gap) → closer to 0
sun.shadow.normalBias = 0.02; // usually the better fix for acne on curved surfaces
scene.add(new THREE.CameraHelper(cam)); // debug the frustum, then remove
```

- Large worlds: move the light and its target with the player so the shadow box follows the camera, or use `CSM` (`three/addons/csm/CSM.js`).
- Static scene: `renderer.shadowMap.autoUpdate = false`, then `renderer.shadowMap.needsUpdate = true` when something moves.
- Point light shadows render 6 times: avoid more than one or two.
- Shadow-only floor: `new THREE.Mesh(planeGeo, new THREE.ShadowMaterial({ opacity: 0.3 }))` with `receiveShadow = true`.
- Soft fake contact shadow without lights: a plane with a radial-gradient `CanvasTexture` (`transparent: true`, `depthWrite: false`) under the object.

## Helpers and debugging

`DirectionalLightHelper(light, size)`, `PointLightHelper`, `SpotLightHelper` (call `.update()` after moving the light), `HemisphereLightHelper`, `CameraHelper(light.shadow.camera)`.

Many lights get expensive in forward rendering: each one adds work for every lit fragment. Bake static lighting into `lightMap`/`aoMap` (Blender → GLB) and keep real-time lights for what moves.
