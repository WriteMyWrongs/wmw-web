import type { Metadata } from "next";

import { Editor } from "@/app/(app)/write/editor";
import { SiteShell } from "@/components/site/site-shell";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "New piece",
};

export default async function NewPiecePage() {
  await requireUser();
  return (
    <SiteShell>
      <Editor />
    </SiteShell>
  );
}
