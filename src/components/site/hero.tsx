"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section className="paper relative overflow-hidden">
      {/* Soft brand wash background */}
      <div
        aria-hidden
        className="from-brand-fog/70 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b"
      />
      <div
        aria-hidden
        className="bg-brand-sky/40 pointer-events-none absolute -top-24 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 px-4 py-24 text-center sm:py-32"
      >
        {/* Tilted sticker badge */}
        <motion.span
          variants={item}
          className="border-brand-navy/15 bg-card text-brand-navy dark:text-foreground -rotate-2 rounded-xl border px-4 py-1.5 text-sm font-medium shadow-sm"
        >
          ✍️ a home for <span className="redline">perfect</span>{" "}
          <span className="hand text-brand-navy dark:text-brand-steel text-[1.15em]">
            real
          </span>{" "}
          young writers
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-brand-navy dark:text-foreground text-5xl leading-[1.05] font-black tracking-tight text-balance sm:text-7xl"
        >
          Showcase your writing.
          <br />
          <span className="marker">
            <span>Sharpen</span>
          </span>{" "}
          your voice.
        </motion.h1>

        {/* Handwritten margin note */}
        <motion.p
          variants={item}
          className="hand text-muted-foreground -mt-3 text-xl"
        >
          <span className="text-brand-steel">↑</span> yes, even that messy first
          draft
        </motion.p>

        <motion.p
          variants={item}
          className="text-muted-foreground max-w-xl text-lg text-balance"
        >
          WriteMyWrongs is where young writers publish their work, trade honest
          feedback, and get a little better with every draft. No red pen. Well, actually
          <span className="doodle-underline">only the friendly kind.</span>
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/signup"
            className={`${buttonVariants({ size: "lg" })} rotate-[-1deg] transition-transform hover:rotate-0`}
          >
            Start writing — it&apos;s free
          </Link>
          <Link
            href="/explore"
            className={`${buttonVariants({ size: "lg", variant: "outline" })} rotate-[1deg] transition-transform hover:rotate-0`}
          >
            Explore writing
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
