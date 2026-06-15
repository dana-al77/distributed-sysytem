
export type MessageStatus =
  | "pending"
  | "processing"
  | "committed"
  | "poison";

export interface KafkaRecord {
  offset: number;
  timestamp: number;
  payload: string;
  retries: number;
  status: MessageStatus;
  partition: number; 
}
export interface ProduceMessage {
  key: string;
  payload: string;
}