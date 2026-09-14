# Third-party renderer

Three.js 0.186.0, https://threejs.org/, MIT license (see vendor/LICENSE).

The checked-in vendor files are copied from the official npm package:
- build/three.module.js
- build/three.core.js
- examples/jsm/geometries/RoundedBoxGeometry.js
- examples/jsm/environments/RoomEnvironment.js
- examples/jsm/utils/BufferGeometryUtils.js

All game-specific models, scenery, typography layouts, textures, and gameplay code are authored in this repository. Textures are generated deterministically with Canvas. No external image, model, or font service is used at runtime.
