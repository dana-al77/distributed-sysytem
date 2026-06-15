const express = require("express");
const cors = require("cors");
const CircuitBreaker = require("./circuitBreaker");

const app = express();

app.use(cors());
app.use(express.json());

const breaker = new CircuitBreaker();

let failMode = false;






async function fakeService() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failMode) {
        reject(new Error("Service Down"));
      } else {
        resolve({
          message: "Real Service Response",
          time: new Date()
        });
      }
    }, 500);
  });
}

app.get("/data", async (req, res) => {
  const result = await breaker.execute(
    fakeService,
    {
      message: "Fallback Response",
      fallback: true
    }
  );

  res.json({
    state: breaker.getState(),
    data: result
  });
});

app.post("/toggle-failure", (req, res) => {
  failMode = req.body.fail;

  res.json({
    failMode
  });
});

app.get("/status", (req, res) => {
  res.json({
    state: breaker.getState(),
    failMode
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});