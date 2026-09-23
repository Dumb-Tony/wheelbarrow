# Third-party renderer

Three.js 0.186.0, https://threejs.org/, MIT license (see vendor/LICENSE).

The checked-in vendor files are copied from the official npm package:
- build/three.module.js
- build/three.core.js
- examples/jsm/geometries/RoundedBoxGeometry.js
- examples/jsm/environments/RoomEnvironment.js
- examples/jsm/utils/BufferGeometryUtils.js

All game-specific models, scenery, typography layouts, textures, and gameplay code are authored in this repository. Textures are generated deterministically with Canvas. No external image, model, or font service is used at runtime.

## Ray-tracing and postprocessing additions

- three-gpu-pathtracer 0.0.24, MIT, https://github.com/gkjohnson/three-gpu-pathtracer (vendor/LICENSE-pathtracer).
- three-mesh-bvh, installed version pinned in package-lock.json, MIT, https://github.com/gkjohnson/three-mesh-bvh (vendor/LICENSE-bvh).
- Three.js EffectComposer, RenderPass, GTAOPass, OutputPass and FullScreenQuad, same Three.js MIT license.

vendor/raytrace.js and vendor/render-effects.js are built from the named npm packages using esbuild. They share the existing vendored Three.js instance. The game-specific bilateral photo filter in photo.js and procedural material maps in surfaces.js are authored locally. Optional xatlas package is an upstream install-time peer; this game does not request its WASM or use lightmap unwrapping.
