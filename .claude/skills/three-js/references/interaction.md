# Interaction

Use pointer events (`pointerdown`/`pointermove`/`pointerup`): one code path for mouse, touch and pen. Add `touch-action: none` to the canvas CSS when controls handle touch.

## Picking

```javascript
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const pickables = []; // explicit list; push meshes or GLTF roots

const toNDC = (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
};

const pick = (event) => {
  toNDC(event);
  raycaster.setFromCamera(ndc, camera);
  return raycaster.intersectObjects(pickables)[0] ?? null; // recursive by default
};
// hit: { distance, point (world), face: { a, b, c, normal, materialIndex }, faceIndex, uv, uv1, normal, object, instanceId }
```

- Click vs drag with OrbitControls: store the position on `pointerdown` and treat `pointerup` as a click only if it moved < 5 px. Otherwise every orbit selects something.
- A hit on a GLTF part gives the sub-mesh: walk up `hit.object.parent` until you find your root (mark it with `root.userData.pickable = true`).
- `InstancedMesh`: `hit.instanceId`.
- Filter: `raycaster.layers.set(1)` + `obj.layers.enable(1)`; `raycaster.far`; `raycaster.params.Points.threshold` / `params.Line.threshold` for points and lines.
- Heavy meshes: raycast an invisible proxy (`new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial({ visible: false }))`) or use the `three-mesh-bvh` package when it is justified.
- Hover: raycast in `pointermove`, at most once per frame (set a flag in the handler, raycast in the loop).

## Hover / select highlight

```javascript
let hovered = null;

const setHover = (mesh) => {
  if (hovered === mesh) return;
  if (hovered) hovered.material.emissive.setHex(hovered.userData.baseEmissive);
  hovered = mesh;
  renderer.domElement.style.cursor = mesh ? "pointer" : "";
  if (!mesh) return;
  if (!mesh.userData.ownMaterial) {
    mesh.material = mesh.material.clone(); // GLTF materials are shared; multi-material arrays: clone each entry
    mesh.userData.ownMaterial = true;
    mesh.userData.baseEmissive = mesh.material.emissive.getHex();
  }
  mesh.material.emissive.setHex(0x333333);
};
```

Outline instead of tint: `OutlinePass` ([postprocessing.md](postprocessing.md)).

## Drag on the ground plane

```javascript
const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0
const hitPoint = new THREE.Vector3();
let dragged = null;

renderer.domElement.addEventListener("pointerdown", (e) => {
  const hit = pick(e);
  if (!hit) return;
  dragged = hit.object; // or its pickable root, see Picking
  controls.enabled = false;
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (!dragged) return;
  toNDC(e);
  raycaster.setFromCamera(ndc, camera);
  if (!raycaster.ray.intersectPlane(ground, hitPoint)) return;
  const local = dragged.parent.worldToLocal(hitPoint.clone()); // hitPoint is world, position is parent space
  dragged.position.x = local.x;
  dragged.position.z = local.z;
});
renderer.domElement.addEventListener("pointerup", () => {
  dragged = null;
  controls.enabled = true;
});
```

Ready-made: `DragControls(objects, camera, renderer.domElement)`, events `dragstart`/`drag`/`dragend` (disable orbit on dragstart).

## Gizmo (editor-style)

```javascript
import { TransformControls } from "three/addons/controls/TransformControls.js";

const gizmo = new TransformControls(camera, renderer.domElement);
scene.add(gizmo.getHelper()); // not scene.add(gizmo)
gizmo.attach(selected);
gizmo.setMode("translate"); // "rotate" | "scale"
gizmo.setSpace("local"); // or "world"
gizmo.setTranslationSnap(0.5);
gizmo.addEventListener("dragging-changed", (e) => (orbit.enabled = !e.value));
```

Leave the gizmo helper out of `pickables`, or picking will select the gizmo itself.

## HTML labels over 3D points

```javascript
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const labels = new CSS2DRenderer();
labels.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none";
container.appendChild(labels.domElement);

const div = document.createElement("div");
div.textContent = "Engine";
const label = new CSS2DObject(div);
label.position.set(0, 1.2, 0);
engine.add(label); // follows the object

// resize: labels.setSize(w, h); loop: labels.render(scene, camera)
```

Real DOM: accessible, crisp text, CSS styling. Labels always draw on top, even behind geometry: raycast from the camera to hide occluded ones.

## World ↔ screen

```javascript
// World point → CSS pixels inside the canvas
const toScreen = (worldPos) => {
  const behind = worldPos.clone().applyMatrix4(camera.matrixWorldInverse).z > 0; // camera looks down −Z
  const p = worldPos.clone().project(camera); // NDC −1..1; x/y are flipped when behind
  const rect = renderer.domElement.getBoundingClientRect();
  return { x: ((p.x + 1) / 2) * rect.width, y: ((1 - p.y) / 2) * rect.height, behind };
};

// Screen → world on a plane: raycaster.setFromCamera(ndc, camera); raycaster.ray.intersectPlane(plane, out)
```

## Keyboard movement

```javascript
const keys = new Set();
window.addEventListener("keydown", (e) => keys.add(e.code));
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", () => keys.clear()); // avoid stuck keys

const move = new THREE.Vector3();
// in the loop
move.set(Number(keys.has("KeyD")) - Number(keys.has("KeyA")), 0, Number(keys.has("KeyS")) - Number(keys.has("KeyW")));
if (move.lengthSq() > 0) player.position.addScaledVector(move.normalize(), speed * dt);
```

Use `e.code` (physical key, works on AZERTY/QWERTZ layouts as "WASD position"), not `e.key`.

## Cleanup

Keep handler references (named arrow functions) so you can `removeEventListener` them in `dispose()`, or pass one `AbortController` signal to every `addEventListener` and call `abort()` once.
