import express from "express";
import SuggestionsService from "./suggestionsService";

const suggestionsRouter = express.Router();

// GET /suggestions/:modelId
suggestionsRouter.get("/:modelId", async (req, res) => {
  const modelId = Number(req.params.modelId);

  if (Number.isNaN(modelId)) {
    res.status(400).json({ error: "modelId must be a number" });
    return;
  }

  try {
    const suggestions = await SuggestionsService.getSuggestionsForModel(modelId);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suggestions for model" });
  }
});

export default suggestionsRouter;
