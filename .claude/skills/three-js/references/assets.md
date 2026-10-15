# Assets

Every loader has `loadAsync(url, onProgress)`, so no hand-written Promise wrappers are needed.

## GLTF / GLB (the default format)

```javascript
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

// Decoders copied from node_modules/three/examples/jsm/libs/{draco,basis}/ into public/
const draco = new DRACOLoader().setDecoderPath("/draco/");
const ktx2 = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(renderer);

const gltfLoader = new GLTFLoader()
  .setDRACOLoader(draco)
  .setKTX2Loader(ktx2)
  .setMeshoptDecoder(MeshoptDecoder);

const gltf = await gltfLoader.loadAsync("/models/robot.glb");
// gltf.scene, gltf.animations (AnimationClip[]), gltf.cameras, gltf.asset, gltf.userData
scene.add(gltf.scene);
```

Reuse one `GLTFLoader` (and its decoders) for the whole app. Compress models offline with `gltf-transform` (`npx @gltf-transform/cli optimize in.glb out.glb --texture-compress ktx2`).

### Post-load pass

```javascript
gltf.scene.traverse((obj) => {
  if (!obj.isMesh) return;
  obj.castShadow = true;
  obj.receiveShadow = true;
});
const head = gltf.scene.getObjectByName("Head"); // names come from the DCC tool
```

### Fit to unit size and center at origin

```javascript
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());
const s = 1 / Math.max(size.x, size.y, size.z);
model.scale.setScalar(s);
model.position.copy(center).multiplyScalar(-s); // scale first, then offset by the scaled center
```

### Frame the camera on an object

```javascript
const frame = (object, camera, controls) => {
  const box = new THREE.Box3().setFromObject(object);
  const radius = box.getBoundingSphere(new THREE.Sphere()).radius;
  const center = box.getCenter(new THREE.Vector3());
  const dist = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.position.copy(center).add(new THREE.Vector3(0, 0, dist));
  camera.near = dist / 100;
  camera.far = dist * 100;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
};
```

### Many copies of one model

```javascript
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

const copy = SkeletonUtils.clone(gltf.scene); // required for skinned meshes, fine for static ones
```

Clones share geometry and materials. Clone the material before tinting a single copy. For hundreds of static copies use `InstancedMesh` with the model's geometry/material.

## Environment maps

```javascript
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

const hdr = await new HDRLoader().loadAsync("/env/studio_1k.hdr");
hdr.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = hdr; // auto PMREM-filtered for PBR materials
scene.background = hdr; // optional; or keep a flat color
```

- `.exr`: `EXRLoader`; gain-map JPEG HDR (small files): `UltraHDRLoader`.
- 1k–2k HDRIs are enough for lighting; use a separate JPEG for a sharp background.
- No files: `pmrem.fromScene(new RoomEnvironment(), 0.04).texture` (see SKILL.md).
- Cube faces: `new THREE.CubeTextureLoader().setPath("/sky/").loadAsync(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"])`.
- Ground-projected HDR background: `GroundedSkybox` from `three/addons/objects/GroundedSkybox.js`.

## Progress

```javascript
const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => setProgress(loaded / total);
manager.onLoad = () => hideLoader();
manager.onError = (url) => console.error("Failed:", url);
const gltfLoader = new GLTFLoader(manager); // pass the manager to every loader
```

Counts files, not bytes. For a byte-accurate bar on one large GLB, use the `onProgress` of `loadAsync`.

Other: `loader.setPath("/models/")`, `loader.setResourcePath()` (external .bin/textures), `manager.setURLModifier(fn)` (CDN rewrites, drag-and-drop blob URLs), `gltfLoader.parse(arrayBuffer, "", onLoad, onError)` (from `fetch`/file input). `THREE.Cache.enabled = true` caches file responses in memory only.

## Other formats

| Format | Loader (`three/addons/loaders/`) | Result / notes |
|---|---|---|
| OBJ + MTL | `MTLLoader` → `materials.preload()` → `OBJLoader.setMaterials()` | `Group`; no PBR, prefer converting to GLB |
| FBX | `FBXLoader` | `Group` with `.animations`; often in cm, scale 0.01 |
| STL | `STLLoader` | `BufferGeometry` only; add a material |
| PLY | `PLYLoader` | `BufferGeometry`; `computeVertexNormals()` if missing, `vertexColors: true` |
| USDZ | `USDLoader` | still partial: test the file |
| SVG | `SVGLoader` | paths → `SVGLoader.createShapes(path)` → `ShapeGeometry`/`ExtrudeGeometry` |

## 3D text

```javascript
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const font = await new FontLoader().loadAsync("/fonts/helvetiker_regular.typeface.json");
const geometry = new TextGeometry("Hello", {
  font,
  size: 0.5,
  depth: 0.1, // "height" in old tutorials
  curveSegments: 6,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
});
geometry.center();
```

Flat or lots of text: `CanvasTexture` on a plane, `CSS2DRenderer` labels ([interaction.md](interaction.md)), or the `troika-three-text` package (SDF text) when it is justified.
