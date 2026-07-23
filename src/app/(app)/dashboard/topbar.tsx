"use client";

import Link from "next/link";
import { Bell, LogOut, Search } from "lucide-react";

import { signOutAction } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const chars = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return chars.toUpperCase();
}

export function DashboardTopbar({ name }: { name: string }) {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:gap-4 sm:px-6">
      <form id="dashboard-signout" action={signOutAction} className="hidden" />

      {/* Visual search — wired up in the search issue (#28). */}
      <div className="relative w-full max-w-xl">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          aria-label="Search"
          placeholder="Search stories, writers, tags…"
          className="bg-muted/60 h-10 rounded-full border-transparent pl-9"
        />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="text-muted-foreground hover:text-foreground relative ml-auto hidden rounded-full p-2 sm:block"
      >
        <Bell className="size-5" />
        <span className="bg-brand-navy absolute top-1.5 right-1.5 size-2 rounded-full" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-muted ml-auto flex items-center gap-2 rounded-full py-1 pr-2 pl-1 sm:ml-0">
          <span
            aria-hidden
            className="bg-brand-sky text-brand-navy grid size-8 place-items-center rounded-full text-xs font-bold"
          >
            {initials(name)}
          </span>
          <span className="hidden text-sm font-medium sm:inline">{name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/write" />}>
            New piece
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<button type="submit" form="dashboard-signout" />}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
