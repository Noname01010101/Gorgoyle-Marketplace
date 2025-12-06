import express from "express";
import CapabilityMatchingService, {
  CapabilityMatchRequest,
} from "./capabilityMatchingService";

const capabilityMatchingRouter = express.Router();

capabilityMatchingRouter.get("/", async (req, res) => {
  const body = req.body as Partial<CapabilityMatchRequest> | undefined;

  try {
    const results = await CapabilityMatchingService.matchModelsForTask({
      taskDescription: body?.taskDescription ?? "",
      constraints: body?.constraints,
      preferences: body?.preferences,
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to match models for task" });
  }
});

export default capabilityMatchingRouter;
