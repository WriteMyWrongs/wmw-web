"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env";
import { POST_AUTH_REDIRECT, safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  magicLinkSchema,
  signupSchema,
} from "@/lib/validation/auth";

export type AuthState = {
  error?: string;
  message?: string;
};

/** First validation message from a flattened ZodError, or a fallback. */
function firstIssue(
  flat: Record<string, string[] | undefined>,
  fallback: string,
): string {
  for (const messages of Object.values(flat)) {
    if (messages && messages.length > 0) return messages[0];
  }
  return fallback;
}

/**
 * Map Supabase auth errors to friendly copy. Login failures are deliberately
 * generic so we never reveal whether an email is registered.
 */
function friendlyError(error: AuthError): string {
  const message = error.message.toLowerCase();
  if (
    message.includes("already registered") ||
    error.code === "user_already_exists"
  ) {
    return "That email is already registered. Try logging in.";
  }
  if (message.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (message.includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }
  return "Something went wrong. Please try again.";
}

function callbackUrl(next: string): string {
  const url = new URL("/auth/callback", publicEnv.NEXT_PUBLIC_SITE_URL);
  if (next !== POST_AUTH_REDIRECT) url.searchParams.set("next", next);
  return url.toString();
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) {
    return {
      error: firstIssue(
        parsed.error.flatten().fieldErrors,
        "Check your details.",
      ),
    };
  }

  const { email, password, username, displayName } = parsed.data;
  const supabase = await createClient();

  // Fast-path a friendly message for a taken username. The unique index on
  // lower(username) is the real guarantee if two signups race.
  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (taken) return { error: "That username is taken." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl(POST_AUTH_REDIRECT),
      data: {
        username,
        display_name: displayName ? displayName : null,
      },
    },
  });

  if (error) return { error: friendlyError(error) };

  // Confirmations off (local) → session is live, go straight in.
  // Confirmations on (prod) → no session until the email link is clicked.
  if (!data.session) {
    return {
      message: "Almost there — check your email to confirm your account.",
    };
  }

  redirect(POST_AUTH_REDIRECT);
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Incorrect email or password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: friendlyError(error) };

  redirect(safeNext(formData.get("next")?.toString()) ?? POST_AUTH_REDIRECT);
}

export async function signInWithOtpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = magicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      error: firstIssue(
        parsed.error.flatten().fieldErrors,
        "Enter a valid email.",
      ),
    };
  }

  const next = safeNext(formData.get("next")?.toString()) ?? POST_AUTH_REDIRECT;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: callbackUrl(next) },
  });
  if (error) return { error: friendlyError(error) };

  return { message: "Check your email for a login link." };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
