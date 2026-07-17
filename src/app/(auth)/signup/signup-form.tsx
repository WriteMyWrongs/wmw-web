"use client";

import { useActionState } from "react";

import { type AuthState, signUpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUpAction,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={24}
          pattern="[a-zA-Z0-9_]+"
          placeholder="inkwell_iris"
        />
        <p className="text-muted-foreground text-xs">
          3–24 characters: letters, numbers, or underscores.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">Display name (optional)</Label>
        <Input
          id="displayName"
          name="displayName"
          autoComplete="name"
          maxLength={80}
          placeholder="Iris"
        />
      </div>

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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        <p className="text-muted-foreground text-xs">At least 8 characters.</p>
      </div>

      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p role="status" className="text-brand-steel text-sm">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Start writing"}
      </Button>
    </form>
  );
}
