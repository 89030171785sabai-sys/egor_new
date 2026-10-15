import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { TubVisual } from '../../data/configurator'

export type CameraView = 'outside' | 'inside'

/**
 * Parametric 3D preview of the configured tub, shot like the studio photographs:
 * a white sweep, soft light, a slow turntable.
 *
 * Nothing is loaded from a file. The tub is built from exact geometry — an
 * eight-sided bowl with its creases, a larch rim, the stove of the chosen
 * layout — so every facet is straight and the two halves are identical, which a
 * model generated from a single photograph cannot promise. Proportions are
 * taken from the studio shots (bowl depth, base height, chimney height, all as
 * shares of the diameter) and scale with the chosen size.
 */
export function TubScene({ visual, view }: { visual: TubVisual; view: CameraView }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<{
    rebuild: (visual: TubVisual) => void
    setView: (view: CameraView) => void
    dispose: () => void
  } | null>(null)

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
    scene.environmentIntensity = 0.9

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 1.8
    controls.maxDistance = 14
    controls.maxPolarAngle = Math.PI / 2 - 0.04

    // One turn in about twenty seconds, like a showroom turntable. The tub
    // stops turning while it is being handled and resumes a moment after.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.autoRotate = !reduceMotion
    controls.autoRotateSpeed = 1.5
    let resumeTimer = 0
    controls.addEventListener('start', () => {
      controls.autoRotate = false
      window.clearTimeout(resumeTimer)
    })
    controls.addEventListener('end', () => {
      if (reduceMotion) return
      resumeTimer = window.setTimeout(() => {
        controls.autoRotate = true
      }, 2500)
    })

    const key = new THREE.DirectionalLight(0xffffff, 2.3)
    key.position.set(3.5, 7, 4.5)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 24
    key.shadow.camera.left = -6
    key.shadow.camera.right = 6
    key.shadow.camera.top = 6
    key.shadow.camera.bottom = -6
    key.shadow.bias = -0.0008
    key.shadow.radius = 4
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xe9eef7, 0.9)
    fill.position.set(-5, 3.5, -2)
    scene.add(fill)

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9dde2, 0.55))

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(12, 64).rotateX(-Math.PI / 2),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    )
    ground.receiveShadow = true
    scene.add(ground)

    // ---- textures, made once ---------------------------------------------

    const canvasTexture = (size: [number, number], paint: (ctx: CanvasRenderingContext2D) => void) => {
      const canvas = document.createElement('canvas')
      canvas.width = size[0]
      canvas.height = size[1]
      const ctx = canvas.getContext('2d')
      if (ctx) paint(ctx)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.anisotropy = 4
      return texture
    }

    // Larch: warm boards with a fine grain running along the length.
    const larchTexture = canvasTexture([512, 256], (ctx) => {
      ctx.fillStyle = '#b6702f'
      ctx.fillRect(0, 0, 512, 256)
      for (let y = 0; y < 256; y += 1) {
        const shade = Math.sin(y * 0.31) * 0.5 + Math.sin(y * 0.093 + 1.7) * 0.5
        ctx.fillStyle = `rgba(${shade > 0 ? '255,214,160' : '86,44,12'},${Math.abs(shade) * 0.1})`
        ctx.fillRect(0, y, 512, 1)
      }
      for (let i = 0; i < 70; i += 1) {
        ctx.fillStyle = `rgba(72,36,10,${0.05 + Math.random() * 0.12})`
        ctx.fillRect(Math.random() * 512, Math.random() * 256, 40 + Math.random() * 180, 1)
      }
    })

    // Perforated heat shield on the chimney.
    const perforationTexture = canvasTexture([128, 128], (ctx) => {
      ctx.fillStyle = '#a9afb6'
      ctx.fillRect(0, 0, 128, 128)
      ctx.fillStyle = '#26282b'
      for (let y = 8; y < 128; y += 16)
        for (let x = (y / 16) % 2 ? 8 : 0; x < 136; x += 16) {
          ctx.beginPath()
          ctx.arc(x, y, 4.2, 0, Math.PI * 2)
          ctx.fill()
        }
    })

    const blobTexture = canvasTexture([256, 256], (ctx) => {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      gradient.addColorStop(0, 'rgba(0,0,0,0.42)')
      gradient.addColorStop(0.55, 'rgba(0,0,0,0.16)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 256)
    })
    blobTexture.wrapS = THREE.ClampToEdgeWrapping
    blobTexture.wrapT = THREE.ClampToEdgeWrapping

    // ---- materials, made once --------------------------------------------

    const shared = {
      brushed: new THREE.MeshStandardMaterial({ color: 0xa9afb7, metalness: 1, roughness: 0.38 }),
      liner: new THREE.MeshStandardMaterial({
        color: 0xc3c9d0,
        metalness: 1,
        roughness: 0.3,
        side: THREE.DoubleSide,
      }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xe4e8ec, metalness: 1, roughness: 0.18 }),
      black: new THREE.MeshStandardMaterial({ color: 0x17181b, metalness: 0.5, roughness: 0.5 }),
      blackFlat: new THREE.MeshStandardMaterial({
        color: 0x17181b,
        metalness: 0.5,
        roughness: 0.5,
        flatShading: true,
      }),
      wood: new THREE.MeshStandardMaterial({ map: larchTexture, roughness: 0.6 }),
      cover: new THREE.MeshStandardMaterial({ color: 0x25272b, roughness: 0.85 }),
      water: new THREE.MeshPhysicalMaterial({
        color: 0x86b9c4,
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
      fire: new THREE.MeshStandardMaterial({
        color: 0x2a0d00,
        emissive: 0xff7a1a,
        emissiveIntensity: 2.4,
      }),
      log: new THREE.MeshStandardMaterial({ color: 0x3b2616, roughness: 0.9 }),
      hose: new THREE.MeshStandardMaterial({ color: 0x1d2733, roughness: 0.6 }),
      shield: new THREE.MeshStandardMaterial({
        map: perforationTexture,
        metalness: 0.8,
        roughness: 0.4,
      }),
      blob: new THREE.MeshBasicMaterial({
        map: blobTexture,
        transparent: true,
        depthWrite: false,
      }),
    }

    // ---- the tub, rebuilt on every change --------------------------------

    const tubRoot = new THREE.Group()
    scene.add(tubRoot)

    const disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = []
    const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(item: T) => {
      disposables.push(item)
      return item
    }

    // Flickering fire: the glowing faces and the light they cast.
    let fireLights: Array<{ light: THREE.PointLight; base: number }> = []

    const clearTub = () => {
      tubRoot.clear()
      fireLights = []
      for (const item of disposables.splice(0)) item.dispose()
    }

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

    /** A regular eight-sided outline, vertices on the axes like the lathe's. */
    const octagon = (radius: number) =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return new THREE.Vector2(Math.sin(angle) * radius, Math.cos(angle) * radius)
      })

    /** Door opening with an arched top, as on the stationary stoves. */
    const archShape = (width: number, height: number) => {
      const r = width / 2
      const shape = new THREE.Shape()
      shape.moveTo(-r, 0)
      shape.lineTo(-r, height - r)
      shape.absarc(0, height - r, r, Math.PI, 0, true)
      shape.lineTo(r, 0)
      shape.closePath()
      return shape
    }

    /** A firebox door: dark plate, glowing opening, logs, a light on the ground. */
    const addFireDoor = (
      width: number,
      height: number,
      position: [number, number, number],
      rotationY = 0,
    ) => {
      const door = new THREE.Group()
      door.position.set(...position)
      door.rotation.y = rotationY
      tubRoot.add(door)

      addMesh(
        new THREE.ExtrudeGeometry(archShape(width, height), { depth: 0.03, bevelEnabled: false }),
        shared.black,
        [0, 0, 0],
        door,
      )
      addMesh(
        new THREE.ExtrudeGeometry(archShape(width * 0.7, height * 0.7), {
          depth: 0.012,
          bevelEnabled: false,
        }),
        shared.fire,
        [0, height * 0.1, 0.03],
        door,
      )
      for (const [x, y] of [
        [-0.16, 0.1],
        [0.12, 0.12],
        [0, 0.17],
      ] as const) {
        addMesh(
          new THREE.CylinderGeometry(0.022, 0.026, width * 0.5, 8).rotateZ(Math.PI / 2),
          shared.log,
          [x * width, height * y, 0.045],
          door,
        )
      }
      const light = new THREE.PointLight(0xff8a3d, 0.7, 1.6, 2)
      light.position.set(0, height * 0.35, 0.35)
      door.add(light)
      fireLights.push({ light, base: 0.7 })
    }

    const rebuild = (v: TubVisual) => {
      clearTub()

      const D = v.diameter
      const R = D / 2
      const faceted = v.bowl !== 'rolled'

      // Proportions as shares of the diameter, read off the studio shots.
      const hb = (v.stove === 'side' ? 0.3 : faceted ? 0.36 : 0.4) * D
      const rb = (faceted ? 0.53 * 0.9 : 0.556) * R
      const baseH =
        { under: 0.3, inner: faceted ? 0.34 : 0.38, frame: 0.3, external: 0.22, side: 0.12 }[
          v.stove
        ] * D
      const rimY = baseH + hb

      // The wooden rim overhangs the bowl: measured on the studio shot, the
      // bowl's top edge is 0.88 of the rim's half-width, its bottom 0.56.
      const top = (faceted ? 0.9 : 0.883) * R
      /** Measured silhouette of the rolled bowl: height share -> share of the rim radius. */
      const rolledProfile: Array<[number, number]> = [
        [0, 0.556],
        [0.03, 0.573],
        [0.19, 0.669],
        [0.35, 0.745],
        [0.53, 0.803],
        [1, 0.883],
      ]
      /** Bowl radius at a height t (0 bottom, 1 rim). Faceted bowls break at 55%. */
      const radiusAt = (t: number) => {
        if (faceted) {
          return t < 0.55
            ? rb + (0.8 * top - rb) * (t / 0.55)
            : 0.8 * top + (top - 0.8 * top) * ((t - 0.55) / 0.45)
        }
        for (let i = 1; i < rolledProfile.length; i += 1) {
          const [t1, r1] = rolledProfile[i]!
          const [t0, r0] = rolledProfile[i - 1]!
          if (t <= t1) return (r0 + ((r1 - r0) * (t - t0)) / (t1 - t0)) * R
        }
        return 0.883 * R
      }
      const steps = faceted ? [0, 0.55, 1] : rolledProfile.map(([t]) => t)
      const profile = (offset: number, lift = 0) =>
        steps.map((t) => new THREE.Vector2(radiusAt(t) + offset, baseH + lift + t * (hb - lift)))

      // ---- the bowl ------------------------------------------------------

      const outerSteel = track(
        new THREE.MeshStandardMaterial({
          color: v.cladding === 'painted' ? 0x17181b : 0xa4aab2,
          metalness: v.cladding === 'painted' ? 0.5 : 1,
          roughness: v.cladding === 'painted' ? 0.5 : 0.4,
          flatShading: true,
          side: THREE.DoubleSide,
        }),
      )
      addMesh(new THREE.LatheGeometry(profile(0), 8), outerSteel)

      if (v.cladding === 'larch' || v.cladding === 'thermo') {
        const board = track(larchTexture.clone())
        board.needsUpdate = true
        board.rotation = Math.PI / 2
        board.center.set(0.5, 0.5)
        board.repeat.set(1, 4)
        const cladMaterial = track(
          new THREE.MeshStandardMaterial({
            map: board,
            color: v.cladding === 'thermo' ? 0x6b4a36 : 0xffffff,
            roughness: 0.65,
            flatShading: true,
            side: THREE.DoubleSide,
          }),
        )
        addMesh(new THREE.LatheGeometry(profile(0.022, 0.02), 8), cladMaterial)
      }

      // Inside: stainless liner, its floor and the water.
      addMesh(new THREE.LatheGeometry(profile(-0.045, 0.03), 8), shared.liner)
      addMesh(
        new THREE.CircleGeometry(rb - 0.05, 8).rotateX(-Math.PI / 2),
        shared.liner,
        [0, baseH + 0.04, 0],
      )

      const waterT = 0.84
      const waterY = baseH + waterT * hb
      const water = addMesh(
        new THREE.CircleGeometry(radiusAt(waterT) - 0.05, 8).rotateX(-Math.PI / 2),
        shared.water,
        [0, waterY, 0],
      )
      water.castShadow = false
      if (v.light) {
        water.material = track(
          new THREE.MeshPhysicalMaterial({
            color: 0x86d6e6,
            roughness: 0.04,
            transparent: true,
            opacity: 0.88,
            clearcoat: 1,
            emissive: 0x4fc3dc,
            emissiveIntensity: 0.55,
          }),
        )
      }

      // The larch rim, an octagonal ring with softened edges.
      const rimRing = new THREE.Shape(octagon(R))
      rimRing.holes.push(new THREE.Path(octagon(top - 0.1).reverse()))
      addMesh(
        new THREE.ExtrudeGeometry(rimRing, {
          depth: 0.06,
          bevelEnabled: true,
          bevelSize: 0.009,
          bevelThickness: 0.009,
          bevelSegments: 2,
        }).rotateX(-Math.PI / 2),
        shared.wood,
        [0, rimY - 0.04, 0],
      )

      // ---- stove and base ------------------------------------------------

      // Where the chimney stands and how far it rises.
      let chimney: { x: number; z: number; from: number; top: number } | null = null
      const centred = v.stove === 'inner' || v.stove === 'under' || v.stove === 'frame'
      if (centred) chimney = { x: 0, z: 0, from: baseH + 0.1, top: rimY + 0.5 * D }

      if (v.stove === 'inner') {
        // A hexagonal firebox under the bowl, arched door on the front.
        const bodyR = rb * 1.02
        addMesh(
          new THREE.CylinderGeometry(bodyR, bodyR * 0.96, baseH, 6).rotateY(Math.PI / 6),
          shared.blackFlat,
          [0, baseH / 2, 0],
        )
        const apothem = bodyR * Math.cos(Math.PI / 6)
        const doorW = apothem * 0.78
        const doorH = baseH * 0.62
        addFireDoor(doorW, doorH, [0, baseH * 0.2, apothem * 0.98 + 0.002])
        addMesh(
          new THREE.BoxGeometry(doorW * 0.72, baseH * 0.07, 0.035),
          shared.brushed,
          [0, baseH * 0.12, apothem * 0.98 + 0.012],
        )
      }

      if (v.stove === 'under') {
        // An open hearth hidden by a windshield skirt that has no floor.
        const skirtR = rb * 1.18
        addMesh(
          new THREE.CylinderGeometry(skirtR, skirtR * 0.97, baseH, 8).rotateY(Math.PI / 8),
          shared.blackFlat,
          [0, baseH / 2, 0],
        )
      }

      if (v.stove === 'frame') {
        // A compact water-circuit stove inside a welded octagonal frame.
        const stoveW = 0.24 * D
        addMesh(
          new THREE.BoxGeometry(stoveW, 0.2 * D, stoveW),
          shared.blackFlat,
          [0, 0.1 * D + 0.03, 0],
        )
        addFireDoor(0.1 * D, 0.11 * D, [0, 0.05 * D, stoveW / 2 + 0.002])
        addMesh(
          new THREE.CylinderGeometry(rb * 1.1, rb * 0.9, 0.07 * D, 8).rotateY(Math.PI / 8),
          shared.blackFlat,
          [0, baseH - 0.035 * D, 0],
        )
        const frameR = 0.36 * D
        const tube = 0.02
        for (const y of [tube, baseH - 0.075 * D]) {
          const ring = octagon(frameR)
          for (let i = 0; i < 8; i += 1) {
            const a = ring[i]!
            const b = ring[(i + 1) % 8]!
            const length = a.distanceTo(b)
            const segment = addMesh(
              new THREE.BoxGeometry(length, tube * 2, tube * 2),
              shared.black,
              [(a.x + b.x) / 2, y, (a.y + b.y) / 2],
            )
            segment.rotation.y = Math.atan2(-(b.y - a.y), b.x - a.x)
          }
        }
        for (const corner of octagon(frameR)) {
          addMesh(
            new THREE.BoxGeometry(tube * 2, baseH - 0.075 * D, tube * 2),
            shared.black,
            [corner.x, (baseH - 0.075 * D) / 2 + tube, corner.y],
          )
        }
      }

      if (v.stove === 'external' || v.stove === 'side') {
        // Short octagonal pedestal under the bowl.
        addMesh(
          new THREE.CylinderGeometry(rb * 1.02, rb * 0.98, baseH, 8).rotateY(Math.PI / 8),
          shared.blackFlat,
          [0, baseH / 2, 0],
        )
      }

      if (v.stove === 'external') {
        // A separate stove, joined to the bowl by two flexible hoses.
        const x = R + 1.35
        addMesh(new THREE.BoxGeometry(0.62, 0.72, 0.52), shared.blackFlat, [x, 0.4, 0])
        addMesh(new THREE.BoxGeometry(0.4, 0.3, 0.03), shared.brushed, [x, 0.4, 0.27])
        for (const dx of [-0.1, 0, 0.1]) {
          addMesh(
            new THREE.CylinderGeometry(0.022, 0.022, 0.034, 12).rotateX(Math.PI / 2),
            shared.black,
            [x + dx, 0.4, 0.29],
          )
        }
        for (const [z, y] of [
          [-0.14, 0.62],
          [0.14, 0.34],
        ] as const) {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(rb * 0.95, baseH * 0.55 + (y - 0.4) * 0.3, z),
            new THREE.Vector3((rb + x) / 2, 0.12, z * 1.4),
            new THREE.Vector3(x - 0.31, y, z),
          ])
          addMesh(new THREE.TubeGeometry(curve, 28, 0.035, 10), shared.hose)
        }
        chimney = { x, z: 0, from: 0.76, top: Math.max(rimY + 0.3 * D, 0.76 + 2) }
      }

      if (v.stove === 'side') {
        // A wide firebox welded to the side of a low bowl.
        const x0 = radiusAt(0.4) * 0.92
        const profileShape = new THREE.Shape([
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0.78, 0),
          new THREE.Vector2(0.78, 0.6),
          new THREE.Vector2(0.52, 0.86),
          new THREE.Vector2(0, 0.86),
        ])
        const box = addMesh(
          new THREE.ExtrudeGeometry(profileShape, { depth: 0.66, bevelEnabled: false }),
          shared.blackFlat,
          [x0, 0.06, -0.33],
        )
        box.receiveShadow = true
        addMesh(new THREE.BoxGeometry(0.42, 0.3, 0.03), shared.brushed, [x0 + 0.46, 0.34, 0.345])
        for (const dx of [0.34, 0.46, 0.58]) {
          addMesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.034, 12).rotateX(Math.PI / 2),
            shared.black,
            [x0 + dx, 0.2, 0.36],
          )
        }
        // The loading hatch on the sloped top.
        const hatch = addMesh(new THREE.BoxGeometry(0.34, 0.03, 0.44), shared.brushed, [
          x0 + 0.34,
          0.9,
          0,
        ])
        hatch.rotation.z = -0.32
        chimney = {
          x: x0 + 0.3,
          z: 0,
          from: 0.9,
          top: Math.max(rimY + 0.3 * D, 0.9 + 2),
        }
      }

      // ---- chimney -------------------------------------------------------

      if (chimney && v.chimney !== 'none') {
        const sandwich = v.chimney === 'sandwich'
        const r = Math.max(0.055, 0.08 * R) * (sandwich ? 1.3 : 1)
        const length = chimney.top - chimney.from
        addMesh(
          new THREE.CylinderGeometry(r, r, length, 24),
          shared.chrome,
          [chimney.x, chimney.from + length / 2, chimney.z],
        )
        for (let y = chimney.from + 0.45; y < chimney.top - 0.2; y += 0.55) {
          addMesh(
            new THREE.TorusGeometry(r * 1.04, 0.009, 8, 24).rotateX(Math.PI / 2),
            shared.brushed,
            [chimney.x, y, chimney.z],
          )
        }
        if (sandwich) {
          addMesh(
            new THREE.CylinderGeometry(r * 1.12, r * 1.12, 0.12, 24),
            shared.black,
            [chimney.x, chimney.from + length * 0.45, chimney.z],
          )
        }
        addMesh(
          new THREE.ConeGeometry(r * 2.6, 0.12, 24),
          shared.brushed,
          [chimney.x, chimney.top + 0.06, chimney.z],
        )
        addMesh(
          new THREE.CylinderGeometry(r * 1.2, r * 1.2, 0.07, 24),
          shared.brushed,
          [chimney.x, chimney.top - 0.03, chimney.z],
        )
        if (centred) {
          // Perforated shield where the pipe passes the rim.
          addMesh(
            new THREE.CylinderGeometry(r * 1.3, r * 1.3, 0.105 * D, 24, 1, true),
            shared.shield,
            [chimney.x, rimY + 0.04 * D, chimney.z],
          )
        }
      }

      // ---- ladder: three larch treads on a black frame, left of the bowl --

      if (v.ladder !== 'none') {
        const tread = v.ladder === 'wood' ? shared.wood : shared.brushed
        const depth = 0.32
        const width = 0.74
        const heights = [0.26, 0.49, 0.7].map((f) => f * rimY)
        const wallT = Math.min(Math.max((heights[2]! - baseH) / hb, 0), 1)
        const innerEdge = -((heights[2]! < baseH ? rb : radiusAt(wallT)) + 0.04)

        const centreX = (i: number) => innerEdge - depth / 2 - (2 - i) * depth
        for (let i = 0; i < 3; i += 1) {
          const y = heights[i]!
          const x = centreX(i)
          addMesh(new THREE.BoxGeometry(depth * 1.02, 0.05, width), tread, [x, y, 0])
          for (const z of [-(width / 2 - 0.035), width / 2 - 0.035]) {
            addMesh(new THREE.BoxGeometry(depth, 0.04, 0.04), shared.black, [x, y - 0.045, z])
            addMesh(new THREE.BoxGeometry(0.04, y - 0.025, 0.04), shared.black, [
              x - depth / 2 + 0.03,
              (y - 0.025) / 2,
              z,
            ])
            if (i === 2) {
              addMesh(new THREE.BoxGeometry(0.04, y - 0.025, 0.04), shared.black, [
                x + depth / 2 - 0.03,
                (y - 0.025) / 2,
                z,
              ])
            }
          }
        }

        // Handrail on the far side: posts at the first and last tread, a larch
        // rail between them.
        const railZ = -(width / 2 - 0.035)
        const postTop = 0.95
        const a = new THREE.Vector3(centreX(0) - depth / 2 + 0.03, heights[0]! + postTop, railZ)
        const b = new THREE.Vector3(centreX(2) + depth / 2 - 0.03, heights[2]! + postTop, railZ)
        for (const point of [a, b]) {
          addMesh(
            new THREE.BoxGeometry(0.04, postTop, 0.04),
            shared.black,
            [point.x, point.y - postTop / 2, point.z],
          )
        }
        const railLength = a.distanceTo(b)
        const rail = addMesh(
          new THREE.BoxGeometry(railLength, 0.05, 0.06),
          shared.wood,
          [(a.x + b.x) / 2, (a.y + b.y) / 2, railZ],
        )
        rail.rotation.z = Math.atan2(b.y - a.y, b.x - a.x)
      }

      // ---- extras --------------------------------------------------------

      if (v.table) {
        const tx = centred ? 0.42 * R : 0
        const tz = centred ? 0.2 * R : 0
        addMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), shared.brushed, [
          tx,
          waterY + 0.25,
          tz,
        ])
        addMesh(new THREE.CylinderGeometry(0.3, 0.3, 0.045, 8), shared.wood, [
          tx,
          waterY + 0.5,
          tz,
        ])
      }

      if (v.hydro) {
        const t = 0.42
        const ringR = radiusAt(t) - 0.07
        for (let i = 0; i < 8; i += 1) {
          const angle = (i / 8) * Math.PI * 2 + Math.PI / 8
          addMesh(new THREE.SphereGeometry(0.05, 14, 10), shared.chrome, [
            Math.sin(angle) * ringR,
            baseH + t * hb,
            Math.cos(angle) * ringR,
          ])
        }
      }

      if (v.light) {
        const glow = new THREE.PointLight(0x7fd4e6, 4, R * 3, 2)
        glow.position.set(0, waterY - 0.15, 0)
        tubRoot.add(glow)
        addMesh(
          new THREE.TorusGeometry(radiusAt(0.4) - 0.06, 0.016, 8, 8).rotateX(Math.PI / 2),
          track(
            new THREE.MeshStandardMaterial({
              color: 0x8fdcef,
              emissive: 0x6fd0e8,
              emissiveIntensity: 2.4,
            }),
          ),
          [0, baseH + 0.4 * hb, 0],
        )
      }

      if (v.lid) {
        // Leaning on the back of the bowl, so the inside stays in view.
        const lid = addMesh(
          new THREE.CylinderGeometry(0.4 * D, 0.4 * D, 0.06, 8),
          shared.cover,
          [0, 0.42 * D, -(R + 0.3)],
        )
        lid.rotation.x = Math.PI / 2 - 0.2
      }

      // How far the build reaches, taken before the soft shadow is added.
      const reach = new THREE.Box3().setFromObject(tubRoot)
      const sideways = Math.max(
        Math.abs(reach.min.x),
        Math.abs(reach.max.x),
        Math.abs(reach.min.z),
        Math.abs(reach.max.z),
      )

      // ---- soft shadow under the whole thing ------------------------------

      const blob = new THREE.Mesh(
        track(new THREE.PlaneGeometry(D * 3.4, D * 3.4).rotateX(-Math.PI / 2)),
        shared.blob,
      )
      blob.position.y = 0.003
      blob.renderOrder = -1
      tubRoot.add(blob)

      tubRoot.userData.dims = { D, R, rimY, baseH, hb, top: reach.max.y, sideways }
    }

    // ---- camera ----------------------------------------------------------

    const setView = (next: CameraView) => {
      const dims = tubRoot.userData.dims as
        | { D: number; R: number; rimY: number; baseH: number; hb: number; top: number; sideways: number }
        | undefined
      if (!dims) return
      if (next === 'inside') {
        camera.position.set(dims.R * 0.55, dims.rimY + dims.D * 0.55, dims.R * 1.25)
        controls.target.set(0, dims.baseH + dims.hb * 0.7, 0)
      } else {
        // Back off until the widest reach and the chimney both fit; the tub
        // turns about its own axis, so reach is measured from that axis.
        const half = Math.tan((camera.fov * Math.PI) / 360)
        const wide = (dims.sideways * 1.12) / (half * Math.max(camera.aspect, 0.6))
        const tall = (dims.top * 0.58) / half
        const distance = Math.max(wide, tall) + dims.sideways * 0.45
        camera.position.set(distance * 0.42, dims.rimY * 0.8 + 0.55, distance * 0.9)
        controls.target.set(0, dims.top * 0.4, 0)
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
      const t = performance.now() / 1000
      const flicker = 0.88 + 0.08 * Math.sin(t * 11) + 0.04 * Math.sin(t * 23.7)
      for (const { light, base } of fireLights) light.intensity = base * flicker
      shared.fire.emissiveIntensity = 2.4 * flicker
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    apiRef.current = {
      rebuild,
      setView,
      dispose: () => {
        cancelAnimationFrame(frame)
        window.clearTimeout(resumeTimer)
        observer.disconnect()
        clearTub()
        controls.dispose()
        environment.dispose()
        pmrem.dispose()
        ground.geometry.dispose()
        ;(ground.material as THREE.Material).dispose()
        for (const material of Object.values(shared)) material.dispose()
        larchTexture.dispose()
        perforationTexture.dispose()
        blobTexture.dispose()
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
  }, [view, visual.diameter, visual.stove, visual.bowl, visual.chimney])

  return <div ref={mountRef} className="size-full" aria-hidden="true" />
}

export default TubScene
