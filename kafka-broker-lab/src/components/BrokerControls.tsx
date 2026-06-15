interface Props {
  onSendMessage: () => void;
  onSendPoison: () => void;
  onConsume: () => void;
}

export default function BrokerControls({
  onSendMessage,
  onSendPoison,
  onConsume
}: Props) {
  return (
    <div>
      <button onClick={onSendMessage}>
        Send Event
      </button>

      <button onClick={onSendPoison}>
        Send Poison Config
      </button>

      <button onClick={onConsume}>
        Run Consumer Step
      </button>
    </div>
  );
}