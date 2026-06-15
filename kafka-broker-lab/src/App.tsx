import { useState } from "react";

import BrokerControls from "./components/BrokerControls";
import PartitionLane from "./components/PartitionLane";
import DLQPanel from "./components/DLQPanel";

import { KafkaMessageBroker } from "./services/KafkaBroker";

const broker = new KafkaMessageBroker();

export default function App() {
  const [, forceUpdate] = useState(0);

  const refresh = () =>
    forceUpdate(v => v + 1);

  const sendMessage = () => {
    broker.produce("user-events", {
      key: "abc",
      payload: "SYNC_USER_PREFS"
    });

    refresh();
  };

  const sendPoison = () => {
    broker.produce("user-events", {
      key: "xyz",
      payload: "CHARGE_BALANCE:fail"
    });

    refresh();
  };

  const consume = () => {
    broker.processConsumerTick(0);
    broker.processConsumerTick(1);

    refresh();
  };

  return (
    <div>
      <h1>Kafka Broker Simulator</h1>

      <BrokerControls
        onSendMessage={sendMessage}
        onSendPoison={sendPoison}
        onConsume={consume}
      />

      <PartitionLane
        title="Partition 0"
        records={broker.getPartition(0)}
      />

      <PartitionLane
        title="Partition 1"
        records={broker.getPartition(1)}
      />

      <DLQPanel
        messages={broker.getDLQ()}
        onRequeue={offset => {
          broker.requeueFromDLQ(offset);
          refresh();
        }}
      />
    </div>
  );
}