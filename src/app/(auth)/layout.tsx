import Link from "next/link";

import { Logo } from "@/components/site/logo";

/**
 * Chrome-free, centered layout for the auth pages. No site navbar/footer —
 * the goal is a focused login/signup card (see docs/auth-flow.md).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" aria-label="WriteMyWrongs home">
        <Logo />
      </Link>
      <main className="w-full max-w-sm">{children}</main>
    </div>
  );
}
