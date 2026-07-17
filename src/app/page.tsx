import { Features } from "@/components/site/features";
import { Hero } from "@/components/site/hero";
import { SiteShell } from "@/components/site/site-shell";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Features />
    </SiteShell>
  );
}
