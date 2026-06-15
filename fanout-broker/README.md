# 📡 Pub/Sub Fanout Message Broker

## 📌 Overview

This project implements a **Pub/Sub Fanout Message Broker system** that simulates how distributed systems broadcast messages from a single publisher to multiple subscribers.

A single published event is delivered asynchronously to all subscribers registered under the same topic.

---

## 🧠 Core Concept

This system follows the **Fanout Pattern**:

> One message → Multiple subscribers

Example:
- Publish GPS update
- All drivers + passenger apps receive it simultaneously

---

## ⚙️ Features

- Topic-based subscription system
- Multiple subscribers per topic
- Fan-out message delivery
- Asynchronous event dispatch (non-blocking)
- Fault isolation between subscribers
- Frontend dashboard for visualization

---

## 🏗️ Architecture

### Backend Logic (Core)

- `FanoutMessageBroker`
- Handles:
  - subscribe(topic, handler)
  - publish(topic, payload)

### Frontend (Visualization Layer)

- React dashboard
- Displays real-time messages
- Shows subscriber outputs

---

## 🚀 How It Works

### 1. Subscribe

Subscribers register to a topic:

```ts
broker.subscribe("gps", (msg) => {
  console.log(msg);
});