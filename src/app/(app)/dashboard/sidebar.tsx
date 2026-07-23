import Link from "next/link";
import {
  Bookmark,
  Compass,
  FileText,
  Home,
  PenLine,
  Trophy,
} from "lucide-react";

import { Logo } from "@/components/site/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// `active` marks the current surface. Explore/Challenges/Saved point at their
// intended routes, which arrive with later issues.
const NAV = [
  { href: "/dashboard", label: "Home", icon: Home, active: true },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/dashboard?tab=drafts", label: "Drafts", icon: FileText },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function DashboardSidebar() {
  return (
    <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 border-r px-4 py-5 md:flex">
      <Link href="/" aria-label="WriteMyWrongs home" className="px-1">
        <Logo />
      </Link>

      <Link
        href="/write"
        className={buttonVariants({ size: "lg", className: "w-full gap-2" })}
      >
        <PenLine />
        New piece
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "justify-start gap-3",
              item.active && "bg-sidebar-accent text-foreground font-semibold",
            )}
          >
            <item.icon />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
