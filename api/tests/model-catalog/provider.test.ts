import { describe, it, expect } from "vitest";
import * as provider from "../../src/model-catalog/provider";

describe("provider module", () => {
  it("should export expected properties", () => {
    expect(provider).toBeTypeOf("object");
  });
});
