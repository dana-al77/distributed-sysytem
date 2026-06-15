export default class ResilientFetcher {
  constructor() {
    this.failureCount = 0;
    this.threshold = 3;

    this.state = "CLOSED";

    this.cooldownEndDate = 0;
  }

  async fetchWithRetry(
    url,
    retries = 2,
    delayMs = 1000
  ) {

    if (this.state === "OPEN") {

      if (Date.now() > this.cooldownEndDate) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error(
          "Circuit Breaker OPEN"
        );
      }
    }

    try {

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Request Failed");
      }

      const data = await response.json();

      if (this.state === "HALF_OPEN") {

        this.state = "CLOSED";
        this.failureCount = 0;
      }

      return data;

    } catch (error) {

      this.failureCount++;

      if (
        this.failureCount >= this.threshold
      ) {

        this.state = "OPEN";

        this.cooldownEndDate =
          Date.now() + 5000;
      }

      if (retries > 0) {

        await new Promise((resolve) =>
          setTimeout(resolve, delayMs)
        );

        return this.fetchWithRetry(
          url,
          retries - 1,
          delayMs * 2
        );
      }

      return {
        fallback: true,
        message: "Fallback Response"
      };
    }
  }

  getState() {
    return this.state;
  }
}