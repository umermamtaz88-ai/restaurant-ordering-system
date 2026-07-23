"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Timer } from "lucide-react";
import { specialOffers } from "@/data/offers";
import { menuItems } from "@/data/menu";
import { ROUTES } from "@/constants/site";
import { useCountdown } from "@/hooks/use-countdown";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const featuredOffer = specialOffers[0];
const countdown = { pad: (n: number) => String(n).padStart(2, "0") };

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-warm-white/10 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
      <span className="font-display text-2xl font-semibold text-warm-white sm:text-3xl">
        {countdown.pad(value)}
      </span>
      <span className="font-sans text-[10px] uppercase tracking-widest text-cream/70 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

function PromoBanner() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(featuredOffer.endsAt);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-espresso shadow-lift">
      <Image
        src={featuredOffer.image}
        alt={featuredOffer.title}
        fill
        quality={70}
        loading="lazy"
        className="object-cover opacity-40"
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/90 to-espresso/60" />

      <div className="relative grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10 lg:p-12">
        <div>
          <Badge variant="olive" className="mb-4">
            Limited time
          </Badge>
          <h3 className="font-display text-3xl font-semibold text-warm-white md:text-4xl">
            {featuredOffer.title}
          </h3>
          <p className="mt-3 max-w-xl font-sans text-cream/80">{featuredOffer.description}</p>
          {featuredOffer.code && (
            <p className="mt-4 inline-flex items-center gap-2 font-sans text-sm text-olive-muted">
              <Tag className="size-4" aria-hidden="true" />
              Use code <span className="font-semibold text-warm-white">{featuredOffer.code}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex items-center gap-2 text-cream/80">
            <Timer className="size-4" aria-hidden="true" />
            <span className="font-sans text-sm uppercase tracking-widest">
              {isExpired ? "Offer ended" : "Ends in"}
            </span>
          </div>
          {!isExpired && (
            <div className="flex gap-2 sm:gap-3">
              <CountdownUnit value={days} label="Days" />
              <CountdownUnit value={hours} label="Hours" />
              <CountdownUnit value={minutes} label="Min" />
              <CountdownUnit value={seconds} label="Sec" />
            </div>
          )}
          <Button variant="secondary" className="rounded-full" asChild>
            <Link href={ROUTES.menu}>Shop the offer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SpecialOffers() {
  const otherOffers = specialOffers.slice(1);

  return (
    <section className="py-16 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal className="mb-10">
          <SectionTitle
            eyebrow="Seasonal"
            title="Special offers"
            description="Thoughtful bundles and limited-time savings on our most-loved items."
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal>
          <PromoBanner />
        </ScrollReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {otherOffers.map((offer, index) => {
            const linkedItems = offer.productIds
              .map((id) => menuItems.find((item) => item.id === id))
              .filter((item): item is NonNullable<typeof item> => item !== undefined);

            return (
              <ScrollReveal key={offer.id} delay={index * 0.08}>
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      quality={70}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <Badge variant="discount" className="absolute left-4 top-4">
                      −{offer.discount}%
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl text-foreground">{offer.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {offer.description}
                    </p>
                    {linkedItems.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {linkedItems.map((item) => (
                          <Link
                            key={item.id}
                            href={`/menu/${item.slug}`}
                            className={cn(
                              "rounded-full bg-latte/40 px-3 py-1 font-sans text-xs text-espresso",
                              "transition-colors hover:bg-olive/20 hover:text-olive dark:text-cream"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    <Button variant="ghost" className="mt-4 w-fit rounded-full px-0" asChild>
                      <Link href={ROUTES.menu}>
                        View details
                        <ArrowRight className="ml-1 size-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
