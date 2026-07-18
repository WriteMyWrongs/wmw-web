"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { signOutAction } from "@/app/(auth)/actions";
import { Logo } from "@/components/site/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/challenges", label: "Challenges" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function displayName(user: User) {
  return (
    (user.user_metadata?.username as string | undefined) ??
    user.email ??
    "Account"
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  // Reflect auth state client-side. onAuthStateChange fires INITIAL_SESSION
  // on subscribe, so the current session (read from cookies) populates on
  // mount; re-subscribing per navigation keeps it in sync after a
  // login/logout redirect. Display-only, so a cookie read is fine here.
  useEffect(() => {
    let supabase;
    try {
      supabase = createClient();
    } catch {
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [pathname]);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      {/* One sign-out form, referenced by id from the menu buttons below so it
          works from inside the portaled dropdowns. */}
      <form id="navbar-signout" action={signOutAction} className="hidden" />

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="WriteMyWrongs home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                isActive(pathname, link.href) &&
                  "bg-muted text-foreground font-semibold",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="sm" />}
              >
                <UserIcon />
                {displayName(user)}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<button type="submit" form="navbar-signout" />}
                >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                Start writing
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem
                key={link.href}
                render={<Link href={link.href} />}
                className={cn(
                  isActive(pathname, link.href) && "bg-muted font-semibold",
                )}
              >
                {link.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {user ? (
              <>
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<button type="submit" form="navbar-signout" />}
                >
                  Sign out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem render={<Link href="/login" />}>
                  Log in
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/signup" />}>
                  Start writing
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
