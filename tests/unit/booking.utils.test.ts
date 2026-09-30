import { describe, expect, it } from "vitest";
import { differenceInDays } from "../../src/app/modules/booking/booking.utils";

describe("differenceInDays", () => {
  it("returns the number of calendar days between dates", () => {
    expect(differenceInDays(new Date("2024-10-01"), new Date("2024-10-05"))).toBe(4);
  });

  it("returns zero for the same calendar date", () => {
    expect(differenceInDays(new Date("2024-10-05"), new Date("2024-10-05"))).toBe(0);
  });
});