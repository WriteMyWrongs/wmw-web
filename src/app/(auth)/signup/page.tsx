import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignupForm } from "@/app/(auth)/signup/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { POST_AUTH_REDIRECT } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(POST_AUTH_REDIRECT);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Start writing</CardTitle>
        <CardDescription>
          Join a community of young writers sharing work and honest feedback.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <SignupForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
