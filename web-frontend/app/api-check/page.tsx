"use client";
import { useState } from "react";

export default function ApiCheckPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function checkApi() {
    setStatus("loading");
    setMessage("");
    try {
      // Example: ping the backend API root or health endpoint
      const res = await fetch("http://localhost:3001/health");
      if (res.ok) {
        setStatus("success");
        setMessage("API is reachable!");
      } else {
        setStatus("error");
        setMessage("API responded with error.");
      }
    } catch (e) {
      setStatus("error");
      setMessage("Could not connect to API.");
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Connectivity Check</h2>
      <button
        onClick={checkApi}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition mb-4"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Checking..." : "Check API"}
      </button>
      {status !== "idle" && (
        <div
          className={`mt-2 p-2 rounded ${
            status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
