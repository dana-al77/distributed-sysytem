import { useState } from "react";
import ResilientFetcher from "./ResilientFetcher";

const fetcher = new ResilientFetcher();

function App() {

  const [state, setState] =
    useState("CLOSED");

  const [response, setResponse] =
    useState("");

  const sendRequest = async () => {

    try {
/////////////////   هون ال API من مشروع التاسك Fault-Tolerant Circuit Breaker State Machine 
//////   هاد اسمو المشروع circuit-breaker-backend   
const result =
        await fetcher.fetchWithRetry(
          "http://localhost:3000/data"
        );

      setResponse(
        JSON.stringify(result, null, 2)
      );

      setState(fetcher.getState());

    } catch (err) {

      setResponse(err.message);

      setState(fetcher.getState());
    }
  };

  return (
    <div
      style={{
        padding: 40,
        textAlign: "center"
      }}
    >

      <h1>
        Fault-Tolerant Client Interceptor
      </h1>

      <h2>
        State : {state}
      </h2>

      <button
        onClick={sendRequest}
      >
        Send Request
      </button>

      <pre
        style={{
          marginTop: 20,
          textAlign: "left"
        }}
      >
        {response}
      </pre>

    </div>
  );
}

export default App;