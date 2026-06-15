import type { KafkaRecord } from "../types/KafkaTypes";

interface Props {
  messages: KafkaRecord[];
  onRequeue: (offset: number) => void;
}

export default function DLQPanel({
  messages,
  onRequeue
}: Props) {
  return (
    <div className="dlq">
      <h2>Dead Letter Queue</h2>

      {messages.map(msg => (
        <div key={msg.offset}>
          <div>
            Offset #{msg.offset}
          </div>

          <div>{msg.payload}</div>

          <button
            onClick={() =>
              onRequeue(msg.offset)
            }
          >
            Requeue
          </button>
        </div>
      ))}
    </div>
  );
}