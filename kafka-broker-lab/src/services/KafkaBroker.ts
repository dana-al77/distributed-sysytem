import type { KafkaRecord, ProduceMessage } from "../types/KafkaTypes";

export class KafkaMessageBroker {
  private partitionCommitLog: Map<number, KafkaRecord[]> = new Map();

  private deadLetterQueue: KafkaRecord[] = [];

  private currentOffset = 0;

  constructor() {
    this.partitionCommitLog.set(0, []);
    this.partitionCommitLog.set(1, []);
  }

  // 📤 PRODUCE
  produce(topic: string, message: ProduceMessage) {
    const partition = message.key.length % 2;

    const records = this.partitionCommitLog.get(partition) || [];

    records.push({
      offset: this.currentOffset++,
      timestamp: Date.now(),
      payload: message.payload,
      retries: 0,
      status: "pending",
      partition
    } );

    this.partitionCommitLog.set(partition, records);
  }

  // ⚙️ CONSUMER STEP
  processConsumerTick(partition: number) {
    const queue = this.partitionCommitLog.get(partition) || [];

    const activeIndex = queue.findIndex(
      item => item.status === "pending"
    );

    if (activeIndex === -1) {
      return null;
    }

    const active = queue[activeIndex];

    active.status = "processing";

    // 💥 FAIL CASE
    if (active.payload.includes(":fail")) {
      active.retries++;

      if (active.retries >= 3) {
        active.status = "poison";

        this.deadLetterQueue.push(active);

        queue.splice(activeIndex, 1);

        return {
          status: "dlq",
          offset: active.offset
        };
      }

      active.status = "pending";

      return {
        status: "retry",
        offset: active.offset,
        retryCount: active.retries
      };
    }

    // ✅ SUCCESS CASE
    active.status = "committed";

    queue.splice(activeIndex, 1);

    return {
      status: "success",
      offset: active.offset
    };
  }

  // 📦 GET PARTITION
  getPartition(partition: number) {
    return this.partitionCommitLog.get(partition) || [];
  }

  // 🟥 GET DLQ
  getDLQ() {
    return this.deadLetterQueue;
  }

  // 🔁 REQUEUE FROM DLQ
  requeueFromDLQ(offset: number) {
    const index = this.deadLetterQueue.findIndex(
      item => item.offset === offset
    );

    if (index === -1) return;

    const msg = this.deadLetterQueue[index];

    msg.payload = msg.payload.replace(":fail", "");
    msg.retries = 0;
    msg.status = "pending";

    // يرجع لنفس partition الصحيح
    const partition = (msg ).partition;

    const queue = this.partitionCommitLog.get(partition) || [];

    queue.push(msg);

    this.partitionCommitLog.set(partition, queue);

    this.deadLetterQueue.splice(index, 1);
  }
}