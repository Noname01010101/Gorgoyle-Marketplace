import server from "../src/server";
import { aiModels, fields, providers } from "../dbDevData";
import { describe, it, expect, beforeAll } from "vitest";

const URL = "http://localhost:3000";

describe("server health and routes test", () => {
  beforeAll(async () => {
    server.listen(3000);
  });

  it("fetch all fields", async () => {
    const res = await fetch(`${URL}/fields`);
    const json = await res.json();
    const sampleElement = json[0];
    const fieldsExpected = fields.find((item) => item.id === sampleElement.id);
    expect(sampleElement).toStrictEqual(fieldsExpected);
  });

  it("fetch specific fields", async () => {
    const res = await fetch(`${URL}/fields?name=${fields[0].name}`);
    const json = await res.json();
    expect(json).toStrictEqual(fields[0]);
  });

  it("fetch all models", async () => {
    const res = await fetch(`${URL}/models`);
    const json = await res.json();
    const sampleElement = json[0];
    const modelsExpected = aiModels.find(
      (item) => item.id === sampleElement.id
    );
    // releaseDate is a Date in the seed data, the response will be an ISO string
    const expectedConverted = {
      ...modelsExpected,
      releaseDate: modelsExpected?.releaseDate.toISOString(),
    };
    expect(sampleElement.name).toStrictEqual(expectedConverted.name);
  });

  it("fetch specific models", async () => {
    const res = await fetch(`${URL}/models?name=${aiModels[0].name}`);
    const json = await res.json();
    const expectedConverted = {
      ...aiModels[0],
      releaseDate: aiModels[0].releaseDate.toISOString(),
    };
    expect(json[0].name).toStrictEqual(expectedConverted.name);
  });

  it("fetch all providers", async () => {
    const res = await fetch(`${URL}/providers`);
    const json = await res.json();
    const sampleElement = json[0];
    const providersExpected = providers.find(
      (item) => item.id === sampleElement.id
    );
    expect(sampleElement).toStrictEqual(providersExpected);
  });

  it("fetch specific providers", async () => {
    const res = await fetch(`${URL}/providers?name=${providers[0].name}`);
    const json = await res.json();
    expect(json).toStrictEqual(providers[0]);
  });
});
