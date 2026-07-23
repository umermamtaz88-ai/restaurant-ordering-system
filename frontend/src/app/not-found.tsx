import Link from "next/link";
import { Coffee, Home } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/site";

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(90,107,69,0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,184,150,0.2), transparent 40%)",
        }}
      />
      <Container className="relative text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-latte/40 text-olive dark:bg-espresso">
          <Coffee className="size-10" aria-hidden="true" />
        </div>
        <p className="mt-8 font-display text-8xl font-semibold text-espresso/20 dark:text-cream/15">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-espresso dark:text-cream md:text-4xl">
          This page has gone cold
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base text-charcoal/70 dark:text-cream/70">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let us
          guide you back to something warm.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="secondary" size="lg" className="rounded-full" asChild>
            <Link href={ROUTES.home}>
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" asChild>
            <Link href={ROUTES.menu}>Browse menu</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
