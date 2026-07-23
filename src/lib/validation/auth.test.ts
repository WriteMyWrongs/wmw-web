import { describe, expect, it } from "vitest";

import {
  emailSchema,
  loginSchema,
  magicLinkSchema,
  passwordSchema,
  signupSchema,
  usernameSchema,
} from "@/lib/validation/auth";

describe("usernameSchema", () => {
  it("accepts valid handles and lowercases them", () => {
    expect(usernameSchema.parse("inkwell_iris")).toBe("inkwell_iris");
    expect(usernameSchema.parse("Iris_W")).toBe("iris_w");
    expect(usernameSchema.parse("  remy99  ")).toBe("remy99");
  });

  it("rejects out-of-range lengths and bad characters", () => {
    expect(usernameSchema.safeParse("ab").success).toBe(false); // too short
    expect(usernameSchema.safeParse("a".repeat(25)).success).toBe(false); // too long
    expect(usernameSchema.safeParse("bad-dash").success).toBe(false);
    expect(usernameSchema.safeParse("has space").success).toBe(false);
    expect(usernameSchema.safeParse("emoji✨name").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("requires at least 8 characters", () => {
    expect(passwordSchema.safeParse("short").success).toBe(false);
    expect(passwordSchema.safeParse("longenough").success).toBe(true);
  });

  it("rejects passwords over 72 characters", () => {
    expect(passwordSchema.safeParse("a".repeat(73)).success).toBe(false);
  });
});

describe("emailSchema", () => {
  it("accepts and trims valid emails", () => {
    expect(emailSchema.parse("  writer@example.com ")).toBe(
      "writer@example.com",
    );
  });

  it("rejects malformed emails", () => {
    expect(emailSchema.safeParse("notanemail").success).toBe(false);
    expect(emailSchema.safeParse("").success).toBe(false);
  });
});

describe("signupSchema", () => {
  const valid = {
    email: "iris@example.com",
    password: "supersecret",
    username: "inkwell_iris",
    displayName: "Iris",
  };

  it("accepts a complete valid signup", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("treats displayName as optional", () => {
    expect(signupSchema.safeParse({ ...valid, displayName: "" }).success).toBe(
      true,
    );
    const withoutName = {
      email: valid.email,
      password: valid.password,
      username: valid.username,
    };
    expect(signupSchema.safeParse(withoutName).success).toBe(true);
  });

  it("fails when a required field is invalid", () => {
    expect(signupSchema.safeParse({ ...valid, username: "no" }).success).toBe(
      false,
    );
    expect(
      signupSchema.safeParse({ ...valid, password: "short" }).success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires an email and a non-empty password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.co", password: "x" }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({ email: "a@b.co", password: "" }).success,
    ).toBe(false);
  });
});

describe("magicLinkSchema", () => {
  it("validates just the email", () => {
    expect(magicLinkSchema.safeParse({ email: "a@b.co" }).success).toBe(true);
    expect(magicLinkSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});
