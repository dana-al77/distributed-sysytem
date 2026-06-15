
# Fault-Tolerant Client Interceptor (Resilient Fetcher)

## Overview

This project implements a **client-side resilience mechanism** using a combination of:

* Circuit Breaker Pattern
* Retry Strategy with Exponential Backoff
* Fallback Handling

It demonstrates how frontend applications can handle unstable backend services safely without crashing.

---

## Architecture

The system is composed of:

### 1. React Frontend (App)

* Sends requests to backend API
* Displays system state and responses
* Shows Circuit Breaker status in real-time

### 2. ResilientFetcher Class

Handles all request resilience logic including:

* Circuit state management
* Retry mechanism
* Fallback response

---

## Circuit Breaker States

### CLOSED

* Requests are sent normally
* Failures are tracked

### OPEN

* Requests are blocked
* Fallback is returned immediately
* Cooldown period is active

### HALF-OPEN

* System allows test request
* If successful → back to CLOSED
* If failed → returns to OPEN

---

## Core Features

### 1. Retry with Exponential Backoff

If a request fails:

* It retries up to 2 times
* Delay increases after each retry

```js id="rf1"
await this.fetchWithRetry(url, retries - 1, delayMs * 2);
```

---

### 2. Circuit Breaker Protection

If failures reach threshold:

```js id="rf2"
if (this.failureCount >= this.threshold) {
  this.state = "OPEN";
  this.cooldownEndDate = Date.now() + 5000;
}
```

---

### 3. Fallback Response

If all retries fail:

```json id="rf3"
{
  "fallback": true,
  "message": "Fallback Response"
}
```

---

## Frontend Behavior

The UI shows:

* Current Circuit Breaker state
* API response (success or fallback)
* Button to trigger request

### Example Flow:

1. User clicks "Send Request"
2. Request is sent to backend (`/data`)
3. If backend fails:

   * Retry mechanism activates
4. If all retries fail:

   * fallback response is shown
5. State updates in UI

---

## Backend Dependency

This project works with a backend running on:

```
http://localhost:3000/data
```

Expected backend:

* Circuit Breaker API (from Task 1)

---

## Key Concepts Demonstrated

* Client-side fault tolerance
* Circuit Breaker pattern
* Retry strategies
* Exponential backoff
* Graceful degradation
* Microservices resilience
* Frontend-backend reliability handling

---

## How to Run

### Backend (Task 1)

```bash id="rf4"
node server.js
```

### Frontend

```bash id="rf5"
npm install
npm run dev
```

---

## Summary

This project demonstrates how frontend applications can remain stable even when backend services fail by combining:

* Circuit Breaker protection
* Smart retry logic
* Fallback responses

```
```
