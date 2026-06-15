import { useEffect, useState } from "react";
import { FanoutMessageBroker } from "./services/FanoutBroker";

const broker = new FanoutMessageBroker();

type Log = {
  subscriber: string;
  payload: any;
  time: string;
};

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (subscriber: string, payload: any) => {
    setLogs((prev) => [
      {
        subscriber,
        payload,
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  useEffect(() => {
    broker.subscribe("gps", (msg) => {
      addLog("🚕 Driver A", msg.payload);
    });

    broker.subscribe("gps", (msg) => {
      addLog("🚕 Driver B", msg.payload);
    });

    broker.subscribe("gps", (msg) => {
      addLog("📱 Passenger", msg.payload);
    });
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📡 Fanout Broker Dashboard</h1>

      <button
        onClick={() =>
          broker.publish("gps", {
            lat: 40.71,
            lng: -74
          })
        }
      >
        Send GPS Event
      </button>

      <h2>Logs</h2>

      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            background: "#111",
            color: "white",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
          <b>{log.subscriber}</b>
          <div>📍 lat: {log.payload.lat}</div>
          <div>📍 lng: {log.payload.lng}</div>
          <small>⏱ {log.time}</small>
        </div>
      ))}
    </div>
  );
}