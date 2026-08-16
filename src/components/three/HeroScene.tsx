import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
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
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={90} color="#22d3ee" />
      <pointLight position={[-6, -4, 2]} intensity={70} color="#4f8cff" />
      <ParticleCloud count={particleCount} />
      <Rig enablePointer={tier !== 'low'} />
    </>
  )
}
