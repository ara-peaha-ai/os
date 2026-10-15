# Animation

## GLTF clips (most common)

```javascript
const mixer = new THREE.AnimationMixer(gltf.scene);
const actions = Object.fromEntries(gltf.animations.map((clip) => [clip.name, mixer.clipAction(clip)]));
console.log(Object.keys(actions)); // names come from the DCC tool, check them

let current = actions.Idle;
current.play();

const fadeTo = (name, duration = 0.3) => {
  const next = actions[name];
  if (next === current) return;
  next.reset().setEffectiveWeight(1).play();
  current.crossFadeTo(next, duration, true);
  current = next;
};

// One-shot (jump, attack) then back to idle
const playOnce = (name) => {
  const action = actions[name];
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true; // hold the last frame instead of snapping to the rest pose
  fadeTo(name, 0.1);
};
mixer.addEventListener("finished", () => fadeTo("Idle"));

// in the loop, with Timer (see SKILL.md)
mixer.update(timer.getDelta());
```

Each model copy needs its own mixer. Clips can be shared between mixers of models with the same rig (bone names must match).

## Action controls

| Property / method | Effect |
|---|---|
| `play()`, `stop()`, `reset()`, `halt(t)` | Start, stop and rewind, rewind, slow down to a stop over `t` s |
| `paused = true` | Freeze at the current time |
| `timeScale` | Speed; negative plays backwards |
| `time` | Scrub (seconds) |
| `setLoop(THREE.LoopRepeat / LoopOnce / LoopPingPong, reps)` | Loop mode |
| `clampWhenFinished` | Hold the final frame (with LoopOnce) |
| `fadeIn(t)`, `fadeOut(t)`, `crossFadeTo(other, t, warp)` | Weight transitions |
| `setEffectiveWeight(w)` | Manual blend weight (0–1) |
| `syncWith(other)` | Match phase (walk ↔ run) |

Mixer events: `"finished"` and `"loop"`; `e.action` is the action.

## Speed-based blending (idle / walk / run)

```javascript
for (const a of [actions.Idle, actions.Walk, actions.Run]) a.play(); // all running, weights decide

const blendLocomotion = (speed) => {
  const walk = THREE.MathUtils.clamp(speed / 2, 0, 1);
  const run = THREE.MathUtils.clamp((speed - 2) / 3, 0, 1);
  actions.Idle.setEffectiveWeight(1 - walk);
  actions.Walk.setEffectiveWeight(walk * (1 - run));
  actions.Run.setEffectiveWeight(run);
};
```

## Additive layers (breathing, aim offsets, facial on top of body)

```javascript
THREE.AnimationUtils.makeClipAdditive(breathClip); // convert BEFORE creating the action
const breath = mixer.clipAction(breathClip);
breath.blendMode = THREE.AdditiveAnimationBlendMode;
breath.play();
```

Cut a sub-clip from one long take: `THREE.AnimationUtils.subclip(clip, "walk", startFrame, endFrame, fps)`.

## Clips from code (UI, cameras, props)

```javascript
const times = [0, 1, 2];
const clip = new THREE.AnimationClip("pulse", -1, [ // -1 = duration from tracks
  new THREE.VectorKeyframeTrack(".scale", times, [1, 1, 1, 1.3, 1.3, 1.3, 1, 1, 1]),
  new THREE.ColorKeyframeTrack(".material.color", times, [1, 1, 1, 1, 0, 0, 1, 1, 1]),
  new THREE.QuaternionKeyframeTrack(".quaternion", [0, 2], [...qStart.toArray(), ...qEnd.toArray()]),
  new THREE.BooleanKeyframeTrack(".visible", [0, 1.5], [true, false]),
  new THREE.NumberKeyframeTrack(".morphTargetInfluences[smile]", times, [0, 1, 0]), // Number, not String
]);
```

Track paths are relative to the mixer root: `"Head.quaternion"` targets the descendant named `Head`. Interpolation: `track.setInterpolation(THREE.InterpolateDiscrete / InterpolateLinear / InterpolateSmooth)`. `clip.optimize()` removes redundant keys; `clip.resetDuration()` recomputes the duration from the tracks (it doesn't rewind).

For simple one-off tweens (button hover, camera fly-to) a damped value in the loop is simpler than a clip:

```javascript
// Frame-rate independent ease toward a target
mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 6, dt); // lambda: higher = snappier
camera.position.lerp(goal, 1 - Math.exp(-4 * dt)); // the same idea for vectors
```

## Morph targets (blend shapes)

```javascript
const face = gltf.scene.getObjectByName("Face");
const i = face.morphTargetDictionary.smile; // name → index
face.morphTargetInfluences[i] = 0.8; // 0–1
```

## Skeleton

```javascript
const skinned = model.getObjectByProperty("type", "SkinnedMesh");
const head = model.getObjectByName("Head"); // bones are regular Object3Ds in the tree

// in the loop: mixer first, then your overrides (look-at, IK, procedural)
mixer.update(dt);
head.rotation.y += Math.sin(timer.getElapsed()) * 0.3;

// Attach a prop to a hand, keep its local offset
const hand = model.getObjectByName("RightHand");
hand.add(sword);
sword.position.set(0, 0.1, 0);

scene.add(new THREE.SkeletonHelper(model)); // debug
```

Off-screen skinned meshes or popping at the frustum edge: `skinned.computeBoundingSphere()` after the pose changes, or `skinned.frustumCulled = false`.

## Procedural motion

```javascript
const t = timer.getElapsed();
mesh.position.y = Math.sin(t * 2) * 0.5; // bob
mesh.position.y = Math.abs(Math.sin(t * 3)) * 2; // bounce
mesh.position.set(Math.cos(t) * 2, 0, Math.sin(t) * 2); // orbit
mesh.rotation.y += dt * 0.5; // always scale by dt, never a fixed step per frame
```

Spring (overshoot): `velocity += (-k * (x - target) - c * velocity) * dt; x += velocity * dt;` with k ≈ 100, c ≈ 10. With large `dt` (tab switch) clamp `dt` to e.g. 1/30 or use substeps.

Pause work off-screen: skip `mixer.update` for characters that are far away or hidden, and stop the loop entirely (`setAnimationLoop(null)`) when the canvas is outside the viewport (`IntersectionObserver`).
