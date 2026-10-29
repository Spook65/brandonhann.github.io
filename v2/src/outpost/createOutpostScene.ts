import * as THREE from 'three';
import type { Decision, Phase } from './scenario';
import { facingYaw, outpostSpace, targetFacings, turnToward, visualTargets } from './motionPlan';

export type OutpostScene = {
  setPhase: (phase: Phase, decision: Decision | null) => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

const palette = {
  floor: 0x263a55, edge: 0x6086a4, dark: 0x0c1a2f,
  cyan: 0x7de7ee, amber: 0xffc17d, violet: 0xb8a3ff,
};

export function createOutpostScene(host: HTMLElement, onRequest: () => void, onVisibilityChange: (visible: boolean) => void, reducedMotion: boolean): OutpostScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;cursor:pointer';

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(palette.dark, 0.018);
  const camera = new THREE.OrthographicCamera(-6, 6, 4, -4, 0.1, 80);
  camera.position.set(3, 8.5, 14);
  camera.lookAt(0, 0.7, 1.1);
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
  const auditMat = new THREE.MeshStandardMaterial({ color: palette.amber, emissive: palette.amber, emissiveIntensity: 0.25 });
  const cyanMat = new THREE.MeshStandardMaterial({ color: palette.cyan, emissive: palette.cyan, emissiveIntensity: 0.45 });
  const gateMat = new THREE.MeshStandardMaterial({ color: palette.violet, emissive: palette.violet, emissiveIntensity: 0.42 });
  const barrierMat = new THREE.MeshStandardMaterial({ color: 0x7c73c2, emissive: 0x5e58a0, emissiveIntensity: 0.3, transparent: true, opacity: 0.7, metalness: 0.3 });
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
  const railGroups = [-1, 1].map((side) => {
    const group = new THREE.Group();
    scene.add(group);
    box(group, [8.7, 0.16, 0.12], [0, 0.12, side * 1.49], edgeMat);
    for (let x = -4; x <= 4; x += 0.8) box(group, [0.09, 0.42, 0.09], [x, 0.33, side * 1.49], darkMat);
    box(group, [8.7, 0.07, 0.07], [0, 0.59, side * 1.49], cyanMat);
    return group;
  });
  const gateGroup = new THREE.Group();
  scene.add(gateGroup);
  box(gateGroup, [0.55, 2.5, 0.6], [1.35, 1.25, -1.05], darkMat);
  box(gateGroup, [0.55, 2.5, 0.6], [1.35, 1.25, 1.05], darkMat);
  box(gateGroup, [0.16, 0.2, 2.14], [1.35, 2.4, 0], edgeMat);
  const gateLamp = box(gateGroup, [0.13, 0.1, 1.68], [1.35, 2.3, 0], gateMat);
  const gateBarrier = box(gateGroup, [0.11, 1.35, 1.72], [1.35, 0.74, 0], barrierMat);
  for (const height of [0.35, 0.75, 1.15]) box(gateBarrier, [0.015, 0.035, 1.7], [0.06, height - 0.74, 0], cyanMat);
  box(scene, [0.78, 0.12, 0.65], [3.65, 0.15, -0.75], darkMat);
  box(scene, [0.52, 0.72, 0.5], [3.65, 0.56, -0.75], edgeMat);
  const auditBeacon = ball(scene, 0.2, [3.65, 1.09, -0.75], auditMat);

  // Flow is directional in both vertex displacement and color bands.
  const waterUniforms = { uTime: { value: 0 }, uTint: { value: new THREE.Color(0x115077) } };
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: waterUniforms,
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; uniform float uTime; void main() { vUv=uv; vec3 p=position; p.z += sin(p.x*2.4 + uTime*1.7)*0.06 + sin(p.y*4.1-uTime*1.2)*0.035; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform vec3 uTint; void main() { float flow=sin((vUv.x*7.0-vUv.y*2.0)-uTime*0.95); float fine=sin((vUv.x*21.0+vUv.y*8.0)-uTime*1.7); vec3 color=uTint + vec3(0.025,0.10,0.14)*(0.5+0.5*flow) + vec3(0.03,0.10,0.11)*pow(max(fine,0.0),9.0); gl_FragColor=vec4(color,0.88); }`,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(8.9, 2.0, 36, 10), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.39, 2.65);
  scene.add(water);
  for (const bank of [1.62, 3.68]) box(scene, [8.9, 0.16, 0.13], [0, -0.31, bank], darkMat);
  const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.72, 0.33, 8), edgeMat);
  inlet.position.set(-4.4, -0.25, 2.65);
  scene.add(inlet);
  const inletWater = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 8), cyanMat);
  inletWater.position.set(-4.4, -0.07, 2.65);
  scene.add(inletWater);
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 1.1, 0.18, 16), edgeMat);
  basin.position.set(4.36, -0.38, 2.65);
  scene.add(basin);
  const basinWater = new THREE.Mesh(new THREE.CircleGeometry(0.91, 24), waterMaterial);
  basinWater.rotation.x = -Math.PI / 2;
  basinWater.position.set(4.36, -0.27, 2.65);
  scene.add(basinWater);

  const scout = new THREE.Group();
  scout.position.set(-2.65, 0.05, outpostSpace.scoutLaneZ);
  scout.rotation.y = Math.PI / 2;
  scene.add(scout);
  box(scout, [0.45, 0.58, 0.38], [0, 0.52, 0], amberMat);
  ball(scout, 0.29, [0, 1.02, 0], mat(0xffd8aa));
  box(scout, [0.22, 0.11, 0.18], [0, 1.29, 0], darkMat);
  box(scout, [0.26, 0.08, 0.32], [0.11, 1.22, 0.09], darkMat);
  box(scout, [0.14, 0.36, 0.43], [-0.27, 0.62, -0.04], edgeMat);
  for (const eye of [-0.11, 0.11]) ball(scout, 0.045, [eye, 1.05, 0.26], darkMat);
  const scoutLegs = [-1, 1].map((side) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.13, 0.27, 0);
    scout.add(leg);
    box(leg, [0.13, 0.25, 0.16], [0, -0.12, 0], darkMat);
    return leg;
  });
  const scoutArm = new THREE.Group();
  scoutArm.position.set(0.28, 0.78, 0);
  scout.add(scoutArm);
  box(scoutArm, [0.13, 0.4, 0.16], [0.04, -0.19, 0], mat(0xffd8aa));
  const packet = new THREE.Group();
  packet.position.set(-1.65, 0.38, outpostSpace.scoutLaneZ);
  scene.add(packet);
  const packetBody = box(packet, [0.48, 0.26, 0.36], [0, 0, 0], cyanMat);
  box(packet, [0.52, 0.035, 0.06], [0, 0.15, 0], darkMat);
  const sentinel = new THREE.Group();
  sentinel.position.set(2.35, 0.05, outpostSpace.sentinelLaneZ);
  sentinel.rotation.y = facingYaw(2.35, outpostSpace.sentinelLaneZ, scout.position.x, scout.position.z);
  scene.add(sentinel);
  box(sentinel, [0.55, 0.78, 0.45], [0, 0.49, 0], mat(0x8e89cd));
  const sentinelHead = new THREE.Group();
  sentinelHead.position.set(0, 1.06, 0);
  sentinel.add(sentinelHead);
  ball(sentinelHead, 0.33, [0, 0, 0], mat(0xbab4ef));
  const sentinelArm = new THREE.Group();
  sentinelArm.position.set(-0.34, 0.79, 0);
  sentinel.add(sentinelArm);
  box(sentinelArm, [0.16, 0.5, 0.19], [-0.04, -0.22, 0], mat(0xbab4ef));
  for (const eye of [-0.12, 0.12]) ball(sentinelHead, 0.045, [eye, 0.04, 0.29], darkMat);
  box(sentinelHead, [0.08, 0.32, 0.08], [0, 0.39, 0], edgeMat);
  ball(sentinelHead, 0.10, [0, 0.58, 0], cyanMat);

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
  let decision: Decision | null = null;
  let paused = false;
  let active = true;
  let visible = true;
  let pageSuspended = false;
  let animationTime = 0;
  let lastFrame = 0;
  let previousTime = 0;
  let pointerShift = 0;
  let cameraShift = 0;
  let lastScoutX = scout.position.x;
  const onPointerMove = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointerShift = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 0.55;
  };
  const onPointerLeave = () => { pointerShift = 0; };
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  const projectBubble = (actor: 'scout' | 'sentinel' | 'audit', object: THREE.Object3D, height: number, occupied: DOMRect[]) => {
    const bubble = host.querySelector<HTMLElement>(`[data-bubble="${actor}"]`);
    if (!bubble || bubble.dataset.visible !== 'true') return;
    const point = new THREE.Vector3(0, height, 0).applyMatrix4(object.matrixWorld).project(camera);
    const width = host.clientWidth;
    const sceneHeight = host.clientHeight;
    const mobile = width < 600;
    const bubbleWidth = bubble.offsetWidth;
    const bubbleHeight = bubble.offsetHeight;
    if (point.z < -1 || point.z > 1 || (!mobile && (Math.abs(point.x) > 1 || Math.abs(point.y) > 1))) {
      bubble.dataset.projected = 'offscreen';
      return;
    }
    bubble.dataset.projected = 'inside';
    let left = mobile ? (width - bubbleWidth) / 2 : (point.x * 0.5 + 0.5) * width - bubbleWidth / 2;
    let top = mobile ? sceneHeight - bubbleHeight - 12 : (-point.y * 0.5 + 0.5) * sceneHeight - bubbleHeight - 12;
    left = THREE.MathUtils.clamp(left, 10, Math.max(10, width - bubbleWidth - 10));
    top = THREE.MathUtils.clamp(top, 10, Math.max(10, sceneHeight - bubbleHeight - 10));
    // Dialogue is single-speaker today; retain non-overlap if a future beat shows two speakers.
    for (const used of occupied) {
      if (left < used.right + 8 && left + bubbleWidth > used.left - 8 && top < used.bottom + 8 && top + bubbleHeight > used.top - 8) {
        top = Math.max(10, used.top - bubbleHeight - 8);
      }
    }
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    occupied.push(new DOMRect(left, top, bubbleWidth, bubbleHeight));
  };
  const updateBubbles = () => {
    scene.updateMatrixWorld(true);
    const occupied: DOMRect[] = [];
    projectBubble('scout', scout, 1.65, occupied);
    projectBubble('sentinel', sentinel, 1.8, occupied);
    projectBubble('audit', auditBeacon, 0.42, occupied);
  };
  const render = () => { updateBubbles(); renderer.render(scene, camera); };
  const framingPoints = [
    [-5.05, -0.5, 1.9], [-5.05, -0.5, 3.4], [-5.05, 0.4, 3.4],
    [5.5, -0.6, 1.5], [5.5, -0.6, 3.85], [5.5, 0.5, 3.85],
    [-4.45, -0.4, -1.6], [-4.45, 0.7, 1.6], [4.45, -0.4, -1.6], [4.45, 0.7, 1.6],
    [1.35, 3.2, -1.4], [1.35, 3.2, 1.4], [-3.2, 1.8, 0.35], [3.4, 1.8, 0.35],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  let cameraBase = new THREE.Vector3(3, 8.5, 14);
  let cameraTarget = new THREE.Vector3(0, 0.7, 1.1);
  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    cameraBase.set(3, 8.5, 14);
    cameraTarget.set(0, 0.7, 1.1);
    camera.position.copy(cameraBase);
    camera.lookAt(cameraTarget);
    camera.updateMatrixWorld(true);
    const local = framingPoints.map((point) => point.clone().applyMatrix4(camera.matrixWorldInverse));
    const minX = Math.min(...local.map((point) => point.x));
    const maxX = Math.max(...local.map((point) => point.x));
    const minY = Math.min(...local.map((point) => point.y));
    const maxY = Math.max(...local.map((point) => point.y));
    const safe = width < 600 ? { left: 0.055, right: 0.945, top: 0.06, bottom: 0.74 } : { left: 0.04, right: 0.96, top: 0.06, bottom: 0.94 };
    const halfHeight = Math.max((maxY - minY) / (2 * (safe.bottom - safe.top)), (maxX - minX) / (2 * aspect * (safe.right - safe.left))) * 1.05;
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    const desiredX = (safe.left + safe.right - 1) * halfHeight * aspect;
    const desiredY = (1 - safe.top - safe.bottom) * halfHeight;
    const offset = right.multiplyScalar((minX + maxX) / 2 - desiredX).add(up.multiplyScalar((minY + maxY) / 2 - desiredY));
    cameraBase.add(offset);
    cameraTarget.add(offset);
    camera.position.copy(cameraBase);
    camera.lookAt(cameraTarget);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const visibility = new IntersectionObserver((entries) => {
    visible = (entries[0]?.intersectionRatio ?? 0) >= 0.1;
    onVisibilityChange(visible && !document.hidden);
    updateLoop();
  }, { threshold: [0, 0.1] });
  visibility.observe(host);
  const onPageVisibility = () => {
    onVisibilityChange(visible && !document.hidden);
    updateLoop();
  };
  const onPageHide = () => { pageSuspended = true; onVisibilityChange(false); updateLoop(); };
  const onPageShow = () => { pageSuspended = false; onVisibilityChange(visible && !document.hidden); updateLoop(); };
  document.addEventListener('visibilitychange', onPageVisibility);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  function updateLoop() {
    renderer.setAnimationLoop(active && visible && !pageSuspended && !document.hidden && !reducedMotion && !paused ? tick : null);
    if (active && visible && (reducedMotion || paused)) render();
  }
  function tick(time: number) {
    if (time - lastFrame < 32) return;
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.06) : 0;
    previousTime = time;
    lastFrame = time;
    animationTime += delta;
    waterUniforms.uTime.value = animationTime;
    applyTargets(Math.min(1, delta * 3.1));
    const walking = Math.abs(scout.position.x - lastScoutX) > 0.002;
    lastScoutX = scout.position.x;
    scout.position.y = 0.05 + (walking ? Math.sin(animationTime * 11) * 0.045 : Math.sin(animationTime * 2) * 0.012);
    scoutLegs[0].rotation.z = walking ? Math.sin(animationTime * 11) * 0.28 : 0;
    scoutLegs[1].rotation.z = walking ? -Math.sin(animationTime * 11) * 0.28 : 0;
    sentinelHead.rotation.z = phase === 'examine' ? -0.12 : Math.sin(animationTime * 1.6) * 0.025;
    auditBeacon.scale.setScalar(phase === 'audit' ? 1.1 + Math.sin(animationTime * 6) * 0.1 : 1);
    render();
  }
  function applyTargets(amount: number) {
    const targets = visualTargets(phase, decision);
    const move = (current: number, target: number) => current + (target - current) * amount;
    const gateReady = gateBarrier.position.y >= 2.14 || amount >= 1;
    const returningThroughGate = phase === 'recover' && decision === 'ALLOW' && scout.position.x > outpostSpace.closedPacketLimitX;
    const gateTarget = returningThroughGate ? 2.48 : targets.gateY;
    const waitingForGate = phase === 'allow' && !gateReady;
    scout.position.x = move(scout.position.x, waitingForGate ? 0.1 : targets.scoutX);
    scout.position.z = move(scout.position.z, targets.scoutZ);
    const facings = targetFacings(phase, decision, targets);
    scout.rotation.y = turnToward(scout.rotation.y, facings.scout, amount);
    sentinel.rotation.y = turnToward(sentinel.rotation.y, facings.sentinel, amount);
    packet.position.x = move(packet.position.x, waitingForGate ? 0.72 : targets.packetX);
    packet.position.z = move(packet.position.z, targets.packetZ);
    packet.position.y = move(packet.position.y, targets.packetY);
    packet.visible = !(phase === 'recover' && decision === 'ALLOW');
    scoutArm.rotation.z = move(scoutArm.rotation.z, ['pickup', 'travel', 'examine', 'allow', 'deny'].includes(phase) ? -0.82 : 0);
    sentinelArm.rotation.z = move(sentinelArm.rotation.z, targets.sentinelArmZ);
    gateBarrier.position.y = move(gateBarrier.position.y, gateTarget);
    gateLamp.scale.y = phase === 'examine' ? 1.5 : 1;
    const targetShift = targets.cameraFocusX * 0.3 + pointerShift * 0.25;
    cameraShift = move(cameraShift, targetShift);
    camera.position.copy(cameraBase).add(new THREE.Vector3(cameraShift, 0, 0));
    camera.lookAt(cameraTarget.clone().add(new THREE.Vector3(cameraShift, 0, 0)));
  }
  resize();
  updateLoop();

  // Read-only inspection hook for viewport and clearance regression checks.
  type InspectableHost = HTMLElement & { outpostInspection?: () => unknown };
  const inspectedHost = host as InspectableHost;
  const projectedBounds = (object: THREE.Object3D) => {
    const bounds = new THREE.Box3().setFromObject(object);
    const points = [
      [bounds.min.x, bounds.min.y, bounds.min.z], [bounds.min.x, bounds.min.y, bounds.max.z],
      [bounds.min.x, bounds.max.y, bounds.min.z], [bounds.min.x, bounds.max.y, bounds.max.z],
      [bounds.max.x, bounds.min.y, bounds.min.z], [bounds.max.x, bounds.min.y, bounds.max.z],
      [bounds.max.x, bounds.max.y, bounds.min.z], [bounds.max.x, bounds.max.y, bounds.max.z],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z).project(camera));
    return {
      left: Math.min(...points.map((point) => (point.x + 1) * host.clientWidth / 2)),
      right: Math.max(...points.map((point) => (point.x + 1) * host.clientWidth / 2)),
      top: Math.min(...points.map((point) => (1 - point.y) * host.clientHeight / 2)),
      bottom: Math.max(...points.map((point) => (1 - point.y) * host.clientHeight / 2)),
    };
  };
  inspectedHost.outpostInspection = () => {
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const facing = (character: THREE.Object3D, target: THREE.Object3D) => {
      const front = new THREE.Vector3(0, 0, 1).applyQuaternion(character.getWorldQuaternion(new THREE.Quaternion()));
      const toward = target.getWorldPosition(new THREE.Vector3()).sub(character.getWorldPosition(new THREE.Vector3())).normalize();
      return front.dot(toward);
    };
    const bubbles = [...host.querySelectorAll<HTMLElement>('[data-bubble][data-visible="true"]')].map((bubble) => {
      const box = bubble.getBoundingClientRect();
      const stage = host.getBoundingClientRect();
      return { left: box.left - stage.left, right: box.right - stage.left, top: box.top - stage.top, bottom: box.bottom - stage.top };
    });
    return {
      phase, decision, width: host.clientWidth, height: host.clientHeight,
      objects: { scout: projectedBounds(scout), sentinel: projectedBounds(sentinel), packet: projectedBounds(packet), gate: projectedBounds(gateGroup), barrier: projectedBounds(gateBarrier), nearRail: projectedBounds(railGroups[1]), farRail: projectedBounds(railGroups[0]), water: projectedBounds(water), inlet: projectedBounds(inlet), basin: projectedBounds(basin), audit: projectedBounds(auditBeacon) },
      facing: { scoutToSentinel: facing(scout, sentinel), sentinelToScout: facing(sentinel, scout) },
      world: { scoutX: scout.position.x, scoutZ: scout.position.z, sentinelX: sentinel.position.x, sentinelZ: sentinel.position.z, packetX: packet.position.x, packetY: packet.position.y, packetVisible: packet.visible, gateY: gateBarrier.position.y, gateBottomY: gateBarrier.position.y - 0.675 },
      bubbles,
    };
  };

  return {
    setPhase(nextPhase, nextDecision) {
      phase = nextPhase;
      decision = nextDecision;
      const showingOutcome = ['allow', 'deny', 'audit'].includes(phase);
      gateMat.color.setHex(showingOutcome && decision === 'ALLOW' ? 0x78ebc0 : showingOutcome && decision === 'DENY' ? 0xff718e : palette.violet);
      gateMat.emissive.copy(gateMat.color);
      auditMat.color.setHex(phase === 'audit' && decision === 'ALLOW' ? 0x78ebc0 : phase === 'audit' && decision === 'DENY' ? 0xff718e : palette.amber);
      auditMat.emissive.copy(auditMat.color);
      if (nextPhase === 'idle') packet.position.set(-1.65, 0.38, outpostSpace.scoutLaneZ);
      if (reducedMotion || paused) {
        applyTargets(1);
        render();
      }
    },
    setPaused(nextPaused) {
      paused = nextPaused;
      updateLoop();
    },
    dispose() {
      active = false;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onPageVisibility);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      delete inspectedHost.outpostInspection;
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
