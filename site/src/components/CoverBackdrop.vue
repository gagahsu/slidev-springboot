<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SLIDE_H, SLIDE_W } from '../lib/deck'

// Slow-floating 3D shapes behind cover slides (Three.js, loaded on demand). Purely decorative.
const canvas = ref<HTMLCanvasElement>()
let stop: (() => void) | undefined

onMounted(async () => {
  try {
    const THREE = await import('three')
    if (!canvas.value) return
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(2, (window.devicePixelRatio || 1) * 1.5))
    renderer.setSize(SLIDE_W, SLIDE_H, false)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, SLIDE_W / SLIDE_H, 0.1, 100)
    camera.position.z = 14
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8e8d0, 2.2))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6)
    sun.position.set(4, 6, 8)
    scene.add(sun)

    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.8, 0.32, 16, 40),
      new THREE.SphereGeometry(0.85, 32, 24),
      new THREE.BoxGeometry(1.25, 1.25, 1.25),
      new THREE.OctahedronGeometry(1, 0),
    ]
    const colors = [0x58cc02, 0x1cb0f6, 0xffc800, 0xce82ff, 0xff9600, 0xff86d0]
    // shapes stay near the edges so the title in the middle is never covered
    const spots = [[-8.2, 3.4, 0.9], [-6.4, -3.6, 1.15], [-9.2, -0.6, 0.6], [8.3, 3.2, 1.1], [6.6, -3.4, 0.8], [9.3, -0.4, 0.65], [-3.6, 4.4, 0.5], [3.8, -4.5, 0.55], [4.2, 4.5, 0.45]]
    const shapes = spots.map(([x, y, s], i) => {
      const mesh = new THREE.Mesh(geometries[i % geometries.length], new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.45, flatShading: i % geometries.length !== 2 }))
      mesh.position.set(x, y, -i * 0.35)
      mesh.scale.setScalar(s)
      scene.add(mesh)
      return { mesh, y, phase: i * 1.3, speed: 0.25 + (i % 4) * 0.07 }
    })

    let raf = 0
    const t0 = performance.now()
    const frame = () => {
      const t = (performance.now() - t0) / 1000
      for (const s of shapes) {
        s.mesh.position.y = s.y + Math.sin(t * s.speed * 2 + s.phase) * 0.35
        s.mesh.rotation.x = t * s.speed + s.phase
        s.mesh.rotation.y = t * s.speed * 0.8
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    frame()
    stop = () => {
      cancelAnimationFrame(raf)
      geometries.forEach(g => g.dispose())
      shapes.forEach(s => (s.mesh.material as any).dispose())
      renderer.dispose()
    }
  }
  catch {
    // no WebGL: the cover simply has no backdrop
  }
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <canvas ref="canvas" class="cover-backdrop" aria-hidden="true" />
</template>

<style>
.cover-backdrop { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; pointer-events: none; opacity: .9; }
</style>
