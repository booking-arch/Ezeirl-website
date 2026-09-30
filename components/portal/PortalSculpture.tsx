"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Material, NormalBufferAttributes } from "three";
import type { CoachingService } from "@/config/coaching";
import styles from "./portal.module.css";

/** Decorative, lazy-loaded WebGL. Navigation never depends on a canvas or a hover state. */
export default function PortalSculpture({ kind }: { kind: CoachingService }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("three").then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
      catch { return; }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.1, 7.6);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      element.appendChild(renderer.domElement);
      const group = new THREE.Group();
      scene.add(group);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x183c29, 3));
      const key = new THREE.DirectionalLight(0xffffff, 6); key.position.set(-3, 5, 4); scene.add(key);
      const rim = new THREE.DirectionalLight(0x45ffb0, 9); rim.position.set(4, 0, -2); scene.add(rim);
      const metal = new THREE.MeshStandardMaterial({ color: 0x293934, metalness: 0.85, roughness: 0.24 });
      const bright = new THREE.MeshStandardMaterial({ color: 0x82aaa0, metalness: 0.9, roughness: 0.22 });
      const green = new THREE.MeshStandardMaterial({ color: 0x22e68a, metalness: 0.35, roughness: 0.25, emissive: 0x084525, emissiveIntensity: 0.4 });
      const materials = [metal, bright, green];
      const add = (geometry: BufferGeometry<NormalBufferAttributes>, material: Material, x = 0, y = 0, z = 0) => {
        const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); group.add(mesh); return mesh;
      };
      if (kind === "personal-training") {
        const bar = add(new THREE.CylinderGeometry(0.14, 0.14, 3.35, 32), bright); bar.rotation.z = Math.PI / 2;
        for (const side of [-1, 1]) {
          for (let i = 0; i < 3; i++) {
            const weight = add(new THREE.CylinderGeometry(0.73 - i * 0.08, 0.73 - i * 0.08, 0.25, 48), metal, side * (0.94 + i * 0.27));
            weight.rotation.z = Math.PI / 2;
            const ring = add(new THREE.TorusGeometry(0.66 - i * 0.08, 0.021, 8, 48), green, side * (1.07 + i * 0.27)); ring.rotation.y = Math.PI / 2;
          }
          const cap = add(new THREE.CylinderGeometry(0.22, 0.22, 0.13, 32), bright, side * 1.76); cap.rotation.z = Math.PI / 2;
        }
        for (let i = 0; i < 12; i++) {
          const grip = add(new THREE.TorusGeometry(0.143, 0.014, 6, 24), metal, -0.55 + i * 0.1); grip.rotation.y = Math.PI / 2;
        }
        group.rotation.set(0.35, -0.35, -0.4);
      } else {
        const fruit = new THREE.MeshStandardMaterial({ color: 0xa7d845, metalness: 0.2, roughness: 0.25 }); materials.push(fruit);
        const appleGeometry = new THREE.SphereGeometry(0.94, 64, 48);
        const positions = appleGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
          const radius = Math.hypot(x, z);
          const lobes = 1 + 0.09 * y + 0.022 * Math.cos(Math.atan2(z, x) * 5);
          const dimple = (y > 0 ? -0.2 : 0.08) * Math.exp(-radius * radius / 0.075);
          positions.setXYZ(i, x * lobes, y + dimple, z * lobes);
        }
        appleGeometry.computeVertexNormals();
        add(appleGeometry, fruit, 0, -0.08);
        const stem = add(new THREE.CylinderGeometry(0.055, 0.075, 0.5, 16), metal, 0, 0.87); stem.rotation.z = -0.2;
        const leaf = add(new THREE.SphereGeometry(0.5, 32, 24), green, 0.39, 0.99, 0.05); leaf.scale.set(1, 0.12, 0.42); leaf.rotation.z = 0.45;
        const orbit = add(new THREE.TorusGeometry(1.55, 0.018, 8, 100), bright); orbit.rotation.set(1.05, 0.32, -0.35);
        const seed = add(new THREE.SphereGeometry(0.095, 16, 16), green, 1.5, 0.15, 0.25); seed.scale.setScalar(1.2);
        group.rotation.set(0.05, -0.3, -0.13);
      }
      group.scale.setScalar(1.12);
      const base = group.rotation.clone();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = { x: 0, y: 0 };
      let visible = true;
      let frame = 0;
      let last = 0;
      const render = (now: number) => {
        frame = 0;
        if (!visible || document.hidden || disposed) return;
        if (now - last > 32 || reduced.matches) {
          group.rotation.y += (base.y + pointer.x * 0.24 - group.rotation.y) * 0.08;
          group.rotation.x += (base.x + pointer.y * 0.16 - group.rotation.x) * 0.08;
          group.position.y = reduced.matches ? 0 : Math.sin(now * 0.0007) * 0.065;
          renderer.render(scene, camera); last = now;
        }
        if (!reduced.matches) frame = requestAnimationFrame(render);
      };
      const start = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); };
      const resize = () => { const { width, height } = element.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); start(); };
      const parent = element.closest("a");
      const move = (e: PointerEvent) => { if (reduced.matches || e.pointerType !== "mouse") return; const rect = element.getBoundingClientRect(); pointer.x = (e.clientX - rect.left) / rect.width - 0.5; pointer.y = (e.clientY - rect.top) / rect.height - 0.5; start(); };
      const leave = () => { pointer.x = 0; pointer.y = 0; };
      const motionChange = () => { if (reduced.matches) { group.rotation.copy(base); pointer.x = 0; pointer.y = 0; } start(); };
      const observer = new ResizeObserver(resize); observer.observe(element);
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) { cancelAnimationFrame(frame); frame = 0; } else start(); }); visibility.observe(element);
      parent?.addEventListener("pointermove", move); parent?.addEventListener("pointerleave", leave);
      document.addEventListener("visibilitychange", start); reduced.addEventListener("change", motionChange);
      element.dataset.ready = "true"; resize();
      cleanup = () => {
        cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect();
        parent?.removeEventListener("pointermove", move); parent?.removeEventListener("pointerleave", leave);
        document.removeEventListener("visibilitychange", start); reduced.removeEventListener("change", motionChange);
        group.traverse((object) => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
        materials.forEach((material) => material.dispose()); renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
      };
    }).catch(() => { /* The CSS sculpture stays visible if WebGL or the optional chunk is unavailable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, [kind]);
  return <div ref={host} className={styles.sculpture}><div className={styles.sculptureFallback}><span /><span /><span /></div></div>;
}
