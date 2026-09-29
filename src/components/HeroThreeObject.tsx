"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = t * Math.PI * 2;
    const rawX = Math.sin(angle);
    const right = rawX > 0;
    const x = rawX * (right ? 2.52 : 1.42) + 0.28;
    const y = Math.sin(angle) * Math.cos(angle) * (right ? 1.03 : 0.78) - 0.05;
    const z = Math.cos(angle * 2) * 0.46 + (right ? 0.08 : -0.06);
    return target.set(x, y, z);
  }
}

function tintGeometry(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute("position");
  const colors: number[] = [];
  const orange = new THREE.Color("#ff6a04");
  const smoke = new THREE.Color("#090b0d");
  const blue = new THREE.Color("#108aed");

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const mix = THREE.MathUtils.clamp((x + 1.5) / 5.2, 0, 1);
    const color = mix < 0.5
      ? orange.clone().lerp(smoke, mix * 2)
      : smoke.clone().lerp(blue, (mix - 0.5) * 2);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
}

function makeOrbit(rx: number, ry: number, color: string, opacity: number) {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index <= 180; index += 1) {
    const angle = (index / 180) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * rx, Math.sin(angle) * ry, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, opacity, transparent: true });
  return new THREE.Line(geometry, material);
}

export function HeroThreeObject({ progress }: { progress?: MotionValue<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!progress) return undefined;
    progressRef.current = progress.get();
    return progress.on("change", (value) => {
      progressRef.current = value;
    });
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0.2, 0.12, 8.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = "hero-three-canvas";
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xf4f1ea, 0.4));

    const topLight = new THREE.DirectionalLight(0xffffff, 2.2);
    topLight.position.set(-2.5, 4, 5.2);
    scene.add(topLight);

    const orangeLight = new THREE.PointLight(0xff6a04, 3.6, 8.8);
    orangeLight.position.set(-2.8, -0.65, 2.3);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x108aed, 3.2, 8.8);
    blueLight.position.set(3.4, 0.45, 2.4);
    scene.add(blueLight);

    const curve = new InfinityCurve();
    const bodyGeometry = new THREE.TubeGeometry(curve, 460, 0.2, 32, true);
    const glowGeometry = new THREE.TubeGeometry(curve, 460, 0.245, 24, true);
    const rimGeometry = new THREE.TubeGeometry(curve, 460, 0.026, 8, true);
    tintGeometry(glowGeometry);

    const glassBody = new THREE.Mesh(
      bodyGeometry,
      new THREE.MeshPhysicalMaterial({
        color: "#050607",
        metalness: 0.32,
        roughness: 0.18,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        transparent: true,
        opacity: 0.46,
      }),
    );
    group.add(glassBody);

    const coloredEdge = new THREE.Mesh(
      glowGeometry,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.34,
      }),
    );
    coloredEdge.position.set(0, 0.02, 0.08);
    group.add(coloredEdge);

    const whiteRim = new THREE.Mesh(
      rimGeometry,
      new THREE.MeshBasicMaterial({
        color: "#d9f0ff",
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.52,
      }),
    );
    whiteRim.position.set(0, 0.11, 0.18);
    group.add(whiteRim);

    const innerShadow = new THREE.Mesh(
      bodyGeometry.clone(),
      new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.42 }),
    );
    innerShadow.position.set(0.08, -0.22, -0.44);
    group.add(innerShadow);

    const reflection = new THREE.Mesh(
      new THREE.CircleGeometry(2.9, 64),
      new THREE.MeshBasicMaterial({
        color: "#101d2a",
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    );
    reflection.scale.set(1.72, 0.18, 1);
    reflection.position.set(0.6, -1.06, -0.8);
    reflection.rotation.x = -1.12;
    group.add(reflection);

    const orbitA = makeOrbit(3.95, 1.14, "#f4f1ea", 0.08);
    orbitA.rotation.set(1.18, 0.02, -0.16);
    group.add(orbitA);

    const orbitB = makeOrbit(3.2, 0.88, "#108aed", 0.08);
    orbitB.rotation.set(1.22, 0.08, 0.42);
    group.add(orbitB);

    const orbitC = makeOrbit(3.15, 0.9, "#ff6a04", 0.08);
    orbitC.rotation.set(1.24, -0.04, -0.48);
    group.add(orbitC);

    group.rotation.set(-0.28, -0.04, -0.05);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const scroll = THREE.MathUtils.clamp(progressRef.current, 0, 1);
      const flow = Math.sin(Math.min(1, scroll * 1.1) * Math.PI);
      const scale = 0.86 + flow * 0.2;

      group.scale.set(scale, scale * (1 + flow * 0.04), scale);
      group.rotation.y = -0.04 + scroll * 0.62;
      group.rotation.x = -0.28 + flow * 0.13;
      group.rotation.z = -0.05 + scroll * 0.12;

      if (!reduceMotion) {
        group.rotation.y += Math.sin(elapsed * 0.22) * 0.035;
        orbitA.rotation.z = -0.16 + elapsed * 0.028;
        orbitB.rotation.z = 0.42 - elapsed * 0.036;
        orbitC.rotation.z = -0.48 + elapsed * 0.024;
        coloredEdge.material.opacity = 0.28 + Math.sin(elapsed * 0.8) * 0.06;
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material.dispose();
        }
      });
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
