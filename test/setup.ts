import { installGlobals } from "@remix-run/node";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

installGlobals();
