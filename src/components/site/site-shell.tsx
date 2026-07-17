import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

/**
 * The standard page shell: sticky navbar, a flexed main region that pushes
 * the footer to the bottom on short pages, and the site footer. Wrap page
 * content in this so the chrome stays consistent and isn't re-declared per
 * page. Auth pages (the `(auth)` route group) deliberately do not use it.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
