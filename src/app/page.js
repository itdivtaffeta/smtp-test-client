"use client";
import { useState } from "react";
import axios from "axios";
// import nodemailer from "nodemailer";

export default function Home() {
  const [amount, setAmount] = useState(1);
  const [host, setHost] = useState("");
  const [port, setPort] = useState(587);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [to, setTo] = useState("");
  const [choice, setChoice] = useState("promise.all");
  const [chunkSize, setChunkSize] = useState(1000);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusCount, setStatusCount] = useState({
    success: 0,
    error: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (choice === "promise.all") {
      // chat gpt
      let count = 1;
      async function makeRequests(totalRequests) {
        // const chunkSize = 1000;
        const totalChunks = Math.ceil(totalRequests / chunkSize);
        console.log(`Total chunks: ${totalChunks}`);

        // Recursive function to make requests in chunks
        async function makeRequestsInChunks(chunkIndex) {
          const start = chunkIndex * chunkSize + 1;
          const end = Math.min(start + chunkSize - 1, totalRequests);

          console.log(`Making requests from ${start} to ${end}`);

          await Promise.all(
            Array.from({ length: end - start + 1 }, async (_, index) => {
              // Replace this with your actual request code
              try {
                const today = new Date();
                const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

                const res = await axios.post("/api/", {
                  host,
                  port,
                  username,
                  password,
                  to,
                  // subject: `SMTP Test Client - ${chunkIndex + 1} - ${
                  //   index + 1
                  // } - ${time}`,
                  subject: `SMTP Test Client - ${count++} - ${time}`,
                });

                setMessages((messages) => [
                  ...messages,
                  {
                    isError: false,
                    message: res?.data?.message,
                  },
                ]);
                setStatusCount((statusCount) => ({
                  ...statusCount,
                  success: statusCount.success + 1,
                }));
              } catch (err) {
                setMessages((messages) => [
                  ...messages,
                  {
                    isError: true,
                    message:
                      err?.response?.data?.message || "something went wrong",
                  },
                ]);
                console.log(err);
                setStatusCount((statusCount) => ({
                  ...statusCount,
                  error: statusCount.error + 1,
                }));
              }
            })
          );

          // Proceed to the next chunk if available
          if (chunkIndex < totalChunks - 1) {
            // setTimeout(() => {
            //   makeRequestsInChunks(chunkIndex + 1);
            // }, chunkSize * 1000);
            makeRequestsInChunks(chunkIndex + 1);
          }
        }

        await makeRequestsInChunks(0);
      }

      // Usage: Run 1000 requests in chunks of 100
      await makeRequests(amount);
      setIsLoading(false);

      // return;
      // await Promise.all(
      //   Array.from({ length: amount }, async (_, index) => {
      //     try {
      //       const today = new Date();
      //       const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

      //       const res = await axios.post("/api/", {
      //         host,
      //         port,
      //         username,
      //         password,
      //         to,
      //         subject: `SMTP Test Client ${index + 1} - ${time}`,
      //       });

      //       setMessages((messages) => [
      //         ...messages,
      //         {
      //           isError: false,
      //           message: res.data?.message,
      //         },
      //       ]);
      //     } catch (err) {
      //       setMessages((messages) => [
      //         ...messages,
      //         {
      //           isError: true,
      //           message: err?.response?.data?.message || "something went wrong",
      //         },
      //       ]);
      //     }
      //   })
      // );
    }

    if (choice === "for.loop") {
      for (let index = 0; index < amount; index++) {
        try {
          const today = new Date();
          const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

          const res = await axios.post("/api/", {
            host,
            port,
            username,
            password,
            to,
            subject: `SMTP Test Client ${index + 1} - ${time}`,
          });

          setMessages((messages) => [
            ...messages,
            {
              isError: false,
              message: res.data?.message,
            },
          ]);

          setStatusCount((statusCount) => ({
            ...statusCount,
            success: statusCount.success + 1,
          }));
        } catch (err) {
          setMessages((messages) => [
            ...messages,
            {
              isError: true,
              message: err?.response?.data?.message || "something went wrong",
            },
          ]);

          setStatusCount((statusCount) => ({
            ...statusCount,
            error: statusCount.error + 1,
          }));
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col p-24 bg-gray-100 items-center">
      <h3 className="text-3xl font-bold mb-5">SMTP Test Client</h3>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="host">Host</label>
              <input
                id="host"
                type="text"
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) => setHost(e.target.value)}
                value={host}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="port">Port</label>
              <input
                id="port"
                type="text"
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) => setPort(e.target.value)}
                value={port}
                required
              />
            </div>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="host">To</label>
            <input
              id="to"
              type="text"
              className="border border-gray-300 rounded-md p-2"
              onChange={(e) => setTo(e.target.value)}
              value={to}
              required
            />
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="amount">Amount</label>
              <div className="flex flex-row space-x-2">
                <button
                  className={
                    amount === 1
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-12"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-12"
                  }
                  onClick={() => setAmount(1)}
                  type="button"
                >
                  1
                </button>
                <button
                  className={
                    amount === 5
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-12"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-12"
                  }
                  type="button"
                  onClick={() => setAmount(5)}
                >
                  5
                </button>
                <button
                  className={
                    amount === 10
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-12"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-12"
                  }
                  type="button"
                  onClick={() => setAmount(10)}
                >
                  10
                </button>
                <button
                  className={
                    amount === 50
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-12"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-12"
                  }
                  type="button"
                  onClick={() => setAmount(50)}
                >
                  50
                </button>
                <button
                  className={
                    amount === 100
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-12"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-12"
                  }
                  type="button"
                  onClick={() => setAmount(100)}
                >
                  100
                </button>
                <button
                  className={
                    amount === 1000
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-15"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-15"
                  }
                  type="button"
                  onClick={() => setAmount(1000)}
                >
                  1000
                </button>
                <button
                  className={
                    amount === 5000
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-15"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-15"
                  }
                  type="button"
                  onClick={() => setAmount(5000)}
                >
                  5000
                </button>
                <button
                  className={
                    amount === 10000
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 w-15"
                      : "border border-transparent bg-blue-100 rounded-md p-2 w-15"
                  }
                  type="button"
                  onClick={() => setAmount(10000)}
                >
                  10000
                </button>
              </div>
              <input
                type="number"
                value={amount}
                id="amount"
                onChange={(e) => {
                  if (isNaN(e.target.value)) {
                    setAmount(1);
                  } else {
                    setAmount(parseInt(e.target.value));
                  }
                }}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          {/* create radio for choice using promise.all or for loop */}
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="choice">Choice</label>
              <div className="flex flex-row space-x-2">
                <button
                  className={
                    choice === "promise.all"
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 "
                      : "border border-transparent bg-blue-100 rounded-md p-2 "
                  }
                  onClick={() => setChoice("promise.all")}
                  type="button"
                >
                  Concurrent
                </button>

                <button
                  className={
                    choice === "for.loop"
                      ? "border border-transparent bg-blue-500 text-white rounded-md p-2 "
                      : "border border-transparent bg-blue-100 rounded-md p-2 "
                  }
                  onClick={() => setChoice("for.loop")}
                  type="button"
                >
                  Sequential
                </button>
              </div>
            </div>
          </div>
          {/* create input to input chunk size */}
          {choice === "promise.all" && (
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="chunkSize">Chunk Size</label>
                <input
                  type="number"
                  value={chunkSize}
                  id="chunkSize"
                  onChange={(e) => {
                    if (isNaN(e.target.value)) {
                      setChunkSize(1);
                    } else {
                      setChunkSize(parseInt(e.target.value));
                    }
                  }}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          )}
          <button
            className={
              isLoading
                ? "border border-transparent bg-gray-500 text-white rounded-md p-2 w-full "
                : "border border-transparent bg-blue-500 rounded-md p-2 w-full text-white "
            }
            disabled={isLoading}
          >
            Send
          </button>
          <button
            className="border border-transparent bg-gray-500 rounded-md p-2 text-white w-full"
            onClick={() => {
              setStatusCount({ success: 0, error: 0 });
              setMessages([]);
            }}
            type="button"
          >
            Clear
          </button>
        </div>
      </form>

      {/* show success and error count */}
      <div className="flex flex-row space-x-4 mt-10">
        <div className="flex flex-col space-y-2">
          <label htmlFor="success">Success</label>
          <input
            type="number"
            value={statusCount.success}
            id="success"
            className="border border-gray-300 rounded-md p-2"
            readOnly
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="error">Error</label>
          <input
            type="number"
            value={statusCount.error}
            id="error"
            className="border border-gray-300 rounded-md p-2"
            readOnly
          />
        </div>
      </div>

      {/* add max height and scrollable */}
      <div className="flex flex-col space-y-4 mt-10 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.isError
                ? "border border-red-500 bg-red-100 rounded-md p-2"
                : "border border-green-500 bg-green-100 rounded-md p-2"
            }
          >
            {message.message}
          </div>
        ))}
      </div>
    </main>
  );
}
