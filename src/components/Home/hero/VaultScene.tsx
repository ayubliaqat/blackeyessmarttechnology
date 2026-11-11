"use client";

import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/* ==========================================================================
   Helpers
   ========================================================================== */
const CYAN = "#1ce8f0";
const BG = "#000810";
const BASE_FOV = 38;
/** Camera distance at scroll 0 (pulled back so the wall devices fit on screen) */
const START_Z = 10.2;

const { lerp, damp, degToRad } = THREE.MathUtils;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const CYAN_C = new THREE.Color(CYAN);
const GREEN_C = new THREE.Color("#3dffa0");

/** Shared materials live at module level so they can be animated per frame */
const MAT = {
  cyan: new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false }),
  dim: new THREE.MeshBasicMaterial({ color: "#0b7a87", toneMapped: false }),
  iris: new THREE.MeshBasicMaterial({
    color: CYAN,
    toneMapped: false,
    transparent: true,
  }),
  scan: new THREE.MeshBasicMaterial({
    color: "#c4fdff",
    toneMapped: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  strip: new THREE.MeshBasicMaterial({
    color: "#0fb8c2",
    toneMapped: false,
    transparent: true,
    opacity: 0.55,
  }),
};

/** Camera + thumb scanner materials, module level like MAT so they can be animated per frame */
const CCTV_MAT = {
  led: new THREE.MeshBasicMaterial({ color: "#ff3b4a", toneMapped: false }),
  cone: new THREE.MeshBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  }),
};

const THUMB_MAT = {
  print: new THREE.MeshBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0.7,
    toneMapped: false,
  }),
  led: new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false }),
  line: new THREE.MeshBasicMaterial({
    color: "#c4fdff",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }),
  pulse: new THREE.MeshBasicMaterial({
    color: "#3dffa0",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }),
  bar: new THREE.MeshBasicMaterial({ color: "#0fb8c2", toneMapped: false }),
  thumb: new THREE.MeshBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }),
};

/** Deterministic random so the scene is identical on every render */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Camera path: [scroll progress, camera z] */
const PATH: Array<[number, number]> = [
  [0, START_Z],
  [0.2, 7.4],
  [0.4, 6.0],
  [0.7, 3.0],
  [1, -22],
];
function camZ(p: number) {
  for (let i = 0; i < PATH.length - 1; i++) {
    const [p0, z0] = PATH[i];
    const [p1, z1] = PATH[i + 1];
    if (p <= p1) return lerp(z0, z1, remap(p, p0, p1));
  }
  return PATH[PATH.length - 1][1];
}

type SceneProps = {
  /** scroll progress 0..1, written by the Hero section */
  target: { current: number };
  desktop: boolean;
  reduced: boolean;
};

/* ==========================================================================
   Small building blocks
   ========================================================================== */
function Arcs({
  inner,
  outer,
  count,
  length,
  z,
  material,
}: {
  inner: number;
  outer: number;
  count: number;
  length: number;
  z: number;
  material: THREE.Material;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, k) => (
        <mesh key={k} position={[0, 0, z]} material={material}>
          <ringGeometry
            args={[inner, outer, 48, 1, (k * Math.PI * 2) / count, length]}
          />
        </mesh>
      ))}
    </>
  );
}

type AnimRef = { current: { smooth: number; intro: number } };

/** Where the thumb scanner sits on the wall before it flies out */
const SCANNER_HOME: [number, number, number] = [3.4, -1.1, 0];

