import Link from "next/link";

import { Logo } from "@/components/site/logo";

export function Footer() {
  return (
    <footer className="border-border/60 bg-muted/40 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo />
        <p className="text-muted-foreground text-sm">
          A place for young writers to share, get feedback, and grow.
        </p>
        <div className="text-muted-foreground flex gap-4 text-sm">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link
            href="https://github.com/WriteMyWrongs/wmw-web"
            className="hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
