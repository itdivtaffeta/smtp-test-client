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
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await Promise.all(
      Array.from({ length: amount }, async (_, index) => {
        try {
          const res = await axios.post("/api/", {
            host,
            port,
            username,
            password,
            to,
          });

          setMessages((messages) => [
            ...messages,
            {
              isError: false,
              message: res.data?.message,
            },
          ]);
        } catch (err) {
          setMessages((messages) => [
            ...messages,
            {
              isError: true,
              message: err?.response?.data?.message || "something went wrong",
            },
          ]);
        }
      })
    );
    setIsLoading(false);

    // for (let index = 0; index < amount; index++) {
    //   console.log("index", index);
    //   axios
    //     .post("/api/", {
    //       host,
    //       port,
    //       username,
    //       password,
    //       to,
    //     })
    //     .then((res) => {
    //       setMessages((messages) => [
    //         ...messages,
    //         {
    //           isError: false,
    //           message: res.data?.message,
    //         },
    //       ]);
    //     })
    //     .catch((err) => {
    //       setMessages((messages) => [
    //         ...messages,
    //         { isError: true, message: err.response.data?.message },
    //       ]);
    //     });
    // }
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
          {/* create radio for amount, 1, 5, 50, and custom */}
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
              </div>
            </div>
          </div>
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
        </div>
      </form>

      {/* create log information */}
      <div className="flex flex-col space-y-4 mt-10 max-h-3">
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
