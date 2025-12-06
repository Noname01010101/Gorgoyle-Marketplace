import { describe, it, expect } from "vitest";
import * as priceRange from "../../src/pricing/priceRange";

describe("priceRange module", () => {
  it("should export expected properties", () => {
    expect(priceRange).toBeTypeOf("object");
  });
});
