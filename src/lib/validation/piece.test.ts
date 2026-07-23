import { describe, expect, it } from "vitest";

import { pieceInputSchema } from "@/lib/validation/piece";

describe("pieceInputSchema", () => {
  const valid = {
    title: "My Piece",
    content: { type: "doc", content: [] },
    contentText: "some words",
    publish: false,
  };

  it("accepts a valid new piece (no id)", () => {
    expect(pieceInputSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an existing piece with a uuid id", () => {
    const withId = {
      ...valid,
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    };
    expect(pieceInputSchema.safeParse(withId).success).toBe(true);
  });

  it("trims the title and rejects an empty one", () => {
    expect(pieceInputSchema.parse({ ...valid, title: "  Hi  " }).title).toBe(
      "Hi",
    );
    expect(pieceInputSchema.safeParse({ ...valid, title: "   " }).success).toBe(
      false,
    );
  });

  it("rejects a title over 200 characters", () => {
    expect(
      pieceInputSchema.safeParse({ ...valid, title: "a".repeat(201) }).success,
    ).toBe(false);
  });

  it("rejects a non-uuid id and non-object content", () => {
    expect(pieceInputSchema.safeParse({ ...valid, id: "nope" }).success).toBe(
      false,
    );
    expect(
      pieceInputSchema.safeParse({ ...valid, content: "text" }).success,
    ).toBe(false);
  });
});