/** CCTV bullet camera: patrols, follows the pointer, locks onto the scanner while it scans */
function CctvCamera({
  position,
  scale = 1,
  anim,
}: {
  position: [number, number, number];
  scale?: number;
  anim: AnimRef;
}) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const iris = useRef<THREE.Mesh>(null);
  const mats = CCTV_MAT;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = anim.current.smooth;
    /* camera comes in first: scales up from the wall during the intro */
    if (body.current) {
      const k = easeOut(clamp01(anim.current.intro * 1.6));
      body.current.scale.setScalar(Math.max(k, 0.001) * scale);
    }
    if (head.current) {
      /* wide patrol sweep that lingers at each end, plus follows the pointer */
      const s = Math.sin(t * 0.55);
      const patrol = Math.sign(s) * Math.pow(Math.abs(s), 0.6) * 0.75;
      let yaw = patrol + state.pointer.x * 0.4;
      let pitch = -0.28 + Math.sin(t * 0.8) * 0.06 - state.pointer.y * 0.18;
      /* lock onto the scanner while it is being used */
      const lock = smooth(remap(p, 0.06, 0.14)) * (1 - smooth(remap(p, 0.32, 0.42)));
      yaw = lerp(yaw, -0.55, lock);
      pitch = lerp(pitch, -0.3, lock);
      head.current.rotation.y = damp(head.current.rotation.y, yaw, 5, dt);
      head.current.rotation.x = damp(head.current.rotation.x, pitch, 5, dt);
      head.current.rotation.z = Math.sin(t * 1.3) * 0.015;
    }
    mats.led.color.set(Math.sin(t * 4) > 0 ? "#ff3b4a" : "#4a0f16");
    mats.cone.opacity = 0.04 + 0.025 * (0.5 + 0.5 * Math.sin(t * 1.4));
    if (iris.current) iris.current.scale.setScalar(0.85 + 0.15 * Math.sin(t * 2.2));
  });

  return (
    <group ref={body} position={position} scale={0.001}>
      {/* wall plate, arm, ball joint */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.62, 0.62, 0.08]} />
        <meshStandardMaterial color="#0b1622" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.3]}>
        <boxGeometry args={[0.14, 0.14, 0.5]} />
        <meshStandardMaterial color="#8fa6b8" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.56]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#8fa6b8" metalness={1} roughness={0.25} />
      </mesh>

      {/* pan / tilt head */}
      <group ref={head} position={[0, 0, 0.56]}>
        <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 1.1, 48]} />
          <meshStandardMaterial color="#d7e2ea" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.31, 0.5]}>
          <boxGeometry args={[0.62, 0.035, 1.3]} />
          <meshStandardMaterial color="#0b1622" metalness={1} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.96]}>
          <torusGeometry args={[0.23, 0.035, 16, 48]} />
          <meshStandardMaterial color="#0b1622" metalness={1} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.955]}>
          <circleGeometry args={[0.21, 48]} />
          <meshPhysicalMaterial
            color="#010a12"
            metalness={0.2}
            roughness={0.04}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={iris} position={[0, 0, 0.962]} material={MAT.cyan}>
          <ringGeometry args={[0.06, 0.085, 32]} />
        </mesh>
        <mesh position={[-0.17, 0.17, 0.958]} material={mats.led}>
          <circleGeometry args={[0.032, 16]} />
        </mesh>
        <mesh
          position={[0, 0, 2.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={mats.cone}
        >
          <coneGeometry args={[1.5, 3.6, 40, 1, true]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Thumb scanner.
 * - scroll 0 - 0.1: idle, loops scan -> granted on its own
 * - scroll 0.06 - 0.2: flies out in front of the door and gets bigger
 * - scroll 0.14 - 0.32: a thumb presses the pad and the scan runs
 * - scroll 0.32+: access granted (green), then it returns to the wall
 */
function ThumbScanner({ anim }: { anim: AnimRef }) {
  const group = useRef<THREE.Group>(null);
  const scanLine = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const thumb = useRef<THREE.Group>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const grant = useRef(0);
  const mats = THUMB_MAT;

  /* concentric broken arcs read as a fingerprint */
  const arcs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        r: 0.08 + i * 0.042,
        start: i * 0.9,
        len: Math.PI * (1.15 + (i % 3) * 0.25),
      })),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = anim.current.smooth;

    const auto = p < 0.06;
    const c = t % 7;
    const sp = remap(p, 0.1, 0.28);
    const scanning = auto ? c < 3.6 : sp > 0 && sp < 1;
    const s = auto ? c / 3.6 : sp;
    const granted = auto ? (c >= 3.6 && c < 5.8 ? 1 : 0) : p >= 0.28 ? 1 : 0;
    const pt = auto ? Math.min(Math.max(0, c - 3.6) / 1.2, 1) : remap(p, 0.28, 0.36);

    /* fly out in front of the door, then return to the wall */
    const fly = smooth(remap(p, 0.04, 0.14)) * (1 - smooth(remap(p, 0.32, 0.4)));
    if (group.current) {
      group.current.position.set(
        lerp(SCANNER_HOME[0], 0, fly),
        lerp(SCANNER_HOME[1], 0, fly),
        lerp(SCANNER_HOME[2], 2.4, fly),
      );
      group.current.scale.setScalar(lerp(0.9, 1.25, fly));
    }

    /* scan line */
    if (scanLine.current) scanLine.current.position.y = Math.sin(s * Math.PI * 3) * 0.34;
    mats.line.opacity = scanning ? 0.75 : 0;

    /* thumb presses the pad while scanning */
    const press = scanning
      ? smooth(Math.min(s * 5, 1)) * (1 - smooth(remap(s, 0.92, 1)))
      : 0;
    mats.thumb.opacity = press * 0.4;
    if (thumb.current) thumb.current.position.z = lerp(1.0, 0.2, press);

    /* granted: print + LED turn green, ring pulse expands */
    grant.current = damp(grant.current, granted, 8, dt);
    mats.print.color.copy(CYAN_C).lerp(GREEN_C, grant.current);
    mats.led.color.copy(CYAN_C).lerp(GREEN_C, grant.current);
    mats.print.opacity = scanning ? 0.35 + 0.4 * s + 0.15 * Math.sin(t * 6) : 0.9;

    if (pulse.current) {
      pulse.current.scale.setScalar(1 + pt * 0.9);
      mats.pulse.opacity = granted && pt < 1 ? (1 - pt) * 0.8 : 0;
    }

    bars.current.forEach((b, i) => {
      if (!b) return;
      const h = scanning
        ? 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i * 0.9))
        : granted
          ? 1
          : 0.25;
      b.scale.y = damp(b.scale.y, h, 10, dt);
    });
  });

  return (
    <group ref={group} position={SCANNER_HOME} scale={0.9}>
      {/* housing + face */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[1.5, 2.2, 0.24]} />
        <meshStandardMaterial color="#0b1622" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.245]}>
        <boxGeometry args={[1.38, 2.08, 0.02]} />
        <meshStandardMaterial color="#050d16" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* signal bars */}
      <group position={[-0.38, 0.8, 0.26]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              bars.current[i] = el;
            }}
            position={[i * 0.19, 0, 0]}
            material={mats.bar}
          >
            <planeGeometry args={[0.1, 0.16]} />
          </mesh>
        ))}
      </group>

      {/* glass pad */}
      <group position={[0, -0.1, 0.26]}>
        <mesh>
          <circleGeometry args={[0.52, 64]} />
          <meshPhysicalMaterial color="#010a12" roughness={0.05} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, 0.004]}>
          <torusGeometry args={[0.55, 0.025, 16, 96]} />
          <meshStandardMaterial color="#8fa6b8" metalness={1} roughness={0.25} />
        </mesh>
        {arcs.map((a, i) => (
          <mesh key={i} position={[0, 0, 0.006]} material={mats.print}>
            <ringGeometry args={[a.r, a.r + 0.016, 40, 1, a.start, a.len]} />
          </mesh>
        ))}
        <mesh ref={scanLine} position={[0, 0, 0.01]} material={mats.line}>
          <planeGeometry args={[0.86, 0.03]} />
        </mesh>
        <mesh ref={pulse} position={[0, 0, 0.008]} material={mats.pulse}>
          <ringGeometry args={[0.5, 0.54, 64]} />
        </mesh>

        {/* holographic thumb */}
        <group ref={thumb} position={[0, -0.1, 1]} rotation={[0.55, 0, 0]}>
          <mesh material={mats.thumb}>
            <capsuleGeometry args={[0.17, 0.5, 8, 20]} />
          </mesh>
        </group>
      </group>

      {/* status LED */}
      <mesh position={[0, -0.86, 0.26]} material={mats.led}>
        <circleGeometry args={[0.045, 24]} />
      </mesh>
    </group>
  );
}

