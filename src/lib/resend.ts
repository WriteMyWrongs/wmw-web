import "server-only";

import { Resend } from "resend";

import { requireValue, serverEnv } from "@/lib/env";

/**
 * Resend client for transactional email. Server-only.
 */
export function getResend() {
  const { RESEND_API_KEY } = serverEnv();
  return new Resend(requireValue(RESEND_API_KEY, "RESEND_API_KEY"));
}
