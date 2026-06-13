import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Kick.com palette: neon green on near-black
const KICK_GREEN = new THREE.Color('#53fc18');
const DEEP_GREEN = new THREE.Color('#1fae00');
const WHITE = new THREE.Color('#eaffe0');

// Soft round sprite so points / orbs render as glowing blobs.
function makeSprite(): THREE.Texture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.3)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#040604', 0.05);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const sprite = makeSprite();

    // ---- Particle field (green sparks) ----
    const COUNT = 1300;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const tmp = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 46;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36 - 4;

      const r = Math.random();
      if (r > 0.88) tmp.copy(WHITE);
      else if (r > 0.45) tmp.copy(KICK_GREEN);
      else tmp.copy(DEEP_GREEN);
      tmp.multiplyScalar(0.55 + Math.random() * 0.6);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;

      scales[i] = Math.random() * 1.5 + 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 22 * Math.min(window.devicePixelRatio, 2) },
        uTexture: { value: sprite },
      },
      vertexShader: `
        attribute float aScale;
        uniform float uTime;
        uniform float uSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 p = position;
          p.y += sin(uTime * 0.4 + position.x * 0.5) * 0.4;
          p.x += cos(uTime * 0.3 + position.y * 0.5) * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * aScale * (1.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, 1.0) * tex;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ---- Large drifting glow orbs (the signature Kick green bloom) ----
    type Orb = { sprite: THREE.Sprite; baseX: number; baseY: number; z: number; sx: number; sy: number; phase: number };
    const orbs: Orb[] = [];
    const orbConfigs = [
      { color: KICK_GREEN, scale: 26, opacity: 0.22, x: -10, y: 6, z: -10 },
      { color: KICK_GREEN, scale: 20, opacity: 0.18, x: 11, y: -7, z: -8 },
      { color: DEEP_GREEN, scale: 30, opacity: 0.16, x: 6, y: 9, z: -14 },
      { color: KICK_GREEN, scale: 16, opacity: 0.2, x: -9, y: -8, z: -6 },
    ];
    for (const cfg of orbConfigs) {
      const spMat = new THREE.SpriteMaterial({
        map: sprite,
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sp = new THREE.Sprite(spMat);
      sp.scale.set(cfg.scale, cfg.scale, 1);
      sp.position.set(cfg.x, cfg.y, cfg.z);
      scene.add(sp);
      orbs.push({
        sprite: sp,
        baseX: cfg.x,
        baseY: cfg.y,
        z: cfg.z,
        sx: 2 + Math.random() * 2,
        sy: 1.5 + Math.random() * 2,
        phase: cfg.x + cfg.y,
      });
    }

    // ---- Thin green ring arcs for depth ----
    const ringGroup = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const ringGeo = new THREE.TorusGeometry(8 + i * 3.5, 0.025, 16, 140);
      const ringMat = new THREE.MeshBasicMaterial({
        color: KICK_GREEN,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.4 + i * 0.3;
      ring.rotation.y = i * 0.6;
      ring.position.z = -7 - i * 2;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    // ---- Interaction (mouse parallax) ----
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove);

    // ---- Loop ----
    const clock = new THREE.Clock();
    let frameId = 0;
    const render = () => {
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = t;

      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      points.rotation.y = t * 0.03 + current.x * 0.25;
      points.rotation.x = current.y * 0.18;

      ringGroup.rotation.z = t * 0.05;
      ringGroup.rotation.y = t * 0.08 + current.x * 0.2;

      for (const o of orbs) {
        o.sprite.position.x = o.baseX + Math.sin(t * 0.12 + o.phase) * o.sx - current.x * 2;
        o.sprite.position.y = o.baseY + Math.cos(t * 0.1 + o.phase) * o.sy + current.y * 1.5;
        const pulse = 1 + Math.sin(t * 0.5 + o.phase) * 0.06;
        o.sprite.scale.x = o.sprite.scale.y = (o.sprite.userData.base ??= o.sprite.scale.x) * pulse;
      }

      camera.position.x += (current.x * 1.6 - camera.position.x) * 0.05;
      camera.position.y += (-current.y * 1.1 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      render();
    }

    // ---- Resize ----
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ---- Pause when hidden ----
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else if (!prefersReduced) {
        render();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      orbs.forEach((o) => (o.sprite.material as THREE.Material).dispose());
      ringGroup.children.forEach((m) => {
        const mesh = m as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
