# Circuit Breaker Pattern - Fault Tolerance Service

## Overview

This project implements a **Circuit Breaker Pattern** using Node.js and Express to simulate fault tolerance in distributed systems.

The system protects services from repeated failures by temporarily blocking requests when a service becomes unstable.

---

## How It Works

The Circuit Breaker has 3 states:

### 1. CLOSED

* Requests are allowed normally
* Failures are counted

### 2. OPEN

* Requests are blocked
* Fallback response is returned immediately
* System waits for cooldown period

### 3. HALF-OPEN

* System allows a test request
* If successful → returns to CLOSED
* If failed → returns to OPEN again

---

## Core Logic

### Circuit Breaker Class

* Tracks number of failures
* Opens circuit after reaching failure limit
* Resets after successful recovery

```js id="cb1"
if (this.failures >= this.limit) {
  this.state = "OPEN";
  this.nextTry = Date.now() + this.cooldown;
}
```

---

## API Endpoints

### GET `/data`

* Calls a fake service
* Protected by Circuit Breaker
* Returns either:

  * Real service response
  * Fallback response

---

### POST `/toggle-failure`

* Enables or disables simulated service failure

Example body:

```json id="cb2"
{
  "fail": true
}
```

---

### GET `/status`

Returns current system state:

* Circuit Breaker state
* Service failure mode

---

## Fake Service Simulation

The service randomly succeeds or fails based on `failMode`:

* If `failMode = true` → service fails
* If `failMode = false` → returns success response

---

## Key Concepts Demonstrated

* Circuit Breaker Pattern
* Fault Tolerance
* Service Resilience
* Fallback Mechanisms
* State Transitions (CLOSED / OPEN / HALF-OPEN)
* API Reliability Protection

---

## How to Run

```bash id="cb3"
npm install
node index.js
```

Server runs on:

```
http://localhost:3000
```

---

## Testing Flow

1. Call `/data` → success response
2. Enable failure via `/toggle-failure`
3. Call `/data` multiple times → circuit opens
4. System returns fallback response
5. Wait cooldown → circuit becomes HALF-OPEN
6. Recovery returns system to CLOSED state

```
```
