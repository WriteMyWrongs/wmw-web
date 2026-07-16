"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

import { publicEnv } from "@/lib/env";

/**
 * Initialises PostHog on the client when a project key is configured.
 * When no key is present (e.g. local dev without analytics) it renders
 * children untouched so the app still works.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!publicEnv.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(publicEnv.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: publicEnv.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: "history_change",
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  if (!publicEnv.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
