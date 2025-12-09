"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { trpc } from "@/lib/trpc";

export default function ApiCheckPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [apiTests, setApiTests] = useState<any[]>([]);

  useEffect(() => {
    checkApi();
  }, []);

  async function checkApi() {
    setStatus("loading");
    setMessage("");
    setApiTests([]);
    
    const tests = [];

    // Test catalog endpoint
    try {
      const models = await trpc.catalog.getModels.query({});
      tests.push({
        name: "Catalog API",
        status: "success",
        message: `Connected! Found ${models.length} models`,
      });
    } catch (e) {
      tests.push({
        name: "Catalog API",
        status: "error",
        message: "Failed to connect",
      });
    }

    // Test providers endpoint
    try {
      const providers = await trpc.catalog.getProviders.query({});
      tests.push({
        name: "Providers API",
        status: "success",
        message: `Found ${providers.length} providers`,
      });
    } catch (e) {
      tests.push({
        name: "Providers API",
        status: "error",
        message: "Failed to connect",
      });
    }

    setApiTests(tests);
    
    const allSuccess = tests.every(t => t.status === "success");
    if (allSuccess) {
      setStatus("success");
      setMessage("All API endpoints are working correctly!");
    } else {
      setStatus("error");
      setMessage("Some API endpoints failed to connect. Make sure the backend is running.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              API Status Check
            </h1>
            <p className="text-xl text-text-secondary">
              Test connectivity to backend services
            </p>
          </div>

          <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Connection Status</h2>
              <button
                onClick={checkApi}
                disabled={status === "loading"}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Testing..." : "Retest Connection"}
              </button>
            </div>

            {status === "loading" && (
              <div className="text-center py-8">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="text-text-secondary mt-4">Testing API endpoints...</p>
              </div>
            )}

            {status !== "loading" && status !== "idle" && (
              <div
                className={`p-4 rounded-lg border ${
                  status === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {status === "success" ? "✓" : "✗"}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {status === "success" ? "Connected" : "Connection Failed"}
                    </div>
                    <div className="text-sm opacity-90">{message}</div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {apiTests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Endpoint Tests</h3>
              {apiTests.map((test, index) => (
                <Card key={index}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg">{test.name}</h4>
                      <p className="text-sm text-text-secondary mt-1">{test.message}</p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        test.status === "success"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {test.status === "success" ? "OK" : "Failed"}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Connection Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Backend URL:</span>
                <span className="text-text-primary font-mono">http://localhost:3000/trpc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Protocol:</span>
                <span className="text-text-primary">tRPC over HTTP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Status:</span>
                <span className={`font-medium ${
                  status === "success" ? "text-green-400" : 
                  status === "error" ? "text-red-400" : "text-text-secondary"
                }`}>
                  {status === "loading" ? "Testing..." : 
                   status === "success" ? "Connected" :
                   status === "error" ? "Disconnected" : "Not tested"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="mt-8 bg-card-bg-hover">
            <h3 className="text-lg font-semibold mb-2">Troubleshooting</h3>
            <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
              <li>Make sure the backend API is running on port 3000</li>
              <li>Check that Docker containers are up if using docker-compose</li>
              <li>Verify CORS settings allow requests from the frontend</li>
              <li>Check browser console for detailed error messages</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
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
