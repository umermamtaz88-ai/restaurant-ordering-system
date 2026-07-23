import Image from "next/image";
import Link from "next/link";
import { CAFE_INFO, ROUTES } from "@/constants/site";
import { unsplash } from "@/utils/images";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ABOUT_IMAGE = unsplash("1554118811-1e0d58224f24", 720);

export function AboutPreview() {
  return (
    <section className="overflow-hidden py-16 md:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[5/6]">
              <Image
                src={ABOUT_IMAGE}
                alt="Sunlit Solenne Café interior with marble tables and greenery"
                fill
                quality={70}
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div
              className="absolute -bottom-6 -right-4 -z-10 hidden h-48 w-48 rounded-full bg-latte/50 blur-2xl sm:block"
              aria-hidden="true"
            />
            <div
              className="absolute -left-6 -top-6 -z-10 hidden h-32 w-32 rounded-full bg-olive/20 blur-2xl sm:block"
              aria-hidden="true"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SectionTitle
              eyebrow="Our story"
              title="A quiet sanctuary in the heart of Brooklyn"
              description={CAFE_INFO.description}
            />
            <p className="mt-6 font-sans text-base leading-relaxed text-charcoal/70 dark:text-cream/70">
              Since opening our doors, we&apos;ve built Solenne around a simple belief: great
              coffee is a ritual worth slowing down for. Every cup is pulled with intention, every
              plate plated with care, and every guest welcomed like family.
            </p>
            <Button className="mt-8 rounded-full" variant="secondary" asChild>
              <Link href={ROUTES.about}>
                Discover our story
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
