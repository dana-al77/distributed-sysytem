export class FanoutMessageBroker {
  private subscribers: Map<string, ((msg: any) => void)[]> = new Map();

  subscribe(topic: string, handler: (msg: any) => void) {
    const list = this.subscribers.get(topic) || [];
    list.push(handler);
    this.subscribers.set(topic, list);
  }

  publish(topic: string, payload: any) {
    const list = this.subscribers.get(topic) || [];

    list.forEach((handler) => {
      setTimeout(() => {
        handler({
          topic,
          payload,
          timestamp: Date.now()
        });
      }, 0);
    });
  }
}