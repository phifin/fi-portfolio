import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { DeviceTier } from '../../hooks/useDeviceTier'

function ParticleCloud({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.2 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04
      ref.current.rotation.x += delta * 0.015
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#5eead4" size={0.035} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  )
}

/** A rotating wireframe node-graph — a distributed-systems / microservices motif. */
function NetworkGraph({ detail }: { detail: number }) {
  const group = useRef<THREE.Group>(null)

  const { geo, edges } = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.35, detail)
    return { geo: g, edges: new THREE.EdgesGeometry(g) }
  }, [detail])

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18
      group.current.rotation.x += delta * 0.05
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1} position={[1.95, 0.3, -0.5]}>
      <group ref={group}>
        {/* faint solid core */}
        <mesh geometry={geo}>
          <meshBasicMaterial color="#0b3566" transparent opacity={0.18} depthWrite={false} />
        </mesh>
        {/* glowing edges = links between services */}
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#22d3ee" transparent opacity={0.55} />
        </lineSegments>
        {/* nodes at each vertex */}
        <points geometry={geo}>
          <pointsMaterial color="#a9f4ff" size={0.11} sizeAttenuation depthWrite={false} />
        </points>
      </group>
    </Float>
  )
}

function Rig({ enablePointer }: { enablePointer: boolean }) {
  const { camera, pointer } = useThree()
  const target = useRef(new THREE.Vector3())
  useFrame(() => {
    if (!enablePointer) return
    target.current.set(pointer.x * 0.6, pointer.y * 0.4, 5)
    camera.position.lerp(target.current, 0.03)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroScene({ tier }: { tier: DeviceTier }) {
  const particleCount = tier === 'high' ? 900 : tier === 'mid' ? 450 : 200
  const detail = tier === 'high' ? 2 : 1
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={90} color="#22d3ee" />
      <pointLight position={[-6, -4, 2]} intensity={70} color="#4f8cff" />
      <NetworkGraph detail={detail} />
      <ParticleCloud count={particleCount} />
      <Rig enablePointer={tier !== 'low'} />
    </>
  )
}
