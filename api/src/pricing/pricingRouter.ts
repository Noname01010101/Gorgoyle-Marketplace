import express from "express";
import PriceRangeFilter from "./priceRange";

const pricingRouter = express.Router();

pricingRouter.get("/priceRange/input", async (req, res) => {
  const min = Number(req.query.minInput) || 0;
  const max = Number(req.query.maxOutput) || 10;
  const models = await PriceRangeFilter.filterByRangeInput(min, max);
  res.json(models);
});

export default pricingRouter;
