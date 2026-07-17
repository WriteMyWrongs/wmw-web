import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/(auth)/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { POST_AUTH_REDIRECT, safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(POST_AUTH_REDIRECT);

  const { next } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Log in to keep writing and trading feedback.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LoginForm next={safeNext(next) ?? undefined} />
        <p className="text-muted-foreground text-center text-sm">
          New here?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
