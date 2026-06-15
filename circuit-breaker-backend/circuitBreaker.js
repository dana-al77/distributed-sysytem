class CircuitBreaker {
  constructor(limit = 3, cooldown = 5000) {
    this.state = "CLOSED";
    this.failures = 0;
    this.limit = limit;
    this.cooldown = cooldown;
    this.nextTry = 0;
  }

  async execute(apiCall, fallback) {
    if (this.state === "OPEN") {
      if (Date.now() > this.nextTry) {
        this.state = "HALF_OPEN";
        console.log("HALF_OPEN");
      } else {
        return fallback;
      }
    }

    try {
      const result = await apiCall();

      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.failures = 0;
        console.log("CLOSED");
      }

      return result;
    } catch (error) {
      this.failures++;

      console.log(`Failure count: ${this.failures}`);

      if (this.failures >= this.limit) {
        this.state = "OPEN";
        this.nextTry = Date.now() + this.cooldown;

        console.log("OPEN");
      }

      return fallback;
    }
  }

  getState() {
    return this.state;
  }
}

module.exports = CircuitBreaker;