import { describe, it, expect } from "vitest";
import * as fields from "../../src/model-catalog/fields";

describe("fields module", () => {
  it("should export expected properties", () => {
    expect(fields).toBeTypeOf("object");
  });
});
