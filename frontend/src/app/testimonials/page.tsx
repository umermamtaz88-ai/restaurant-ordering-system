import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Rating } from "@/components/ui/rating";
import { testimonials } from "@/data/testimonials";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What our guests say about Solenne Café — coffee, cuisine, and hospitality from the people who know us best.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function TestimonialsPage() {
  return (
    <>
      <Container>
        <PageHeader
          title="Guest Stories"
          description="Real words from regulars, first-time visitors, and neighbors who've made Solenne part of their routine."
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Testimonials", href: ROUTES.testimonials },
          ]}
        />
      </Container>

      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-3xl border border-latte/40 bg-warm-white p-6 shadow-soft transition-transform hover:-translate-y-1 dark:border-latte/20 dark:bg-charcoal">
                  <div className="flex items-center gap-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-latte/50 dark:ring-latte/20">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h2 className="font-display text-lg text-espresso dark:text-cream">
                        {item.name}
                      </h2>
                      <p className="font-sans text-xs text-olive">{item.role}</p>
                    </div>
                  </div>
                  <Rating
                    value={item.rating}
                    showValue={false}
                    size="sm"
                    className="mt-4"
                  />
                  <blockquote className="mt-4 flex-1 font-sans text-sm leading-relaxed text-charcoal/80 dark:text-cream/80">
                    &ldquo;{item.review}&rdquo;
                  </blockquote>
                  <time
                    dateTime={item.date}
                    className="mt-4 font-sans text-xs text-charcoal/50 dark:text-cream/50"
                  >
                    {formatDate(item.date)}
                  </time>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
