import * as THREE from 'three';
import type { Phase } from './scenario';

export type OutpostScene = {
  setPhase: (phase: Phase, decision: 'allowed' | 'denied' | null) => void;
  setProgress: (progress: number) => void;
  dispose: () => void;
};

const palette = {
  floor: 0x263a55, edge: 0x6086a4, dark: 0x0c1a2f,
  cyan: 0x7de7ee, amber: 0xffc17d, violet: 0xb8a3ff,
};

export function createOutpostScene(host: HTMLElement, onRequest: () => void, reducedMotion: boolean): OutpostScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;cursor:pointer';

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(palette.dark, 0.028);
  const camera = new THREE.OrthographicCamera(-6, 6, 4, -4, 0.1, 80);
  camera.position.set(8, 8.7, 11);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xb6d8ff, 0x13233a, 2.1));
  const warmLight = new THREE.PointLight(palette.amber, 32, 10, 2);
  warmLight.position.set(1.8, 3.5, 1.4);
  scene.add(warmLight);
  const blueLight = new THREE.PointLight(palette.cyan, 20, 9, 2);
  blueLight.position.set(-2.5, 3, -1);
  scene.add(blueLight);

  const mat = (color: number, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness });
  const floorMat = mat(palette.floor, 0.24);
  const edgeMat = mat(palette.edge, 0.36);
  const darkMat = mat(palette.dark, 0.3);
  const amberMat = mat(palette.amber);
  const cyanMat = new THREE.MeshStandardMaterial({ color: palette.cyan, emissive: palette.cyan, emissiveIntensity: 0.45 });
  const gateMat = new THREE.MeshStandardMaterial({ color: palette.violet, emissive: palette.violet, emissiveIntensity: 0.42 });
  const box = (parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };
  const ball = (parent: THREE.Object3D, radius: number, position: [number, number, number], material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };

  // A short elevated crossing, not a room: the rails and seams lead toward the gate.
  box(scene, [8.7, 0.3, 3.0], [0, -0.12, 0], floorMat);
  for (let index = -4; index <= 4; index++) {
    box(scene, [0.04, 0.012, 2.7], [index, 0.055, 0], edgeMat);
  }
  for (const side of [-1, 1]) {
    box(scene, [8.7, 0.16, 0.12], [0, 0.12, side * 1.49], edgeMat);
    for (let x = -4; x <= 4; x += 0.8) box(scene, [0.09, 0.42, 0.09], [x, 0.33, side * 1.49], darkMat);
    box(scene, [8.7, 0.07, 0.07], [0, 0.59, side * 1.49], cyanMat);
  }
  box(scene, [0.55, 2.5, 0.6], [1.35, 1.25, -1.05], darkMat);
  box(scene, [0.55, 2.5, 0.6], [1.35, 1.25, 1.05], darkMat);
  box(scene, [0.16, 0.2, 2.14], [1.35, 2.4, 0], edgeMat);
  const gateLamp = box(scene, [0.13, 0.1, 1.68], [1.35, 2.3, 0], gateMat);
  box(scene, [1.0, 0.12, 1.1], [3.2, 0.15, 0], darkMat);
  box(scene, [0.64, 0.9, 0.65], [3.2, 0.64, 0], edgeMat);
  ball(scene, 0.24, [3.2, 1.22, 0], amberMat);

  // Flow is directional in both vertex displacement and color bands.
  const waterUniforms = { uTime: { value: 0 }, uTint: { value: new THREE.Color(0x115077) } };
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: waterUniforms,
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; uniform float uTime; void main() { vUv=uv; vec3 p=position; p.z += sin(p.x*2.4 + uTime*1.7)*0.06 + sin(p.y*4.1-uTime*1.2)*0.035; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform vec3 uTint; void main() { float flow=sin((vUv.x*7.0-vUv.y*2.0)-uTime*0.95); float fine=sin((vUv.x*21.0+vUv.y*8.0)-uTime*1.7); vec3 color=uTint + vec3(0.025,0.10,0.14)*(0.5+0.5*flow) + vec3(0.03,0.10,0.11)*pow(max(fine,0.0),9.0); gl_FragColor=vec4(color,0.88); }`,
  });
  for (const side of [-1, 1]) {
    const water = new THREE.Mesh(new THREE.PlaneGeometry(9, 5, 32, 12), waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.39, side * 3.85);
    scene.add(water);
  }

  const scout = new THREE.Group();
  scout.position.set(-2.65, 0.05, 0.2);
  scene.add(scout);
  box(scout, [0.45, 0.58, 0.38], [0, 0.52, 0], amberMat);
  ball(scout, 0.29, [0, 1.02, 0], mat(0xffd8aa));
  box(scout, [0.22, 0.11, 0.18], [0, 1.29, 0], darkMat);
  for (const eye of [-0.11, 0.11]) ball(scout, 0.045, [eye, 1.05, 0.26], darkMat);
  const scoutLegs = new THREE.Group();
  scout.add(scoutLegs);
  for (const side of [-1, 1]) box(scoutLegs, [0.13, 0.24, 0.14], [side * 0.13, 0.14, 0], darkMat);
  const packet = new THREE.Group();
  packet.position.set(-1.65, 0.38, 0.15);
  scene.add(packet);
  const packetBody = box(packet, [0.48, 0.26, 0.36], [0, 0, 0], cyanMat);
  box(packet, [0.52, 0.035, 0.06], [0, 0.15, 0], darkMat);
  const sentinel = new THREE.Group();
  sentinel.position.set(2.35, 0.05, -0.25);
  scene.add(sentinel);
  box(sentinel, [0.55, 0.78, 0.45], [0, 0.49, 0], mat(0x8e89cd));
  ball(sentinel, 0.33, [0, 1.06, 0], mat(0xbab4ef));
  const sentinelArm = new THREE.Group();
  sentinelArm.position.set(-0.34, 0.79, 0);
  sentinel.add(sentinelArm);
  box(sentinelArm, [0.16, 0.5, 0.19], [-0.04, -0.22, 0], mat(0xbab4ef));
  for (const eye of [-0.12, 0.12]) ball(sentinel, 0.045, [eye, 1.1, 0.29], darkMat);
  box(sentinel, [0.08, 0.32, 0.08], [0, 1.45, 0], edgeMat);
  ball(sentinel, 0.10, [0, 1.64, 0], cyanMat);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const onCanvasClick = (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.intersectObject(packetBody).length) onRequest();
  };
  renderer.domElement.addEventListener('click', onCanvasClick);

  let phase: Phase = 'idle';
  let decision: 'allowed' | 'denied' | null = null;
  let active = true;
  let visible = true;
  let animationTime = 0;
  let lastFrame = 0;
  let previousTime = 0;
  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    const extent = aspect < 1 ? 6.2 : 5.5;
    camera.left = -extent * aspect;
    camera.right = extent * aspect;
    camera.top = extent;
    camera.bottom = -extent;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const visibility = new IntersectionObserver((entries) => {
    visible = (entries[0]?.intersectionRatio ?? 0) >= 0.1;
    updateLoop();
  }, { threshold: [0, 0.1] });
  visibility.observe(host);
  const onPageVisibility = () => updateLoop();
  document.addEventListener('visibilitychange', onPageVisibility);
  function updateLoop() {
    renderer.setAnimationLoop(active && visible && !document.hidden && !reducedMotion ? tick : null);
    if (reducedMotion && active && visible) renderer.render(scene, camera);
  }
  function tick(time: number) {
    if (time - lastFrame < 32) return;
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.06) : 0;
    previousTime = time;
    lastFrame = time;
    animationTime += delta;
    waterUniforms.uTime.value = animationTime;
    const target = phase === 'approach' || phase === 'policy' || phase === 'allowed' || phase === 'denied' || phase === 'audit' ? -0.1 : -2.65;
    scout.position.x += (target - scout.position.x) * Math.min(1, delta * 3.7);
    scout.position.y = 0.05 + Math.sin(animationTime * (phase === 'approach' ? 9 : 2.5)) * 0.045;
    scoutLegs.rotation.z = phase === 'approach' ? Math.sin(animationTime * 10) * 0.13 : 0;
    sentinel.rotation.z = Math.sin(animationTime * 1.7) * 0.015;
    packet.rotation.y += delta * 0.7;
    packet.position.x = scout.position.x + 1;
    packet.position.y = 0.38 + Math.sin(animationTime * 2) * 0.065;
    const inspecting = phase === 'policy' || phase === 'allowed' || phase === 'denied' || phase === 'audit';
    sentinelArm.rotation.z += ((inspecting ? -1.2 : 0) - sentinelArm.rotation.z) * Math.min(1, delta * 5);
    gateLamp.scale.y = phase === 'policy' ? 1.5 : 1;
    renderer.render(scene, camera);
  }
  resize();
  updateLoop();

  return {
    setProgress(progress) {
      const shift = Math.max(0, Math.min(progress, 1)) * 1.8;
      camera.position.set(8 + shift, 8.7, 11);
      camera.lookAt(shift, 0, 0);
      renderer.render(scene, camera);
    },
    setPhase(nextPhase, nextDecision) {
      phase = nextPhase;
      decision = nextDecision;
      gateMat.color.setHex(decision === 'allowed' && ['allowed', 'audit'].includes(phase) ? 0x78ebc0 : decision === 'denied' && ['denied', 'audit'].includes(phase) ? 0xff718e : palette.violet);
      gateMat.emissive.copy(gateMat.color);
      if (reducedMotion) {
        scout.position.x = phase === 'idle' || phase === 'received' ? -2.65 : -0.1;
        packet.position.x = scout.position.x + 1;
        sentinelArm.rotation.z = phase === 'policy' || phase === 'allowed' || phase === 'denied' || phase === 'audit' ? -1.2 : 0;
        renderer.render(scene, camera);
      }
    },
    dispose() {
      active = false;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onPageVisibility);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
        meshMaterials.forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
