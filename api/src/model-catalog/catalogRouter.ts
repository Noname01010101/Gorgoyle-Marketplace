import express from "express";
import FieldsQuery from "./fields";
import ModelQuery from "./model";
import ProviderQuery from "./provider";

const catalogRouter = express.Router();

catalogRouter.get("/fields", async (req, res) => {
  if (req.query["name"]) {
    res.json(await FieldsQuery.getFieldByName(String(req.query["name"])));
    return;
  }

  res.json(await FieldsQuery.getAllFields());
});

catalogRouter.get("/models", async (req, res) => {
  if (req.query["name"]) {
    res.json(await ModelQuery.getModelsByName(String(req.query["name"])));
    return;
  }

  res.json(await ModelQuery.getAllModels());
});

catalogRouter.get("/providers", async (req, res) => {
  if (req.query["name"]) {
    res.json(await ProviderQuery.getProviderByName(String(req.query["name"])));
    return;
  }

  res.json(await ProviderQuery.getAllProviders());
});

export default catalogRouter;
