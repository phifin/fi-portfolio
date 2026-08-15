import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export const COLORS = {
  cyan: '#22d3ee',
  violet: '#a855f7',
  magenta: '#e879f9',
  green: '#34d399',
  amber: '#fbbf24',
  red: '#fb7185',
}

export function Node({
  position,
  label,
  sub,
  color = COLORS.cyan,
  size = [1.4, 0.7, 0.4] as [number, number, number],
}: {
  position: [number, number, number]
  label: string
  sub?: string
  color?: string
  size?: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.15
    }
  })
  return (
    <group position={position}>
      <RoundedBox ref={ref} args={size} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#0f1330"
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.6}
        />
      </RoundedBox>
      {/* wire glow edge */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], size[2])]} />
        <lineBasicMaterial color={color} transparent opacity={0.9} />
      </lineSegments>
      <Html center distanceFactor={9} position={[0, 0, size[2] / 2 + 0.02]}>
        <div style={{ pointerEvents: 'none', textAlign: 'center', width: 116 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{label}</div>
          {sub && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>{sub}</div>}
        </div>
      </Html>
    </group>
  )
}

export function Connection({ points, color = COLORS.cyan }: { points: THREE.Vector3[]; color?: string }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(40))
  }, [points])
  return (
    <line>
      <primitive object={geo} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={0.28} />
    </line>
  )
}

/** Emissive packets traveling along a curve, looping with staggered phases. */
export function MessageStream({
  points,
  count = 4,
  color = COLORS.cyan,
  speed = 0.25,
  size = 0.09,
}: {
  points: THREE.Vector3[]
  count?: number
  color?: string
  speed?: number
  size?: number
}) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    for (let i = 0; i < count; i++) {
      const mesh = refs.current[i]
      if (!mesh) continue
      const p = (t + i / count) % 1
      const pos = curve.getPointAt(p)
      mesh.position.copy(pos)
      const s = size * (0.7 + 0.5 * Math.sin(p * Math.PI))
      mesh.scale.setScalar(s / size)
    }
  })

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <sphereGeometry args={[size, 12, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}
