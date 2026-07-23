"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import { ROUTES } from "@/constants/site";
import { CategoryCard } from "@/components/shared/category-card";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const DISPLAY_COUNT = 8;
const displayCategories = categories.slice(0, DISPLAY_COUNT);

export function FeaturedCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="Explore"
            title="Browse by craving"
            description="From morning espresso to evening plates — find your next favorite."
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="size-10 rounded-full p-0"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Previous categories"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="size-10 rounded-full p-0"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Next categories"
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </ScrollReveal>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-5">
            {displayCategories.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "min-w-0 shrink-0 grow-0",
                  "basis-[72%] sm:basis-[45%] md:basis-[32%] lg:basis-[24%] xl:basis-[20%]"
                )}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>

        <ScrollReveal className="mt-10 text-center" delay={0.1}>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href={ROUTES.menu}>
              View all {categories.length} categories
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </ScrollReveal>
      </Container>
    </section>
  );
}
