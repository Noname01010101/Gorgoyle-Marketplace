import express from "express";
import BenchmarksService from "./benchmarksService";

const benchmarksRouter = express.Router();

// GET /benchmarks/models/:modelId
benchmarksRouter.get("/models/:modelId", async (req, res) => {
  const modelId = Number(req.params.modelId);

  if (Number.isNaN(modelId)) {
    res.status(400).json({ error: "modelId must be a number" });
    return;
  }

  try {
    const benchmarks = await BenchmarksService.getBenchmarksForModel(modelId);
    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch benchmarks" });
  }
});

// GET /benchmarks/models/:modelId/summary
benchmarksRouter.get("/models/:modelId/summary", async (req, res) => {
  const modelId = Number(req.params.modelId);

  if (Number.isNaN(modelId)) {
    res.status(400).json({ error: "modelId must be a number" });
    return;
  }

  try {
    const summary = await BenchmarksService.getBenchmarkSummaryForModel(modelId);
    if (!summary) {
      res.status(404).json({ error: "No benchmark data found for model" });
      return;
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch benchmark summary" });
  }
});

export default benchmarksRouter;
