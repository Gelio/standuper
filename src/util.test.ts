import { describe, expect, expectTypeOf, it } from "vitest";
import { valueMatches } from "./util";

describe(valueMatches.name, () => {
  it("returns the value when the predicate is true", () => {
    const value = "hello" as string | number;

    const result = valueMatches(
      value,
      (v): v is string => typeof v === "string",
    );

    expect(result).toBe(value);
    expectTypeOf(result).toEqualTypeOf<string | undefined>();
  });

  it("returns undefined when the predicate is false", () => {
    const value = 5 as string | number;

    const result = valueMatches(
      value,
      (v): v is string => typeof v === "string",
    );

    expect(result).toBeUndefined();
    expectTypeOf(result).toEqualTypeOf<string | undefined>();
  });
});
