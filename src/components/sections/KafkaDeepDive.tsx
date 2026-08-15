import { Server, Radio, Boxes, FileText, Bell, Network } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Datastore, TopicNode, Edge, FlowPackets, DIA } from '../diagram/primitives'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

function KafkaDiagramH() {
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Edge id="k1" from={[130, 145]} to={[142, 145]} color={DIA.green} />
      <Edge id="k2" from={[212, 145]} to={[224, 145]} color={DIA.green} />
      <Edge id="k3" from={[344, 145]} to={[356, 148]} color={DIA.amber} />
      <Edge id="k4" from={[458, 130]} to={[476, 62]} via={[470, 96]} color={DIA.blue} />
      <Edge id="k5" from={[458, 150]} to={[476, 150]} color={DIA.blue} />
      <Edge id="k6" from={[458, 168]} to={[476, 236]} via={[470, 202]} color={DIA.blue} />

      <FlowPackets points={[[130, 145], [142, 145]]} color={DIA.green} count={2} dur={1.4} />
      <FlowPackets points={[[212, 145], [283, 145], [354, 148]]} color={DIA.amber} count={3} dur={2} />
      <FlowPackets points={[[458, 148], [476, 62]]} color={DIA.sky} count={2} dur={1.6} />
      <FlowPackets points={[[458, 150], [476, 150]]} color={DIA.sky} count={2} dur={1.5} />
      <FlowPackets points={[[458, 150], [476, 236]]} color={DIA.sky} count={2} dur={1.7} />

      <ServiceNode x={10} y={120} w={120} h={50} title="Order Service" sub="Java · PostgreSQL" color={DIA.cyan} Icon={Server} />
      <Datastore x={142} y={112} w={70} h={66} title="Outbox" sub="transactional" color={DIA.green} />
      <ServiceNode x={224} y={120} w={120} h={50} title="Debezium" sub="CDC · stream" color={DIA.amber} Icon={Radio} />
      <TopicNode x={356} y={110} w={104} h={76} title="Kafka" sub="topic · partitions" color={DIA.blue} />

      <ServiceNode x={476} y={38} w={116} h={46} title="Orders" sub="consumer" color={DIA.sky} Icon={Boxes} />
      <ServiceNode x={476} y={127} w={116} h={46} title="Invoices" sub="consumer" color={DIA.sky} Icon={FileText} />
      <ServiceNode x={476} y={216} w={116} h={46} title="Notify" sub="consumer" color={DIA.sky} Icon={Bell} />
    </svg>
  )
}

function KafkaDiagramV() {
  const cons: [number, number] = [58, 372]
  return (
    <svg viewBox="0 0 340 440" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {/* spine edges */}
      <Edge id="kv1" from={[170, 60]} to={[170, 74]} color={DIA.green} />
      <Edge id="kv2" from={[170, 136]} to={[170, 150]} color={DIA.green} />
      <Edge id="kv3" from={[170, 204]} to={[170, 222]} color={DIA.amber} />
      <Edge id="kv4" from={[126, 300]} to={[58, 366]} via={[70, 336]} color={DIA.blue} />
      <Edge id="kv5" from={[170, 302]} to={[170, 366]} color={DIA.blue} />
      <Edge id="kv6" from={[214, 300]} to={[282, 366]} via={[270, 336]} color={DIA.blue} />

      <FlowPackets points={[[170, 60], [170, 74]]} color={DIA.green} count={2} dur={1.3} />
      <FlowPackets points={[[170, 136], [170, 150]]} color={DIA.green} count={2} dur={1.3} />
      <FlowPackets points={[[170, 204], [170, 222]]} color={DIA.amber} count={2} dur={1.4} />
      <FlowPackets points={[[170, 300], cons]} color={DIA.sky} count={2} dur={1.6} />
      <FlowPackets points={[[170, 302], [170, 366]]} color={DIA.sky} count={2} dur={1.5} />
      <FlowPackets points={[[170, 300], [282, 366]]} color={DIA.sky} count={2} dur={1.7} />

      <ServiceNode x={88} y={10} w={164} h={50} title="Order Service" sub="Java · PostgreSQL" color={DIA.cyan} Icon={Server} />
      <Datastore x={135} y={76} w={70} h={60} title="Outbox" sub="transactional" color={DIA.green} />
      <ServiceNode x={88} y={154} w={164} h={50} title="Debezium" sub="CDC · stream" color={DIA.amber} Icon={Radio} />
      <TopicNode x={100} y={226} w={140} h={74} title="Kafka" sub="topic · partitions" color={DIA.blue} />

      <ServiceNode x={4} y={372} w={104} h={50} title="Orders" color={DIA.sky} Icon={Boxes} />
      <ServiceNode x={118} y={372} w={104} h={50} title="Invoices" color={DIA.sky} Icon={FileText} />
      <ServiceNode x={232} y={372} w={104} h={50} title="Notify" color={DIA.sky} Icon={Bell} />
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
