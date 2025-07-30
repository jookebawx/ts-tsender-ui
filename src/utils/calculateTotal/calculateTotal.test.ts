// calculateTotal.test.ts
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("sums simple numbers", () => {
    const input = "100\n200\n300";
    expect(calculateTotal(input)).toBe(600);
  });

  it("ignores empty lines and trims whitespace", () => {
    const input = " 100 \n\n 200\n \n300 ";
    expect(calculateTotal(input)).toBe(600);
  });

  it("ignores invalid lines", () => {
    const input = "100\nabc\n200.5\nxyz\n";
    expect(calculateTotal(input)).toBeCloseTo(300.5);
  });

  it("handles float numbers properly", () => {
    const input = "1.5\n2.5\n3.5";
    expect(calculateTotal(input)).toBeCloseTo(7.5);
  });

  it("returns 0 for completely invalid input", () => {
    const input = "abc\n \nxyz";
    expect(calculateTotal(input)).toBe(0);
  });

  it("returns 0 for empty string", () => {
    expect(calculateTotal("")).toBe(0);
  });
});
