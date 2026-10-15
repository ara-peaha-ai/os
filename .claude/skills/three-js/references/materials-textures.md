# Materials, textures, geometry

## Picking a material

| Material | Use | Cost |
|---|---|---|
| `MeshBasicMaterial` | Unlit: UI, sky, baked lighting, debug | lowest |
| `MeshLambertMaterial` | Matte, many objects, mobile | low |
| `MeshPhongMaterial` | Cheap specular highlight | low |
| `MeshStandardMaterial` | Default PBR (`roughness`, `metalness`); needs `scene.environment` to look right | medium |
| `MeshPhysicalMaterial` | Glass, clearcoat, sheen, iridescence, anisotropy | high |
| `MeshToonMaterial` | Cel shading with `gradientMap` | low |
| `MeshMatcapMaterial` | Lit look from one matcap texture, no lights needed | lowest |
| `ShadowMaterial` | Transparent ground that only shows shadows | low |
| `MeshNormalMaterial` / `MeshDepthMaterial` | Debug | lowest |
| `ShaderMaterial` | Custom GLSL ([shaders.md](shaders.md)) | yours |

A PBR scene without an environment map looks flat and dark, especially metals (`metalness: 1` reflects only the environment).

## Recipes

```javascript
// Glass (transmission renders an extra pass: keep these few)
const glass = new THREE.MeshPhysicalMaterial({
  roughness: 0, metalness: 0, transmission: 1, thickness: 0.5, ior: 1.5,
});

// Frosted glass
const frosted = new THREE.MeshPhysicalMaterial({ roughness: 0.4, transmission: 1, thickness: 1 });

// Car paint
const paint = new THREE.MeshPhysicalMaterial({
  color: 0xaa0000, metalness: 0.9, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.05,
});

// Fabric / velvet
const velvet = new THREE.MeshPhysicalMaterial({ color: 0x552244, roughness: 0.8, sheen: 1, sheenColor: 0xff88cc });

// Soap bubble
const bubble = new THREE.MeshPhysicalMaterial({
  transmission: 1, roughness: 0, iridescence: 1, iridescenceIOR: 1.3, iridescenceThicknessRange: [100, 400],
});

// Toon with 3 hard bands
const bands = new THREE.DataTexture(new Uint8Array([60, 160, 255]), 3, 1, THREE.RedFormat);
bands.minFilter = bands.magFilter = THREE.NearestFilter;
bands.needsUpdate = true;
const toon = new THREE.MeshToonMaterial({ color: 0x44aa88, gradientMap: bands });

// Glowing (pair with bloom): emissive above 1 exceeds the bloom threshold
const neon = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ffff, emissiveIntensity: 4 });
```

## Properties that bite

- `side: THREE.DoubleSide` for planes/leaves seen from both sides (costs fill rate).
- Transparency: `transparent: true` + `opacity`; objects are sorted per object, not per triangle, so overlapping transparent meshes glitch. Fixes: `depthWrite: false`, `renderOrder`, or `alphaTest`/`alphaHash` for cutouts.
- Z-fighting on coplanar surfaces: `polygonOffset: true, polygonOffsetFactor: -1`, or move one surface slightly, or a smaller near/far ratio.
- `material.needsUpdate = true` only when the shader must recompile: a map added or removed (null ↔ texture), `flatShading`, `vertexColors`, `fog`, `alphaTest` crossing 0. Changing colors, numbers or swapping one texture for another doesn't need it.
- Reusing a material avoids shader compiles but doesn't merge draw calls.
- `material.clone()` before editing one mesh of a loaded model.

## Textures

```javascript
const loader = new THREE.TextureLoader();
const [albedo, normal, orm] = await Promise.all(
  ["albedo.jpg", "normal.jpg", "orm.jpg"].map((url) => loader.loadAsync(url)),
);
albedo.colorSpace = THREE.SRGBColorSpace; // color maps only
for (const t of [albedo, normal, orm]) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
  t.anisotropy = renderer.capabilities.getMaxAnisotropy(); // sharp at grazing angles
}
const material = new THREE.MeshStandardMaterial({
  map: albedo,
  normalMap: normal,
  aoMap: orm, // packed ORM: R = AO, G = roughness, B = metalness
  roughnessMap: orm,
  metalnessMap: orm,
});
```