/* ==========================================================================
   Scene
   ========================================================================== */
function Experience({ target, desktop, reduced }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const pivot = useRef<THREE.Group>(null);
  const ringsA = useRef<THREE.Group>(null);
  const ringsB = useRef<THREE.Group>(null);
  const irisA = useRef<THREE.Group>(null);
  const irisB = useRef<THREE.Group>(null);
  const irisAll = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const bolts = useRef<(THREE.Mesh | null)[]>([]);
  const tunnel = useRef<THREE.Group>(null);
  const holo = useRef<THREE.Group>(null);
  const innerLight = useRef<THREE.PointLight>(null);
  const anim = useRef({ smooth: 0, intro: 0, px: 0, py: 0 });

  /* ----- wall with a circular hole ----- */
  const wallGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-16, -10);
    shape.lineTo(16, -10);
    shape.lineTo(16, 10);
    shape.lineTo(-16, 10);
    shape.closePath();
    const hole = new THREE.Path();
    hole.absarc(0, 0, 2.5, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.8,
      bevelEnabled: false,
      curveSegments: 96,
    });
  }, []);

  /* ----- glow texture for the portal at the end of the tunnel ----- */
  const portalTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(150,250,255,0.95)");
    grad.addColorStop(0.6, "rgba(28,232,240,0.35)");
    grad.addColorStop(1, "rgba(28,232,240,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  /* ----- particles inside the tunnel ----- */
  const particles = useMemo(() => {
    const rand = mulberry32(7);
    const n = 700;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const r = 0.3 + rand() * 1.8;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r;
      arr[i * 3 + 2] = -1.5 - rand() * 27;
    }
    return arr;
  }, []);

  /* ----- floating holograms inside the tunnel ----- */
  const holoItems = useMemo(() => {
    const rand = mulberry32(21);
    return Array.from({ length: 7 }, (_, i) => {
      const a = rand() * Math.PI * 2;
      const r = 1.1 + rand() * 0.6;
      return {
        pos: [Math.cos(a) * r, Math.sin(a) * r, -4 - i * 3.2] as [
          number,
          number,
          number,
        ],
        size: 0.28 + rand() * 0.22,
        kind: i % 3,
      };
    });
  }, []);

  /* ----- instanced tick marks around the dial ----- */
  const setTicks = useCallback((mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    const e = new THREE.Euler();
    const count = 72;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const long = i % 6 === 0;
      pos.set(Math.cos(a) * 1.3, Math.sin(a) * 1.3, 0);
      e.set(0, 0, a);
      q.setFromEuler(e);
      scl.set(long ? 0.18 : 0.08, long ? 0.016 : 0.01, 1);
      m.compose(pos, q, scl);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  /* ----- animation ----- */
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const a = anim.current;
    const t = state.clock.elapsedTime;

    a.intro = Math.min(1, a.intro + dt / 2.2);
    const ie = easeOut(a.intro);

    const tgt = reduced ? 0.18 : target.current;
    a.smooth = damp(a.smooth, tgt, 5, dt);
    const p = a.smooth;

    a.px = damp(a.px, state.pointer.x, 3, dt);
    a.py = damp(a.py, state.pointer.y, 3, dt);

    /* camera */
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const fit = Math.max(
      1,
      3.0 / (aspect * Math.tan(degToRad(BASE_FOV / 2)) * START_Z),
    );
    const zScale = lerp(fit, 1, smooth(remap(p, 0.35, 0.7)));
    const zRaw = camZ(p) + (1 - ie) * 7;
    const z = zRaw > 0 ? zRaw * zScale : zRaw;
    const amp = 0.4 * (1 - remap(p, 0.4, 0.7));
    cam.position.set(a.px * amp, a.py * amp * 0.6, z);
    cam.lookAt(a.px * amp * 0.3, a.py * amp * 0.2, z - 10);
    cam.fov = lerp(BASE_FOV, 62, smooth(remap(p, 0.72, 1)));
    cam.updateProjectionMatrix();

    /* scene placement: door sits right of the text on desktop, above it on mobile */
    const shift = 1 - smooth(remap(p, 0, 0.22));
    if (root.current) {
      root.current.position.x = desktop ? 2.4 * shift : 0;
      root.current.position.y = desktop ? 0 : 0.12 * Math.max(z, 0) * shift;
      const calm = 1 - remap(p, 0.3, 0.5);
      root.current.rotation.y = a.px * 0.08 * calm;
      root.current.rotation.x = -a.py * 0.05 * calm;
    }

    /* scanner */
    const power = lerp(0.45, 1, smooth(remap(p, 0, 0.18)));
    MAT.iris.opacity = (0.55 + 0.45 * power) * (0.88 + 0.12 * Math.sin(t * 3));
    if (irisAll.current) irisAll.current.scale.setScalar(0.8 + 0.2 * power);
    if (irisA.current) irisA.current.rotation.z = -t * (0.4 + 1.6 * power);
    if (irisB.current) irisB.current.rotation.z = t * (0.6 + 1.2 * power);
    if (scan.current) {
      const y = Math.sin(t * 1.6) * 0.62;
      scan.current.position.y = y;
      scan.current.scale.x = 2 * Math.sqrt(Math.max(0.8 * 0.8 - y * y, 0)) * 0.97;
      MAT.scan.opacity = 0.35 + 0.5 * power;
    }

    /* locking mechanism */
    const bolt = easeInOut(remap(p, 0.32, 0.42));
    const boltR = lerp(2.55, 1.98, bolt);
    bolts.current.forEach((b) => {
      if (b) b.position.x = boltR;
    });
    if (ringsA.current) ringsA.current.rotation.z = t * 0.12 + bolt * 1.4;
    if (ringsB.current) ringsB.current.rotation.z = -t * 0.08 - bolt * 2.2;

    /* door opening */
    const open = easeInOut(remap(p, 0.4, 0.68));
    if (pivot.current) pivot.current.rotation.y = -open * 1.85;
    if (innerLight.current) innerLight.current.intensity = 1 + open * 34;

    /* tunnel */
    if (tunnel.current) tunnel.current.rotation.z = t * 0.05 + p * 1.4;
    if (holo.current) {
      holo.current.children.forEach((c, i) => {
        c.rotation.x = t * 0.4 + i;
        c.rotation.y = t * 0.55 + i * 0.7;
      });
    }
  });

  const boltAngles = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2),
    [],
  );

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 46]} />

      <ambientLight intensity={0.18} />
      <directionalLight
        position={[-5, 6, 8]}
        intensity={1.4}
        color="#bfefff"
      />
      <pointLight
        ref={innerLight}
        position={[0, 0, -1.5]}
        color={CYAN}
        intensity={1}
        distance={16}
        decay={2}
      />

      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-5, 3, 6]}
          scale={[7, 2, 1]}
          color="#cfefff"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[6, -1, 5]}
          scale={[3, 7, 1]}
          color={CYAN}
        />
        <Lightformer
          form="ring"
          intensity={1}
          position={[0, 0, -6]}
          scale={6}
          color="#7ff4ff"
        />
      </Environment>

      <group ref={root}>
        {/* ---------------- Wall ---------------- */}
        <mesh geometry={wallGeometry} position={[0, 0, -0.8]}>
          <meshStandardMaterial color="#06101b" metalness={0.85} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[2.5, 0.05, 16, 160]} />
          <meshStandardMaterial color="#1a2c3d" metalness={1} roughness={0.3} />
        </mesh>
        {/* decorative arcs on the wall */}
        <Arcs inner={3.38} outer={3.4} count={4} length={1.1} z={0.012} material={MAT.dim} />
        <Arcs inner={4.5} outer={4.52} count={3} length={1.6} z={0.012} material={MAT.dim} />
        {/* lock housings */}
        {boltAngles.map((ang, i) => (
          <group key={i} rotation={[0, 0, ang]}>
            <mesh position={[2.78, 0, -0.2]}>
              <boxGeometry args={[0.55, 0.3, 0.5]} />
              <meshStandardMaterial color="#0a1a28" metalness={0.9} roughness={0.4} />
            </mesh>
            <mesh position={[2.9, 0, 0.056]} material={MAT.cyan}>
              <planeGeometry args={[0.1, 0.035]} />
            </mesh>
          </group>
        ))}

        {/* ---------------- CCTV camera + thumb scanner (desktop only) ---------------- */}
        {desktop && <CctvCamera position={[3.3, 2.1, 0]} scale={0.9} anim={anim} />}
        <ThumbScanner anim={anim} />

        {/* ---------------- Door (hinged on the left edge) ---------------- */}
        <group ref={pivot} position={[-2.3, 0, 0.05]}>
          <group position={[2.3, 0, 0]}>
            {/* body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.3, 2.3, 0.4, 128]} />
              <meshStandardMaterial color="#0b1622" metalness={1} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0, 0.2]}>
              <torusGeometry args={[2.3, 0.09, 24, 160]} />
              <meshStandardMaterial color="#1b2c3c" metalness={1} roughness={0.25} />
            </mesh>

            {/* face rings */}
            {[2.05, 1.62, 1.12].map((r) => (
              <mesh key={r} position={[0, 0, 0.203]} material={MAT.dim}>
                <ringGeometry args={[r, r + 0.014, 160]} />
              </mesh>
            ))}
            <group ref={ringsA}>
              <Arcs inner={1.84} outer={1.9} count={3} length={1.35} z={0.206} material={MAT.cyan} />
            </group>
            <group ref={ringsB}>
              <Arcs inner={1.4} outer={1.44} count={5} length={0.7} z={0.206} material={MAT.cyan} />
            </group>
            <instancedMesh
              ref={setTicks}
              args={[undefined, undefined, 72]}
              position={[0, 0, 0.205]}
              material={MAT.dim}
            >
              <planeGeometry args={[1, 1]} />
            </instancedMesh>

            {/* biometric scanner */}
            <mesh position={[0, 0, 0.215]}>
              <circleGeometry args={[0.82, 64]} />
              <meshPhysicalMaterial
                color="#010a12"
                metalness={0.3}
                roughness={0.05}
                clearcoat={1}
                clearcoatRoughness={0.05}
              />
            </mesh>
            <mesh position={[0, 0, 0.22]}>
              <torusGeometry args={[0.86, 0.035, 16, 96]} />
              <meshStandardMaterial color="#9fb4c4" metalness={1} roughness={0.2} />
            </mesh>
            <group ref={irisAll} position={[0, 0, 0.228]}>
              <group ref={irisA}>
                <Arcs inner={0.64} outer={0.69} count={3} length={1.4} z={0} material={MAT.iris} />
              </group>
              <group ref={irisB}>
                <Arcs inner={0.48} outer={0.52} count={4} length={0.9} z={0} material={MAT.iris} />
              </group>
              <mesh material={MAT.iris}>
                <ringGeometry args={[0.35, 0.365, 64]} />
              </mesh>
              <mesh material={MAT.iris}>
                <circleGeometry args={[0.13, 48]} />
              </mesh>
            </group>
            <mesh ref={scan} position={[0, 0, 0.232]} material={MAT.scan}>
              <planeGeometry args={[1, 0.02]} />
            </mesh>

            {/* bolts */}
            {boltAngles.map((ang, i) => (
              <group key={i} rotation={[0, 0, ang]}>
                <mesh
                  ref={(el) => {
                    bolts.current[i] = el;
                  }}
                  position={[2.55, 0, 0]}
                >
                  <boxGeometry args={[0.55, 0.18, 0.18]} />
                  <meshStandardMaterial color="#8fa6b8" metalness={1} roughness={0.25} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* ---------------- Interior tunnel ---------------- */}
        <group ref={tunnel}>
          {Array.from({ length: 16 }, (_, i) => (
            <mesh
              key={i}
              position={[0, 0, -1.4 - i * 1.7]}
              rotation={[0, 0, i * 0.2]}
              material={MAT.cyan}
            >
              <torusGeometry args={[2.3, i % 4 === 0 ? 0.06 : 0.022, 8, 96]} />
            </mesh>
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const ang = (i / 8) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(ang) * 2.25, Math.sin(ang) * 2.25, -14.5]}
                material={MAT.strip}
              >
                <boxGeometry args={[0.03, 0.03, 26]} />
              </mesh>
            );
          })}
        </group>

        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={CYAN}
            size={0.055}
            transparent
            opacity={0.85}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>

        <group ref={holo}>
          {holoItems.map((h, i) => (
            <mesh key={i} position={h.pos} material={MAT.cyan}>
              {h.kind === 0 && <octahedronGeometry args={[h.size, 0]} />}
              {h.kind === 1 && <boxGeometry args={[h.size, h.size, h.size]} />}
              {h.kind === 2 && <icosahedronGeometry args={[h.size, 0]} />}
            </mesh>
          ))}
        </group>

        {/* portal */}
        <mesh position={[0, 0, -30]}>
          <circleGeometry args={[8, 64]} />
          <meshBasicMaterial
            map={portalTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
            fog={false}
          />
        </mesh>
      </group>
    </>
  );
}

/* ==========================================================================
   Canvas wrapper
   ========================================================================== */
type VaultSceneProps = SceneProps & { active: boolean };

export default function VaultScene({
  target,
  desktop,
  reduced,
  active,
}: VaultSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, desktop ? 1.75 : 1.5]}
      camera={{ fov: BASE_FOV, near: 0.1, far: 90, position: [0, 0, 16] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Experience target={target} desktop={desktop} reduced={reduced} />
      <EffectComposer multisampling={desktop ? 4 : 0}>
        <Bloom
          intensity={desktop ? 1.15 : 0.9}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}