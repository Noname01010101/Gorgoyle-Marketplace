import express from "express";
import FieldsQuery from "./queries/fieldsQuery";
import ModelQuery from "./queries/modelQuery";
import ProviderQuery from "./queries/providerQuery";

const server = express();

server.get("/fields", async (req, res) => {
  if (req.query["name"]) {
    res.json(await FieldsQuery.getFieldByName(String(req.query["name"])));
    return;
  }

  res.json(await FieldsQuery.getAllFields());
});

server.get("/models", async (req, res) => {
  if (req.query["name"]) {
    res.json(await ModelQuery.getModelsByName(String(req.query["name"])));
    return;
  }

  res.json(await ModelQuery.getAllModels());
});

server.get("/providers", async (req, res) => {
  if (req.query["name"]) {
    res.json(await ProviderQuery.getProviderByName(String(req.query["name"])));
    return;
  }

  res.json(await ProviderQuery.getAllProviders());
});

server.get("/", (req, res) => {
  res.send("working!");
});

export default server;
