import type { Metadata } from "next";

import { SiteShell } from "@/components/site/site-shell";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Minimal protected page — proves the auth gate and gives login somewhere to
// land. The real dashboard is issue #25.
export default async function DashboardPage() {
  const user = await requireUser();
  const username =
    (user.user_metadata?.username as string | undefined) ?? user.email;

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
        <p className="hand text-brand-steel text-2xl">welcome back</p>
        <h1 className="font-display text-brand-navy dark:text-foreground mt-1 text-4xl font-black tracking-tight">
          Hi, {username}
        </h1>
        <p className="text-muted-foreground mt-4">
          You&apos;re signed in. Your dashboard is coming soon.
        </p>
      </section>
    </SiteShell>
  );
}
