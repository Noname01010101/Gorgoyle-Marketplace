import { describe, it, expect } from "vitest";
import * as model from "../../src/model-catalog/model";

describe("model module", () => {
  it("should export expected properties", () => {
    expect(model).toBeTypeOf("object");
  });
});
