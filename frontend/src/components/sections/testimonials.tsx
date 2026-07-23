"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
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
    <section className="bg-cream/30 py-16 dark:bg-espresso/20 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="Kind words"
            title="What our guests say"
            description="Real stories from the people who make Solenne part of their daily ritual."
            align="center"
            className="sm:items-start sm:text-left"
          />
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="size-10 rounded-full p-0"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Previous testimonial"
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
              aria-label="Next testimonial"
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </ScrollReveal>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="min-w-0 shrink-0 grow-0 basis-full md:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
              >
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
                  <Quote
                    className="size-8 text-olive/40"
                    aria-hidden="true"
                    fill="currentColor"
                  />
                  <Rating value={testimonial.rating} showValue={false} className="mt-4" />
                  <blockquote className="mt-4 flex-1 font-sans text-base leading-relaxed text-foreground">
                    &ldquo;{testimonial.review}&rdquo;
                  </blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                    <div className="relative size-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <cite className="font-display text-base not-italic text-foreground">
                        {testimonial.name}
                      </cite>
                      <p className="font-sans text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
