"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  type AuthState,
  signInAction,
  signInWithOtpAction,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next?: string }) {
  const [pwState, pwAction, pwPending] = useActionState<AuthState, FormData>(
    signInAction,
    {},
  );
  const [otpState, otpAction, otpPending] = useActionState<AuthState, FormData>(
    signInWithOtpAction,
    {},
  );

  const error = pwState.error ?? otpState.error;
  const message = otpState.message;

  return (
    <form action={pwAction} className="flex flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="text-brand-steel text-sm">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={pwPending} className="w-full">
        {pwPending ? "Logging in…" : "Log in"}
      </Button>

      {/* Passwordless alternative. `formNoValidate` lets this submit without
          the required password field; the OTP action ignores password. */}
      <Button
        type="submit"
        variant="ghost"
        formAction={otpAction}
        formNoValidate
        disabled={otpPending}
        className="w-full"
      >
        {otpPending ? "Sending…" : "Email me a login link instead"}
      </Button>
    </form>
  );
}
