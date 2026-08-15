import { Server, Radio, Boxes, FileText, Bell, Network } from 'lucide-react'
import { DeepDiveLayout } from '../ui/DeepDiveLayout'
import { DiagramLegend } from '../ui/DiagramLegend'
import { ServiceNode, Datastore, TopicNode, Edge, FlowPackets, DIA } from '../diagram/primitives'
import { useLang } from '../../providers/LanguageProvider'
import { ui } from '../../i18n'
import { sectionIds } from '../../data/content'

function KafkaDiagram() {
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {/* edges (draw under nodes) */}
      <Edge id="k1" from={[130, 145]} to={[142, 145]} color={DIA.green} />
      <Edge id="k2" from={[212, 145]} to={[224, 145]} color={DIA.green} />
      <Edge id="k3" from={[344, 145]} to={[356, 148]} color={DIA.amber} />
      <Edge id="k4" from={[458, 130]} to={[476, 62]} via={[470, 96]} color={DIA.blue} />
      <Edge id="k5" from={[458, 150]} to={[476, 150]} color={DIA.blue} />
      <Edge id="k6" from={[458, 168]} to={[476, 236]} via={[470, 202]} color={DIA.blue} />

      {/* animated flow */}
      <FlowPackets points={[[130, 145], [142, 145]]} color={DIA.green} count={2} dur={1.4} />
      <FlowPackets points={[[212, 145], [283, 145], [354, 148]]} color={DIA.amber} count={3} dur={2} />
      <FlowPackets points={[[458, 148], [476, 62]]} color={DIA.sky} count={2} dur={1.6} />
      <FlowPackets points={[[458, 150], [476, 150]]} color={DIA.sky} count={2} dur={1.5} />
      <FlowPackets points={[[458, 150], [476, 236]]} color={DIA.sky} count={2} dur={1.7} />

      {/* nodes */}
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

export function KafkaDeepDive() {
  const { pick } = useLang()
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
      <KafkaDiagram />
    </DeepDiveLayout>
  )
}
