import express from "express";
import pricingRouter from "../pricing/pricingRouter";
import catalogRouter from "../model-catalog/catalogRouter";

const serverController = express();

serverController.get("/", (req, res) => {
  res.send("working");
});

serverController.use("/pricing", pricingRouter);
serverController.use("/catalog", catalogRouter);

export default serverController;
