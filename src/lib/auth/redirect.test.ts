import { describe, expect, it } from "vitest";

import {
  isProtectedPath,
  POST_AUTH_REDIRECT,
  PROTECTED_PREFIXES,
  safeNext,
} from "@/lib/auth/redirect";

describe("safeNext", () => {
  it("allows same-origin relative paths", () => {
    expect(safeNext("/dashboard")).toBe("/dashboard");
    expect(safeNext("/settings/profile")).toBe("/settings/profile");
    expect(safeNext("/dashboard?tab=drafts")).toBe("/dashboard?tab=drafts");
  });

  it("rejects empty or missing values", () => {
    expect(safeNext(null)).toBeNull();
    expect(safeNext(undefined)).toBeNull();
    expect(safeNext("")).toBeNull();
  });

  it("rejects protocol-relative and backslash tricks (open redirect)", () => {
    expect(safeNext("//evil.com")).toBeNull();
    expect(safeNext("/\\evil.com")).toBeNull();
  });

  it("rejects absolute URLs and non-slash paths", () => {
    expect(safeNext("https://evil.com")).toBeNull();
    expect(safeNext("http://evil.com/dashboard")).toBeNull();
    expect(safeNext("javascript:alert(1)")).toBeNull();
    expect(safeNext("dashboard")).toBeNull();
  });
});

describe("isProtectedPath", () => {
  it("matches protected prefixes and their subpaths", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/dashboard/drafts")).toBe(true);
    expect(isProtectedPath("/write")).toBe(true);
    expect(isProtectedPath("/settings/profile")).toBe(true);
  });

  it("does not match public paths", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/login")).toBe(false);
    expect(isProtectedPath("/explore")).toBe(false);
  });

  it("respects the path boundary (no prefix bleed)", () => {
    expect(isProtectedPath("/dashboardxyz")).toBe(false);
    expect(isProtectedPath("/settings-old")).toBe(false);
  });
});

describe("constants", () => {
  it("post-auth redirect is a protected path", () => {
    // Landing users in a protected area keeps the auth gate meaningful.
    expect(isProtectedPath(POST_AUTH_REDIRECT)).toBe(true);
  });

  it("every protected prefix is absolute", () => {
    for (const prefix of PROTECTED_PREFIXES) {
      expect(prefix.startsWith("/")).toBe(true);
    }
  });
});
