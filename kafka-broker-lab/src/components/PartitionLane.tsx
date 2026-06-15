import type { KafkaRecord } from "../types/KafkaTypes";
interface Props {
  title: string;
  records: KafkaRecord[];
}

export default function PartitionLane({
  title,
  records
}: Props) {
  return (
    <div className="lane">
      <h3>{title}</h3>

      {records.map(record => (
        <div
          key={record.offset}
          className="message"
        >
          <div>Offset: {record.offset}</div>
          <div>{record.payload}</div>
          <div>Retries: {record.retries}</div>
          <div>Status: {record.status}</div>
        </div>
      ))}
    </div>
  );
}