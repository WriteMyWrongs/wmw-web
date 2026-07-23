import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL doesn't auto-clean without globals enabled; unmount between tests.
afterEach(() => {
  cleanup();
});
