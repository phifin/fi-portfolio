import { useEffect, useState } from 'react'

export type DeviceTier = 'high' | 'mid' | 'low'

export type DeviceInfo = {
  tier: DeviceTier
  isMobile: boolean
  isTouch: boolean
  reducedMotion: boolean
  dpr: [number, number]
}

function compute(): DeviceInfo {
  if (typeof window === 'undefined') {
    return { tier: 'high', isMobile: false, isTouch: false, reducedMotion: false, dpr: [1, 2] }
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const width = window.innerWidth
  const isMobile = width < 768

  const cores = navigator.hardwareConcurrency || 4
  // deviceMemory is non-standard but useful when available
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4

  let tier: DeviceTier = 'high'
  if (reducedMotion) tier = 'low'
  else if (isMobile || cores <= 4 || mem <= 4) tier = 'mid'
  if (cores <= 2 || mem <= 2) tier = 'low'

  const dpr: [number, number] = tier === 'high' ? [1, 2] : tier === 'mid' ? [1, 1.5] : [1, 1]

  return { tier, isMobile, isTouch, reducedMotion, dpr }
}

/** Device capability tier used to scale down heavy 3D on weaker/mobile devices. */
export function useDeviceTier(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(compute)

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setInfo(compute()))
    }
    window.addEventListener('resize', onResize)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener?.('change', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      mq.removeEventListener?.('change', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return info
}