- Each texture has its own `repeat`/`offset`/`rotation` (+ `center` as the rotation pivot).
- Pixel art: `magFilter = minFilter = THREE.NearestFilter`, `generateMipmaps = false`.
- `texture.flipY`: GLTF textures use `false` (the loader handles it). Set it yourself only on textures you assign to GLTF meshes.
- Sizes: power of 2 isn't required anymore, but stay ≤ 2048 on mobile and prefer KTX2 for GPU memory.
- Sprite sheet / atlas: `t.repeat.set(1 / cols, 1 / rows); t.offset.set(col / cols, 1 - (row + 1) / rows)`. Clone the texture per sprite if several are shown at once (`clone()` shares the image upload).

| Texture kind | Create | Update |
|---|---|---|
| `CanvasTexture(canvas)` | 2D canvas drawing, labels, gradients | `needsUpdate = true` after redrawing |
| `VideoTexture(video)` | `<video muted playsinline loop>` + `video.play()` from a user gesture on iOS | automatic; `colorSpace = SRGBColorSpace` |
| `DataTexture(data, w, h)` | Uint8Array RGBA, lookup tables, noise | `needsUpdate = true` after writing `data` |
| `WebGLRenderTarget(w, h, { samples: 4 })` | Render-to-texture, mirrors, portals | `renderer.setRenderTarget(rt); renderer.render(s, c); renderer.setRenderTarget(null)` |

Render target depth: `rt.depthTexture = new THREE.DepthTexture(w, h)`.

## Geometry

Built-ins: `BoxGeometry`, `SphereGeometry(r, 32, 16)`, `PlaneGeometry`, `CircleGeometry`, `CylinderGeometry` (radiusTop 0 = cone), `ConeGeometry`, `TorusGeometry`, `TorusKnotGeometry`, `RingGeometry`, `CapsuleGeometry(radius, height, capSegments, radialSegments, heightSegments)`, `IcosahedronGeometry(r, detail)`, `LatheGeometry(points)`, `ExtrudeGeometry(shape, { depth, bevelEnabled })`, `TubeGeometry(curve, 64, r)`, `ShapeGeometry`. Geometries are built in their own space: use `geometry.rotateX(-Math.PI / 2)` to make a plane a floor once, instead of rotating every mesh.

```javascript
// Custom BufferGeometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
geometry.setIndex(indices); // plain array is fine
geometry.computeVertexNormals(); // lighting needs normals

// Animate vertices
const pos = geometry.attributes.position;
pos.setY(i, y);
pos.needsUpdate = true;
geometry.computeVertexNormals();
geometry.computeBoundingSphere(); // otherwise culling/raycasting use stale bounds
```

Hard edges outline: `new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 15), new THREE.LineBasicMaterial())`.

### Many objects

```javascript
// Same geometry + material, thousands of copies: 1 draw call
const mesh = new THREE.InstancedMesh(geometry, material, count);
const dummy = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  dummy.position.set(...randomPosition());
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
  mesh.setColorAt(i, color.setHSL(i / count, 0.7, 0.5)); // creates instanceColor on first call
}
mesh.instanceMatrix.needsUpdate = true;
mesh.instanceColor.needsUpdate = true;
mesh.computeBoundingSphere(); // after moving instances, or culling uses the base geometry
// raycast hit → hit.instanceId
```

- Different geometries sharing one material: `BatchedMesh(maxInstances, maxVertices, maxIndices, material)` → `addGeometry()` → `addInstance(id)` → `setMatrixAt()`.
- Static, never moving: `mergeGeometries([...], useGroups)` from `three/addons/utils/BufferGeometryUtils.js` (same attribute set on all inputs).

### Points and lines

```javascript
const points = new THREE.Points(
  new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(xyz, 3)),
  new THREE.PointsMaterial({ size: 0.05, sizeAttenuation: true, map: dotTexture, alphaTest: 0.5 }),
);

import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
const thick = new Line2(
  new LineGeometry().setPositions(flatXYZ),
  new LineMaterial({ color: 0xffffff, linewidth: 4 }), // pixels
);
```

Dashed: `LineDashedMaterial` + `line.computeLineDistances()`. Smooth path through points: `new THREE.CatmullRomCurve3(points).getPoints(200)`.
