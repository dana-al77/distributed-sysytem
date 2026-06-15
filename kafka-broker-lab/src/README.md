# Kafka Message Bus Broker Controller

## Overview

This project simulates a Kafka-style Message Broker with partition-based message routing, retry handling, and a Dead Letter Queue (DLQ).

The implementation demonstrates core distributed systems concepts including:

* Topic partitioning
* Sequential message processing
* Offset tracking
* Retry mechanisms
* Poison message isolation
* Dead Letter Queue (DLQ)
* Message requeueing

---

## Features

### Partition Routing

Messages are distributed between two partitions:

* Partition 0
* Partition 1

Partition selection is determined using:

```ts
const partition = message.key.length % 2;
```

---

### Offset Management

Each produced message receives a unique sequential offset:

```ts
offset: this.currentOffset++
```

This simulates Kafka-style offset tracking.

---

### Sequential Processing

Consumers process only the first pending message in a partition during each processing tick.

This preserves FIFO-style behavior within a partition.

---

### Retry Handling

Messages containing `:fail` simulate processing failures.

Example:

```txt
CHARGE_BALANCE:fail
```

Failed messages increment their retry counter.

---

### Dead Letter Queue (DLQ)

After 3 failed processing attempts, the message is:

* Marked as poison
* Removed from the partition
* Moved to the Dead Letter Queue

This prevents poison messages from blocking the processing pipeline.

---

### Requeue Support

Messages stored in the DLQ can be requeued.

The implementation:

* Resets retry count
* Restores pending status
* Returns the message to its original partition

---

## Project Structure

```txt
src/
├── services/
│   └── KafkaBroker.ts
├── components/
│   ├── BrokerControls.tsx
│   ├── PartitionLane.tsx
│   └── DLQPanel.tsx
├── types/
│   └── KafkaTypes.ts
└── App.tsx
```

---

## Demonstration Flow

### Successful Message

1. Send Event
2. Run Consumer Step
3. Message is committed successfully

### Poison Message

1. Send Poison Config
2. Run Consumer Step three times
3. Message moves to DLQ

### Recovery

1. Click Requeue
2. Message returns to partition
3. Run Consumer Step
4. Message is processed successfully

---

## Concepts Demonstrated

* Distributed Messaging
* Kafka Partitioning
* Offset Tracking
* Retry Strategies
* Fault Isolation
* Dead Letter Queues
* Event-Driven Processing
* Backend Message Brokers

```
```
