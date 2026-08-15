import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramCanvas } from '../three/DiagramCanvas'
import { KafkaScene } from '../three/KafkaScene'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

const legendItems = [
  { color: '#34d399', label: 'Outbox write' },
  { color: '#fbbf24', label: 'Debezium CDC' },
  { color: '#a855f7', label: 'Kafka topic' },
  { color: '#e879f9', label: 'Consumers' },
]

export function KafkaDeepDive() {
  const { pick } = useLang()
  const { tier } = useDeviceTier()

  return (
    <DeepDiveLayout
      id={sectionIds.kafka}
      kicker={pick(ui.kafka.kicker)}
      title={pick(ui.kafka.title)}
      body={pick(ui.kafka.body)}
      wide
      legend={
        <div className="mt-2 flex flex-wrap gap-3">
          {legendItems.map((l) => (
            <span key={l.label} className="chip">
              <span className="h-2 w-2 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
              {l.label}
            </span>
          ))}
        </div>
      }
    >
      <DiagramCanvas cameraZ={7.8} fov={46}>
        <KafkaScene tier={tier} />
      </DiagramCanvas>
    </DeepDiveLayout>
  )
}
