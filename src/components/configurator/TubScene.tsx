import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { TubVisual } from '../../data/configurator'

export type CameraView = 'outside' | 'inside'

/**
 * Parametric 3D preview of the configured tub.
 *
 * Nothing here is loaded from a file: the tub is built from primitives on every
 * change and the lighting comes from a generated room environment. That keeps
 * the page free of 3D assets — and, while the client has no photography yet,
 * it is the only honest way to show what a configuration looks like.
 */
export function TubScene({ visual, view }: { visual: TubVisual; view: CameraView }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<{
    rebuild: (visual: TubVisual) => void
    setView: (view: CameraView) => void
    dispose: () => void
  } | null>(null)

  // The renderer is created once and lives for the life of the component; the
  // tub itself is rebuilt whenever the configuration changes.
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.touchAction = 'pan-y'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 2.2
    controls.maxDistance = 12
    // Never let the camera drop below the ground plane.
    controls.maxPolarAngle = Math.PI / 2 - 0.04

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.autoRotate = !reduceMotion
    controls.autoRotateSpeed = 0.5

    const key = new THREE.DirectionalLight(0xfff1e2, 2.1)
    key.position.set(4, 6, 3)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 20
    key.shadow.camera.left = -5
    key.shadow.camera.right = 5
    key.shadow.camera.top = 5
    key.shadow.camera.bottom = -5
    key.shadow.bias = -0.0015
    scene.add(key)

    const rim = new THREE.DirectionalLight(0xf1602e, 0.45)
    rim.position.set(-4, 2.4, -3)
    scene.add(rim)

    scene.add(new THREE.HemisphereLight(0xdfe6ef, 0x15161a, 0.5))

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(9, 64).rotateX(-Math.PI / 2),
      new THREE.ShadowMaterial({ opacity: 0.38 }),
    )
    ground.receiveShadow = true
    scene.add(ground)

    const tubRoot = new THREE.Group()
    scene.add(tubRoot)

    const disposables: Array<THREE.BufferGeometry | THREE.Material> = []
    const track = <T extends THREE.BufferGeometry | THREE.Material>(item: T) => {
      disposables.push(item)
      return item
    }

    const clearTub = () => {
      tubRoot.clear()
      for (const item of disposables.splice(0)) item.dispose()
    }

    // ---- materials -------------------------------------------------------

    const steel = () =>
      track(new THREE.MeshStandardMaterial({ color: 0xb6bcc4, metalness: 1, roughness: 0.26 }))

    const darkSteel = () =>
      track(new THREE.MeshStandardMaterial({ color: 0x2c3036, metalness: 0.85, roughness: 0.45 }))

    const claddingMaterial = (cladding: TubVisual['cladding']) => {
      if (cladding === 'larch')
        return track(new THREE.MeshStandardMaterial({ color: 0x9c6530, roughness: 0.8 }))
      if (cladding === 'thermo')
        return track(new THREE.MeshStandardMaterial({ color: 0x40281d, roughness: 0.74 }))
      return track(new THREE.MeshStandardMaterial({ color: 0x17191c, roughness: 0.58, metalness: 0.2 }))
    }

    const waterMaterial = (lit: boolean) =>
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x1c5663,
          roughness: 0.06,
          metalness: 0,
          transparent: true,
          opacity: 0.94,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          emissive: lit ? new THREE.Color(0x12505f) : new THREE.Color(0x000000),
          emissiveIntensity: lit ? 0.8 : 0,
        }),
      )

    const woodMaterial = () =>
      track(new THREE.MeshStandardMaterial({ color: 0xa8713a, roughness: 0.8 }))

    // ---- builders --------------------------------------------------------

    const addMesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      position: [number, number, number] = [0, 0, 0],
      parent: THREE.Object3D = tubRoot,
    ) => {
      const mesh = new THREE.Mesh(track(geometry), material)
      mesh.position.set(...position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    /** Height the bowl's bottom sits at, by stove layout. */
    const standHeight = (stove: TubVisual['stove']) =>
      stove === 'under' ? 0.58 : stove === 'inner' ? 0.42 : 0.3

    const buildBowl = (v: TubVisual, radius: number, wall: number, base: number) => {
      const segments = v.bowl === 'faceted' ? 8 : v.bowl === 'rect' ? 4 : 56
      const taper = v.bowl === 'rect' ? 1 : 0.9

      if (v.bowl === 'rect') {
        const side = radius * 1.75
        const shell = addMesh(
          new THREE.BoxGeometry(side, wall, side * 0.78),
          steel(),
          [0, base + wall / 2, 0],
        )
        shell.material = steel()
        // Inner cavity, drawn as a slightly smaller inverted box so the rim
        // reads as a wall thickness rather than a solid block.
        addMesh(
          new THREE.BoxGeometry(side - 0.1, wall, side * 0.78 - 0.1),
          track(new THREE.MeshStandardMaterial({ color: 0x9aa1a9, metalness: 1, roughness: 0.3, side: THREE.BackSide })),
          [0, base + wall / 2 + 0.06, 0],
        )
        return
      }

      // Outer wall, open at both ends so the inside is visible from above.
      addMesh(
        new THREE.CylinderGeometry(radius, radius * taper, wall, segments, 1, true),
        track(new THREE.MeshStandardMaterial({ color: 0xb6bcc4, metalness: 1, roughness: 0.26, side: THREE.DoubleSide })),
        [0, base + wall / 2, 0],
      )
      // Floor of the bowl.
      addMesh(
        new THREE.CylinderGeometry(radius * taper, radius * taper, 0.06, segments),
        steel(),
        [0, base + 0.03, 0],
      )
      // Rolled rim.
      addMesh(
        new THREE.TorusGeometry(radius, 0.035, 10, segments * 2).rotateX(Math.PI / 2),
        steel(),
        [0, base + wall, 0],
      )
    }

    const buildCladding = (v: TubVisual, radius: number, wall: number, base: number) => {
      if (v.cladding === 'none' || v.bowl === 'rect') return
      const segments = v.bowl === 'faceted' ? 8 : 56
      addMesh(
        new THREE.CylinderGeometry(radius * 1.03, radius * taperOf(v) * 1.05, wall * 0.94, segments, 1, true),
        track(
          Object.assign(claddingMaterial(v.cladding), { side: THREE.DoubleSide }) as THREE.Material,
        ),
        [0, base + wall * 0.47, 0],
      )
    }

    const taperOf = (v: TubVisual) => (v.bowl === 'rect' ? 1 : 0.9)

    const buildStove = (v: TubVisual, radius: number, base: number) => {
      if (v.stove === 'under') {
        addMesh(
          new THREE.CylinderGeometry(radius * 0.62, radius * 0.7, base, 24),
          darkSteel(),
          [0, base / 2, 0],
        )
        // Firebox door.
        addMesh(
          new THREE.BoxGeometry(0.42, 0.3, 0.06),
          steel(),
          [0, base * 0.55, radius * 0.7 - 0.01],
        )
        return
      }

      if (v.stove === 'inner') {
        addMesh(
          new THREE.CylinderGeometry(radius * 0.52, radius * 0.58, base, 20),
          darkSteel(),
          [0, base / 2, 0],
        )
        addMesh(new THREE.BoxGeometry(0.4, 0.28, 0.06), steel(), [0, base * 0.55, radius * 0.58 - 0.01])
        return
      }

      // Frame under the bowl for the layouts whose stove is elsewhere.
      addMesh(
        new THREE.CylinderGeometry(radius * 0.72, radius * 0.78, base, 20),
        darkSteel(),
        [0, base / 2, 0],
      )

      if (v.stove === 'external') {
        const away = radius + 1.5
        addMesh(new THREE.BoxGeometry(0.62, 0.72, 0.5), darkSteel(), [away, 0.36, 0])
        addMesh(new THREE.BoxGeometry(0.34, 0.26, 0.05), steel(), [away, 0.42, 0.26])
        // Pipes back to the bowl.
        for (const z of [-0.14, 0.14]) {
          addMesh(
            new THREE.CylinderGeometry(0.05, 0.05, 1.5, 12).rotateZ(Math.PI / 2),
            steel(),
            [radius + 0.75, 0.46, z],
          )
        }
        return
      }

      if (v.stove === 'side') {
        addMesh(
          new THREE.BoxGeometry(0.5, 0.8, 0.46),
          darkSteel(),
          [radius + 0.24, base + 0.4, 0],
        )
        addMesh(new THREE.BoxGeometry(0.3, 0.24, 0.05), steel(), [radius + 0.24, base + 0.5, 0.24])
      }
    }

    const buildChimney = (v: TubVisual, radius: number, base: number, wall: number) => {
      if (v.chimney === 'none') return
      const sandwich = v.chimney === 'sandwich'
      const outer = sandwich ? 0.1 : 0.07
      const height = 3

      const spot: [number, number] =
        v.stove === 'external'
          ? [radius + 1.5, 0]
          : v.stove === 'side'
            ? [radius + 0.24, 0]
            : [0, 0]
      const bottom = v.stove === 'external' ? 0.72 : v.stove === 'side' ? base + 0.8 : base + wall

      addMesh(
        new THREE.CylinderGeometry(outer, outer, height, 18),
        sandwich ? steel() : darkSteel(),
        [spot[0], bottom + height / 2, spot[1]],
      )
      // Spark arrester.
      addMesh(
        new THREE.CylinderGeometry(outer * 1.6, outer * 1.3, 0.16, 18),
        steel(),
        [spot[0], bottom + height + 0.08, spot[1]],
      )
      if (sandwich) {
        // Visible joint between the two sections of the sandwich pipe.
        addMesh(
          new THREE.CylinderGeometry(outer * 1.15, outer * 1.15, 0.1, 18),
          darkSteel(),
          [spot[0], bottom + height * 0.45, spot[1]],
        )
      }
    }

    const buildLadder = (v: TubVisual, radius: number, base: number, wall: number) => {
      if (v.ladder === 'none') return
      const top = base + wall * 0.95
      const treadMaterial = v.ladder === 'wood' ? woodMaterial() : darkSteel()
      const frame = darkSteel()
      const steps = 3
      const width = 0.66
      const run = 0.22

      // Built along +z inside its own group, then swung round to the side of
      // the bowl opposite the stove so the two never fight for the frame.
      const ladder = new THREE.Group()
      const front = radius + 0.18 + run * steps

      for (let i = 0; i < steps; i += 1) {
        const y = (top / (steps + 1)) * (i + 1)
        const z = front - run * i
        addMesh(new THREE.BoxGeometry(width, 0.05, run * 0.95), treadMaterial, [0, y, z], ladder)
        addMesh(new THREE.BoxGeometry(width, y, 0.035), frame, [0, y / 2, z + run * 0.45], ladder)
      }

      const platformZ = front - run * steps - run * 0.6
      addMesh(new THREE.BoxGeometry(width, 0.06, run * 2.2), treadMaterial, [0, top, platformZ], ladder)

      for (const x of [-(width / 2 - 0.04), width / 2 - 0.04]) {
        for (const z of [platformZ + run * 0.9, platformZ - run * 0.9]) {
          addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.8, 10), frame, [x, top + 0.4, z], ladder)
        }
        addMesh(
          new THREE.CylinderGeometry(0.022, 0.022, run * 1.8, 10).rotateX(Math.PI / 2),
          frame,
          [x, top + 0.8, platformZ],
          ladder,
        )
      }

      // The side and external stoves both stand at +x, so the ladder goes to
      // the opposite side rather than climbing over the firebox.
      const stoveSide = v.stove === 'side' || v.stove === 'external'
      ladder.rotation.y = stoveSide ? -Math.PI / 2 : Math.PI / 2
      tubRoot.add(ladder)
    }

    const buildWater = (v: TubVisual, radius: number, base: number, wall: number) => {
      const level = base + wall * 0.74
      const segments = v.bowl === 'faceted' ? 8 : v.bowl === 'rect' ? 4 : 56
      if (v.bowl === 'rect') {
        const side = radius * 1.75 - 0.12
        addMesh(new THREE.BoxGeometry(side, 0.02, side * 0.78 - 0.12), waterMaterial(v.light), [
          0, level, 0,
        ])
        return
      }
      const r = radius * (0.9 + (1 - 0.9) * 0.74) - 0.02
      addMesh(new THREE.CylinderGeometry(r, r, 0.02, segments), waterMaterial(v.light), [0, level, 0])
    }

    const buildExtras = (v: TubVisual, radius: number, base: number, wall: number) => {
      const level = base + wall * 0.74

      if (v.table) {
        addMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), steel(), [0, level + 0.25, 0])
        addMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 28), woodMaterial(), [
          0, level + 0.5, 0,
        ])
      }

      if (v.hydro) {
        const nozzle = track(
          new THREE.MeshStandardMaterial({ color: 0xe6e9ec, metalness: 1, roughness: 0.18 }),
        )
        const count = 8
        for (let i = 0; i < count; i += 1) {
          const angle = (i / count) * Math.PI * 2
          const r = radius * 0.78
          addMesh(new THREE.SphereGeometry(0.055, 14, 10), nozzle, [
            Math.cos(angle) * r,
            base + wall * 0.42,
            Math.sin(angle) * r,
          ])
        }
      }

      if (v.light) {
        const glow = new THREE.PointLight(0x7fd4e6, 9, radius * 3.2, 2)
        glow.position.set(0, level + 0.12, 0)
        tubRoot.add(glow)
        addMesh(
          new THREE.TorusGeometry(radius * 0.86, 0.018, 8, 48).rotateX(Math.PI / 2),
          track(
            new THREE.MeshStandardMaterial({
              color: 0x8fdcef,
              emissive: 0x6fd0e8,
              emissiveIntensity: 2.4,
              roughness: 0.4,
            }),
          ),
          [0, base + wall * 0.52, 0],
        )
      }

      if (v.lid) {
        // Leaned against the side rather than laid on top, so the inside of the
        // bowl stays visible while the lid is still clearly part of the kit.
        const lid = addMesh(
          new THREE.CylinderGeometry(radius * 0.74, radius * 0.74, 0.06, 36),
          woodMaterial(),
          [-(radius + 0.34), radius * 0.62, 0],
        )
        lid.rotation.z = Math.PI / 2 - 0.16
      }
    }

    const rebuild = (v: TubVisual) => {
      clearTub()
      const radius = v.diameter / 2
      const wall = v.stove === 'side' ? 0.62 : 0.74
      const base = standHeight(v.stove)

      buildStove(v, radius, base)
      buildBowl(v, radius, wall, base)
      buildCladding(v, radius, wall, base)
      buildWater(v, radius, base, wall)
      buildChimney(v, radius, base, wall)
      buildLadder(v, radius, base, wall)
      buildExtras(v, radius, base, wall)
    }

    const setView = (next: CameraView) => {
      const radius = Math.max(tubRoot.userData.radius ?? 1, 0.9)
      if (next === 'inside') {
        camera.position.set(radius * 1.1, 2.6, radius * 1.5)
        controls.target.set(0, 0.8, 0)
      } else {
        camera.position.set(radius * 2.9, 2.3, radius * 3.7)
        controls.target.set(0, 1.25, 0)
      }
      controls.update()
    }

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) return
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    let frame = 0
    const tick = () => {
      frame = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    apiRef.current = {
      rebuild: (v) => {
        tubRoot.userData.radius = v.diameter / 2
        rebuild(v)
      },
      setView,
      dispose: () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        clearTub()
        controls.dispose()
        environment.dispose()
        pmrem.dispose()
        ground.geometry.dispose()
        ;(ground.material as THREE.Material).dispose()
        renderer.dispose()
        renderer.domElement.remove()
      },
    }

    return () => {
      apiRef.current?.dispose()
      apiRef.current = null
    }
  }, [])

  useEffect(() => {
    apiRef.current?.rebuild(visual)
  }, [visual])

  useEffect(() => {
    apiRef.current?.setView(view)
  }, [view, visual.diameter])

  return <div ref={mountRef} className="size-full" aria-hidden="true" />
}

export default TubScene
