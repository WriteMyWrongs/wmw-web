import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/challenges", label: "Challenges" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="WriteMyWrongs home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Start writing
          </Link>
        </div>
      </div>
    </header>
  );
}
