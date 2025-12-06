import express from "express";
import pricingRouter from "../pricing/pricingRouter";
import catalogRouter from "../model-catalog/catalogRouter";
import benchmarksRouter from "../benchmarks/benchmarksRouter";
import capabilityMatchingRouter from "../capability-matching/capabilityMatchingRouter";
import suggestionsRouter from "../suggestions/suggestionsRouter";

const serverController = express();

serverController.get("/", (req, res) => {
  res.send("working");
});

serverController.use("/pricing", pricingRouter);
serverController.use("/catalog", catalogRouter);
serverController.use("/benchmarks", benchmarksRouter);
serverController.use("/match", capabilityMatchingRouter);
serverController.use("/suggestions", suggestionsRouter);

export default serverController;
