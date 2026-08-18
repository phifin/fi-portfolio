import { Server, Radio, Boxes, FileText, Bell, Network } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Datastore, TopicNode, Edge, FlowPackets, DIA } from '../diagram/primitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

function KafkaDiagramH() {
  // Row 1 = ingest pipeline (top); Row 2 = consumers fanned out below Kafka.
  return (
    <svg viewBox="0 0 620 390" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {/* pipeline edges */}
      <Edge id="k1" from={[166, 96]} to={[196, 96]} color={DIA.green} />
      <Edge id="k2" from={[276, 96]} to={[306, 96]} color={DIA.amber} />
      <Edge id="k3" from={[452, 96]} to={[482, 98]} color={DIA.amber} />
      {/* fan-out edges */}
      <Edge id="k4" from={[538, 138]} to={[196, 268]} via={[300, 220]} color={DIA.blue} />
      <Edge id="k5" from={[538, 138]} to={[380, 268]} via={[440, 210]} color={DIA.blue} />
      <Edge id="k6" from={[538, 138]} to={[536, 268]} via={[540, 210]} color={DIA.blue} />

      <FlowPackets points={[[166, 96], [196, 96]]} color={DIA.green} count={2} dur={1.3} />
      <FlowPackets points={[[276, 96], [306, 96]]} color={DIA.amber} count={2} dur={1.3} />
      <FlowPackets points={[[452, 98], [482, 98]]} color={DIA.amber} count={2} dur={1.3} />
      <FlowPackets points={[[538, 138], [300, 220], [196, 268]]} color={DIA.sky} count={3} dur={2} />
      <FlowPackets points={[[538, 138], [440, 210], [380, 268]]} color={DIA.sky} count={3} dur={1.9} />
      <FlowPackets points={[[538, 138], [540, 210], [536, 268]]} color={DIA.sky} count={2} dur={1.7} />

      {/* row 1: pipeline */}
      <ServiceNode x={20} y={66} w={146} h={60} title="Order Service" sub="Java · PostgreSQL" color={DIA.cyan} Icon={Server} />
      <Datastore x={196} y={58} w={80} h={78} title="Outbox" sub="transactional" color={DIA.green} />
      <ServiceNode x={306} y={66} w={146} h={60} title="Debezium" sub="CDC · stream" color={DIA.amber} Icon={Radio} />
      <TopicNode x={482} y={54} w={116} h={86} title="Kafka" sub="topic · partitions" color={DIA.blue} />

      {/* row 2: consumers */}
      <ServiceNode x={126} y={268} w={140} h={58} title="Orders" sub="consumer" color={DIA.sky} Icon={Boxes} />
      <ServiceNode x={310} y={268} w={140} h={58} title="Invoices" sub="consumer" color={DIA.sky} Icon={FileText} />
      <ServiceNode x={466} y={268} w={140} h={58} title="Notify" sub="consumer" color={DIA.sky} Icon={Bell} />
    </svg>
  )
}

function KafkaDiagramV() {
  // Spine gaps are 22 units, not the 14 they used to be: a shorter arrowhead
  // still needs room for the line itself to read on a phone.
  const cons: [number, number] = [58, 386]
  return (
    <svg viewBox="0 0 340 452" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {/* spine edges */}
      <Edge id="kv1" from={[170, 60]} to={[170, 82]} color={DIA.green} />
      <Edge id="kv2" from={[170, 144]} to={[170, 166]} color={DIA.green} />
      <Edge id="kv3" from={[170, 220]} to={[170, 242]} color={DIA.amber} />
      <Edge id="kv4" from={[126, 320]} to={[58, 380]} via={[70, 352]} color={DIA.blue} />
      <Edge id="kv5" from={[170, 320]} to={[170, 380]} color={DIA.blue} />
      <Edge id="kv6" from={[214, 320]} to={[282, 380]} via={[270, 352]} color={DIA.blue} />

      <FlowPackets points={[[170, 60], [170, 82]]} color={DIA.green} count={2} dur={1.3} />
      <FlowPackets points={[[170, 144], [170, 166]]} color={DIA.green} count={2} dur={1.3} />
      <FlowPackets points={[[170, 220], [170, 242]]} color={DIA.amber} count={2} dur={1.4} />
      <FlowPackets points={[[170, 320], cons]} color={DIA.sky} count={2} dur={1.6} />
      <FlowPackets points={[[170, 320], [170, 380]]} color={DIA.sky} count={2} dur={1.5} />
      <FlowPackets points={[[170, 320], [282, 386]]} color={DIA.sky} count={2} dur={1.7} />

      <ServiceNode x={88} y={10} w={164} h={50} title="Order Service" sub="Java · PostgreSQL" color={DIA.cyan} Icon={Server} />
      <Datastore x={135} y={84} w={70} h={60} title="Outbox" sub="transactional" color={DIA.green} />
      <ServiceNode x={88} y={170} w={164} h={50} title="Debezium" sub="CDC · stream" color={DIA.amber} Icon={Radio} />
      <TopicNode x={100} y={246} w={140} h={74} title="Kafka" sub="topic · partitions" color={DIA.blue} />

      <ServiceNode x={4} y={386} w={104} h={50} title="Orders" color={DIA.sky} Icon={Boxes} />
      <ServiceNode x={118} y={386} w={104} h={50} title="Invoices" color={DIA.sky} Icon={FileText} />
      <ServiceNode x={232} y={386} w={104} h={50} title="Notify" color={DIA.sky} Icon={Bell} />
    </svg>
  )
}

export function KafkaDeepDive() {
  const { pick } = useLang()
  const { isMobile } = useDeviceTier()
  return (
    <DeepDiveLayout
      id={sectionIds.kafka}
      kicker={pick(ui.kafka.kicker)}
      title={pick(ui.kafka.title)}
      body={pick(ui.kafka.body)}
      Icon={Network}
      wide
      legend={
        <DiagramLegend
          items={[
            { Icon: Server, label: 'Order Service', color: DIA.cyan },
            { Icon: Radio, label: 'Outbox + CDC', color: DIA.amber },
            { Icon: Boxes, label: 'Kafka topic', color: DIA.blue },
            { Icon: Bell, label: 'Consumers', color: DIA.sky },
          ]}
        />
      }
    >
      {isMobile ? <KafkaDiagramV /> : <KafkaDiagramH />}
    </DeepDiveLayout>
  )
}
