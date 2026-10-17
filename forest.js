
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// LinguaLearn - Animated 3D Forest
const container = document.getElementById("forest3d");

if (container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9bd9f5);
  scene.fog = new THREE.Fog(0x9bd9f5, 32, 100);

  const camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    200
  );
  camera.position.set(0, 9, 22);
  camera.lookAt(0, 2, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute("aria-label", "Animated 3D forest");
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.HemisphereLight(0xd9f5ff, 0x45652c, 2.0));

  const sunlight = new THREE.DirectionalLight(0xfff0c5, 3);
  sunlight.position.set(-10, 20, 12);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  scene.add(sunlight);

  const clock = new THREE.Clock();
  const movingAnimals = [];
  const flyingThings = [];
  const swayingTrees = [];
  const temporaryObjects = [];

  const materials = {
    trunk: new THREE.MeshStandardMaterial({ color: 0x795037, roughness: 1 }),
    leaves: [
      new THREE.MeshStandardMaterial({ color: 0x246b3a, roughness: 1 }),
      new THREE.MeshStandardMaterial({ color: 0x368447, roughness: 1 }),
      new THREE.MeshStandardMaterial({ color: 0x58984b, roughness: 1 })
    ],
    grass: new THREE.MeshStandardMaterial({ color: 0x619747, roughness: 1 }),
    deer: new THREE.MeshStandardMaterial({ color: 0xc68a4b, roughness: 1 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xffe8bd, roughness: 1 }),
    rabbit: new THREE.MeshStandardMaterial({ color: 0xf0e9d9, roughness: 1 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x392d25, roughness: 1 }),
    flower: new THREE.MeshStandardMaterial({ color: 0xffd15b, roughness: 0.8 })
  };

  function addMesh(geometry, material, parent, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Forest floor
  const ground = addMesh(
    new THREE.CylinderGeometry(40, 40, 1.5, 48),
    materials.grass,
    scene,
    0, -0.8, 0
  );
  ground.receiveShadow = true;

  // Distant rolling hills
  for (let i = 0; i < 10; i++) {
    const hill = addMesh(
      new THREE.SphereGeometry(1, 12, 9),
      new THREE.MeshStandardMaterial({
        color: [0x8bbf79, 0x73aa69, 0x9ac781][i % 3],
        roughness: 1
      }),
      scene,
      (i - 4.5) * 8,
      0.2,
      -18 - Math.random() * 8
    );
    hill.scale.set(6 + Math.random() * 4, 3 + Math.random() * 2, 4);
    hill.castShadow = false;
  }

  // Mountains in the background
  for (let i = 0; i < 7; i++) {
    const mountain = addMesh(
      new THREE.ConeGeometry(4 + Math.random() * 3, 9 + Math.random() * 5, 5),
      new THREE.MeshStandardMaterial({
        color: i % 2 ? 0x789da9 : 0x91b5c2,
        flatShading: true,
        roughness: 1
      }),
      scene,
      (i - 3) * 8,
      4,
      -28
    );
    mountain.rotation.y = Math.random();
    mountain.castShadow = false;
  }

  // Trees with layered low-poly foliage
  function createTree(x, z, scale = 1, sway = true) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    addMesh(
      new THREE.CylinderGeometry(0.18, 0.32, 2.8, 7),
      materials.trunk,
      tree, 0, 1.2, 0
    );

    const layers = [
      { y: 2.2, radius: 1.45, height: 2.6 },
      { y: 3.35, radius: 1.15, height: 2.2 },
      { y: 4.3, radius: 0.82, height: 1.8 }
    ];

    layers.forEach((layer, i) => {
      const leaves = addMesh(
        new THREE.ConeGeometry(layer.radius, layer.height, 7),
        materials.leaves[(i + Math.floor(Math.random() * 3)) % 3],
        tree, 0, layer.y, 0
      );
      leaves.rotation.y = Math.random() * 0.7;
    });

    scene.add(tree);

    if (sway) {
      swayingTrees.push({
        object: tree,
        phase: Math.random() * Math.PI * 2,
        amount: 0.012 + Math.random() * 0.012
      });
    }
    return tree;
  }

  // Trees framing the scene; leave the middle clear for animals
  for (let i = 0; i < 46; i++) {
    let x, z;

    if (i < 16) {
      x = (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 9);
      z = -13 + Math.random() * 22;
    } else {
      x = (Math.random() - 0.5) * 46;
      z = -12 - Math.random() * 18;
    }

    const scale = z > 0 ? 0.8 + Math.random() * 0.6 : 1.1 + Math.random();
    createTree(x, z, scale);
  }

  // Small bushes
  for (let i = 0; i < 32; i++) {
    const bush = new THREE.Group();
    const x = (Math.random() - 0.5) * 34;
    const z = -12 + Math.random() * 25;

    for (let j = 0; j < 3; j++) {
      const blob = addMesh(
        new THREE.DodecahedronGeometry(0.45 + Math.random() * 0.25, 0),
        materials.leaves[j % 3],
        bush,
        (j - 1) * 0.4, Math.random() * 0.3, Math.random() * 0.25
      );
      blob.castShadow = false;
    }

    bush.position.set(x, 0.1, z);
    scene.add(bush);
  }

  // Flowers on the forest floor
  for (let i = 0; i < 65; i++) {
    const x = (Math.random() - 0.5) * 28;
    const z = -10 + Math.random() * 24;

    const stem = addMesh(
      new THREE.CylinderGeometry(0.025, 0.035, 0.32, 5),
      new THREE.MeshStandardMaterial({ color: 0x397543 }),
      scene, x, 0.15, z
    );
    stem.castShadow = false;

    const petalMaterial = new THREE.MeshStandardMaterial({
      color: [0xffe3a0, 0xf5a8b9, 0xffffff, 0xb5a3f5][i % 4]
    });

    addMesh(
      new THREE.SphereGeometry(0.13, 7, 5),
      petalMaterial, scene, x, 0.34, z
    ).scale.set(1, 0.7, 1);
  }

  // Rocks
  for (let i = 0; i < 24; i++) {
    const rock = addMesh(
      new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.65, 0),
      new THREE.MeshStandardMaterial({ color: 0x89958c, roughness: 1 }),
      scene,
      (Math.random() - 0.5) * 30,
      -0.03,
      -12 + Math.random() * 22
    );
    rock.scale.y = 0.45 + Math.random() * 0.4;
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = false;
  }

  // Create a stylized deer
  function createDeer(x, z, scale = 1) {
    const deer = new THREE.Group();
    const body = materials.deer;

    addMesh(new THREE.SphereGeometry(0.7, 12, 9), body, deer, 0, 1.25, 0)
      .scale.set(1.3, 0.85, 0.75);

    addMesh(new THREE.SphereGeometry(0.3, 10, 8), body, deer, 0.53, 1.65, 0);
    addMesh(new THREE.SphereGeometry(0.34, 10, 8), body, deer, 0.83, 1.93, 0);

    addMesh(
      new THREE.SphereGeometry(0.17, 8, 6),
      materials.cream, deer, 0.98, 1.82, 0.2
    );

    // Ears
    for (const side of [-1, 1]) {
      const ear = addMesh(
        new THREE.SphereGeometry(0.12, 7, 6),
        body, deer, 0.63, 2.15, side * 0.24
      );
      ear.scale.set(0.45, 1.6, 0.55);

      // Antlers made from small branches
      const antler = new THREE.Group();
      antler.position.set(0.76, 2.2, side * 0.13);
      deer.add(antler);

      const main = addMesh(
        new THREE.CylinderGeometry(0.035, 0.055, 0.65, 5),
        materials.cream, antler, 0, 0.28, 0
      );
      main.rotation.z = -0.25;

      for (let j = 0; j < 2; j++) {
        const branch = addMesh(
          new THREE.CylinderGeometry(0.025, 0.04, 0.32, 5),
          materials.cream, antler,
          -0.06 + j * 0.12, 0.42 + j * 0.1, 0
        );
        branch.rotation.z = -0.9 + j * 0.5;
      }
    }

    // Legs
    const legs = [];
    for (const side of [-1, 1]) {
      for (const front of [-1, 1]) {
        const leg = addMesh(
          new THREE.CylinderGeometry(0.075, 0.055, 0.8, 7),
          body, deer,
          front * 0.42, 0.55, side * 0.42
        );
        legs.push({ object: leg, phase: front * side });
      }
    }

    deer.position.set(x, 0, z);
    deer.scale.setScalar(scale);
    scene.add(deer);

    movingAnimals.push({
      object: deer,
      legs,
      originX: x,
      originZ: z,
      phase: Math.random() * 6,
      speed: 0.22 + Math.random() * 0.22,
      range: 1.5 + Math.random() * 2,
      type: "deer"
    });
  }

  // Create a rabbit
  function createRabbit(x, z, scale = 1) {
    const rabbit = new THREE.Group();

    addMesh(
      new THREE.SphereGeometry(0.4, 10, 8),
      materials.rabbit, rabbit, 0, 0.42, 0
    ).scale.set(1.15, 0.85, 0.9);

    addMesh(
      new THREE.SphereGeometry(0.28, 10, 8),
      materials.rabbit, rabbit, 0.28, 0.75, 0
    );

    addMesh(
      new THREE.SphereGeometry(0.12, 8, 6),
      materials.dark, rabbit, 0.47, 0.74, 0.14
    );

    addMesh(
      new THREE.SphereGeometry(0.12, 8, 6),
      materials.rabbit, rabbit, -0.35, 0.5, 0
    );

    const ears = [];
    for (const side of [-1, 1]) {
      const ear = addMesh(
        new THREE.SphereGeometry(0.1, 8, 6),
        materials.rabbit, rabbit,
        0.2, 1.08, side * 0.12
      );
      ear.scale.set(0.6, 2, 0.7);
      ears.push(ear);
    }

    rabbit.position.set(x, 0, z);
    rabbit.scale.setScalar(scale);
    scene.add(rabbit);

    movingAnimals.push({
      object: rabbit,
      legs: [],
      ears,
      originX: x,
      originZ: z,
      phase: Math.random() * 6,
      speed: 0.3 + Math.random() * 0.35,
      range: 1 + Math.random() * 1.8,
      type: "rabbit"
    });
  }

  createDeer(-4, 3, 1.0);
  createDeer(4, -1, 0.72);
  createRabbit(-1.5, 4, 0.8);
  createRabbit(2.2, 5, 0.7);
  createRabbit(6, 2, 0.65);

  // Birds: body, head, beak and animated wings
  function createBird(x, y, z, color) {
    const bird = new THREE.Group();
    const birdMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      side: THREE.DoubleSide
    });

    addMesh(
      new THREE.SphereGeometry(0.22, 9, 7),
      birdMat, bird, 0, 0, 0
    ).scale.set(1.35, 0.8, 0.8);

    addMesh(
      new THREE.SphereGeometry(0.13, 8, 6),
      birdMat, bird, 0.19, 0.1, 0
    );

    addMesh(
      new THREE.ConeGeometry(0.07, 0.23, 5),
      new THREE.MeshStandardMaterial({ color: 0xf3b34a }),
      bird, 0.35, 0.06, 0
    ).rotation.z = -Math.PI / 2;

    const wings = [];
    for (const side of [-1, 1]) {
      const wing = addMesh(
        new THREE.SphereGeometry(0.22, 7, 5),
        birdMat, bird, 0, 0.06, side * 0.22
      );
      wing.scale.set(0.7, 0.14, 1.5);
      wings.push({ object: wing, side });
    }

    bird.position.set(x, y, z);
    scene.add(bird);

    flyingThings.push({
      object: bird,
      wings,
      x, y, z,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      type: "bird"
    });
  }

  createBird(-7, 7, -2, 0x2879bd);
  createBird(5, 8, -6, 0xf0a13b);
  createBird(8, 6, 1, 0x3f9d70);
  createBird(-2, 9, -10, 0x3871a9);

  // Butterflies with fluttering wings
  function createButterfly(x, y, z, color) {
    const butterfly = new THREE.Group();
    const wingMat = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      roughness: 0.65
    });

    const body = addMesh(
      new THREE.CylinderGeometry(0.025, 0.035, 0.25, 6),
      materials.dark, butterfly, 0, 0, 0
    );
    body.rotation.x = Math.PI / 2;

    const wings = [];
    for (const side of [-1, 1]) {
      const wing = addMesh(
        new THREE.SphereGeometry(0.13, 8, 6),
        wingMat, butterfly, side * 0.1, 0.02, 0
      );
      wing.scale.set(1.2, 1, 0.2);
      wings.push({ object: wing, side });
    }

    butterfly.position.set(x, y, z);
    scene.add(butterfly);

    flyingThings.push({
      object: butterfly,
      wings,
      x, y, z,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.5,
      type: "butterfly"
    });
  }

  for (let i = 0; i < 12; i++) {
    createButterfly(
      (Math.random() - 0.5) * 14,
      1 + Math.random() * 4,
      -2 + Math.random() * 12,
      [0xf68c38, 0x69c9ef, 0xf2a5c7, 0xffd95b][i % 4]
    );
  }

  // Sun
  const sun = addMesh(
    new THREE.SphereGeometry(2, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe7a1 }),
    scene, 16, 17, -30
  );
  sun.castShadow = false;

  // Floating sparkles
  const sparkleMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff5b0
  });

  for (let i = 0; i < 35; i++) {
    const sparkle = addMesh(
      new THREE.SphereGeometry(0.035, 5, 4),
      sparkleMaterial,
      scene,
      (Math.random() - 0.5) * 22,
      0.5 + Math.random() * 5,
      -5 + Math.random() * 15
    );
    sparkle.castShadow = false;
    temporaryObjects.push({
      object: sparkle,
      baseY: sparkle.position.y,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Drag to rotate the view
  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let rotationY = 0;
  let rotationX = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;

  renderer.domElement.style.cursor = "grab";
  renderer.domElement.style.touchAction = "pan-y";

  renderer.domElement.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    renderer.domElement.style.cursor = "grabbing";
    renderer.domElement.setPointerCapture(event.pointerId);
  });

  renderer.domElement.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    targetRotationY += (event.clientX - previousX) * 0.004;
    targetRotationX += (event.clientY - previousY) * 0.002;
    targetRotationX = THREE.MathUtils.clamp(targetRotationX, -0.18, 0.18);

    previousX = event.clientX;
    previousY = event.clientY;
  });

  function stopDragging() {
    dragging = false;
    renderer.domElement.style.cursor = "grab";
  }

  renderer.domElement.addEventListener("pointerup", stopDragging);
  renderer.domElement.addEventListener("pointercancel", stopDragging);
  renderer.domElement.addEventListener("lostpointercapture", stopDragging);

  // Responsive canvas
  function resizeForest() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  const resizeObserver = new ResizeObserver(resizeForest);
  resizeObserver.observe(container);
  window.addEventListener("resize", resizeForest);
  resizeForest();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    const delta = Math.min(clock.getDelta(), 0.05);

    rotationY += (targetRotationY - rotationY) * 0.06;
    rotationX += (targetRotationX - rotationX) * 0.06;

    camera.position.x = Math.sin(rotationY) * 3;
    camera.position.y = 9 + rotationX * 10;
    camera.lookAt(0, 2, 0);

    // Trees gently sway in the breeze
    swayingTrees.forEach((tree) => {
      tree.object.rotation.z =
        Math.sin(time * 0.65 + tree.phase) * tree.amount;
    });

    // Animals wander gently and animate their legs
    movingAnimals.forEach((animal) => {
      const movement = Math.sin(time * animal.speed + animal.phase);

      animal.object.position.x =
        animal.originX + movement * animal.range;

      animal.object.position.z =
        animal.originZ + Math.cos(time * animal.speed * 0.6 + animal.phase) * 0.3;

      animal.object.rotation.y = movement > 0 ? 0 : Math.PI;

      if (animal.type === "deer") {
        animal.legs.forEach((leg) => {
          leg.object.rotation.z =
            Math.sin(time * 4 + leg.phase) * 0.08;
        });
      }

      if (animal.type === "rabbit") {
        animal.object.position.y =
          Math.max(0, Math.sin(time * 4 + animal.phase)) * 0.18;

        animal.ears?.forEach((ear, index) => {
          ear.rotation.z =
            Math.sin(time * 2 + index) * 0.08;
        });
      }
    });

    // Birds flap their wings; butterflies flutter around flowers
    flyingThings.forEach((thing) => {
      const phase = time * (thing.type === "bird" ? 9 : 13) + thing.phase;

      thing.wings.forEach((wing) => {
        wing.object.rotation.x =
          Math.sin(phase) * (thing.type === "bird" ? 0.8 : 0.5);

        wing.object.rotation.z =
          wing.side * Math.sin(phase) * 0.25;
      });

      thing.object.position.x =
        thing.x + Math.sin(time * thing.speed + thing.phase) *
        (thing.type === "bird" ? 2.3 : 0.8);

      thing.object.position.y =
        thing.y + Math.sin(time * 1.5 + thing.phase) *
        (thing.type === "bird" ? 0.5 : 0.35);

      thing.object.position.z =
        thing.z + Math.cos(time * thing.speed + thing.phase) * 0.8;
    });

    // Sparkles float up and down
    temporaryObjects.forEach((sparkle) => {
      sparkle.object.position.y =
        sparkle.baseY + Math.sin(time + sparkle.phase) * 0.2;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Release graphics resources if the container is removed
  window.addEventListener("beforeunload", () => {
    resizeObserver.disconnect();
    renderer.dispose();
  });
}
