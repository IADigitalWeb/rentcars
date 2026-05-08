import { describe, it, expect } from "vitest";
import {
  cn,
  formatPrice,
  formatDate,
  generatePaymentRef,
  RESERVATION_STATUS_COLORS,
  CATEGORY_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
} from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active");
  });

  it("merges tailwind conflict (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("formatPrice", () => {
  it("formats a number as EUR currency", () => {
    const result = formatPrice(350);
    expect(result).toContain("350");
    expect(result).toMatch(/€/);
  });

  it("formats a string number", () => {
    const result = formatPrice("120");
    expect(result).toContain("120");
  });

  it("formats 0 correctly", () => {
    const result = formatPrice(0);
    expect(result).toMatch(/0/);
  });
});

describe("formatDate", () => {
  it("formats a Date object in French", () => {
    const result = formatDate(new Date("2024-06-15"));
    expect(result).toContain("juin");
    expect(result).toContain("2024");
  });

  it("formats an ISO string", () => {
    const result = formatDate("2024-01-20");
    expect(result).toContain("janvier");
    expect(result).toContain("2024");
  });
});

describe("generatePaymentRef", () => {
  it("starts with SIM-", () => {
    const ref = generatePaymentRef();
    expect(ref).toMatch(/^SIM-/);
  });

  it("has 14 characters total (SIM- + 10)", () => {
    const ref = generatePaymentRef();
    expect(ref).toHaveLength(14);
  });

  it("generates unique refs", () => {
    const refs = new Set(Array.from({ length: 100 }, () => generatePaymentRef()));
    expect(refs.size).toBe(100);
  });
});

describe("status color constants", () => {
  it("has all 5 reservation statuses", () => {
    expect(Object.keys(RESERVATION_STATUS_COLORS)).toEqual(
      expect.arrayContaining(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    );
  });

  it("has all 6 category labels", () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(6);
    expect(CATEGORY_LABELS.ELECTRIC).toBe("Électrique");
  });

  it("has all 4 fuel labels", () => {
    expect(Object.keys(FUEL_LABELS)).toHaveLength(4);
    expect(FUEL_LABELS.PETROL).toBe("Essence");
  });

  it("has all 2 transmission labels", () => {
    expect(Object.keys(TRANSMISSION_LABELS)).toHaveLength(2);
    expect(TRANSMISSION_LABELS.AUTOMATIC).toBe("Automatique");
  });
});
