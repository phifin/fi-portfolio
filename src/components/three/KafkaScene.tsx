import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Node, Connection, MessageStream, COLORS } from './FlowPrimitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import type { DeviceTier } from '../../hooks/useDeviceTier'

const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z)

// pipeline waypoints
const orderP = v(-3.4, 1.2)
const outboxP = v(-3.4, -0.6)
const debeziumP = v(-1.3, -0.6)
const kafkaP = v(0.8, 0.3)
const consumers = [v(3.1, 1.5), v(3.1, 0.1), v(3.1, -1.3)]
const consumerLabels = ['Order', 'Invoice', 'Notify']

function Partitions({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.4) * 0.05
  })
  return (
    <group ref={ref} position={position}>
      {[-0.28, 0, 0.28].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.5, 0.16, 0.3]} />
          <meshStandardMaterial color="#160f2e" emissive={COLORS.violet} emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ tier }: { tier: DeviceTier }) {
  const group = useRef<THREE.Group>(null)
  const { isMobile } = useDeviceTier()
  const { pointer } = useThree()
  useFrame((state) => {
    if (!group.current) return
    const targetY = tier === 'low' ? 0 : pointer.x * 0.25
    const targetX = tier === 'low' ? 0 : -pointer.y * 0.15
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
    group.current.position.y = -0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })

  const streamCount = tier === 'high' ? 5 : tier === 'mid' ? 3 : 2

  return (
    <group ref={group} scale={isMobile ? 0.6 : tier === 'low' ? 0.85 : 1}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 5]} intensity={40} color={COLORS.cyan} />
      <pointLight position={[3, -3, 3]} intensity={30} color={COLORS.violet} />

      {/* nodes */}
      <Node position={orderP.toArray() as [number, number, number]} label="Order Service" sub="Java · PostgreSQL" color={COLORS.cyan} />
      <Node position={outboxP.toArray() as [number, number, number]} label="Outbox" sub="transactional" color={COLORS.green} size={[1.2, 0.6, 0.4]} />
      <Node position={debeziumP.toArray() as [number, number, number]} label="Debezium CDC" sub="stream" color={COLORS.amber} />
      <group>
        <Node position={kafkaP.toArray() as [number, number, number]} label="Kafka" sub="topic · partitions" color={COLORS.violet} size={[1.8, 1.1, 0.4]} />
        <Partitions position={kafkaP.toArray() as [number, number, number]} />
      </group>
      {consumers.map((c, i) => (
        <Node key={i} position={c.toArray() as [number, number, number]} label={consumerLabels[i]} color={COLORS.magenta} size={[1.05, 0.55, 0.35]} />
      ))}

      {/* connections */}
      <Connection points={[orderP, outboxP]} color={COLORS.green} />
      <Connection points={[outboxP, debeziumP]} color={COLORS.amber} />
      <Connection points={[debeziumP, kafkaP]} color={COLORS.amber} />
      {consumers.map((c, i) => (
        <Connection key={i} points={[kafkaP, v((kafkaP.x + c.x) / 2, c.y + (kafkaP.y - c.y) * 0.4), c]} color={COLORS.magenta} />
      ))}

      {/* message flow */}
      <MessageStream points={[orderP, outboxP]} count={streamCount} color={COLORS.green} speed={0.4} />
      <MessageStream points={[outboxP, debeziumP, kafkaP]} count={streamCount} color={COLORS.amber} speed={0.22} />
      {consumers.map((c, i) => (
        <MessageStream
          key={i}
          points={[kafkaP, v((kafkaP.x + c.x) / 2, c.y + (kafkaP.y - c.y) * 0.4), c]}
          count={streamCount}
          color={COLORS.magenta}
          speed={0.3}
        />
      ))}
    </group>
  )
}

export { Scene as KafkaScene }
