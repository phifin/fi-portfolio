import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useDeviceTier } from '../../hooks/useDeviceTier'

type Props = {
  children: ReactNode
  cameraZ?: number
  fov?: number
  bloom?: boolean
}

/** Shared Canvas for the architecture diagrams, tier-aware. */
export function DiagramCanvas({ children, cameraZ = 9, fov = 45, bloom = true }: Props) {
  const { tier, dpr } = useDeviceTier()
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, cameraZ], fov }}
      gl={{ antialias: tier !== 'low', powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        {children}
        {bloom && tier !== 'low' && (
          <EffectComposer>
            <Bloom intensity={tier === 'high' ? 0.9 : 0.5} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  )
}
