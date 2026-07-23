import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { HashScroll } from "@/components/shared/hash-scroll";
import { CAFE_INFO, ROUTES } from "@/constants/site";

const ContactForm = dynamic(
  () =>
    import("@/features/contact/contact-form").then((m) => ({
      default: m.ContactForm,
    })),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl bg-latte/20" aria-hidden="true" />
    ),
  },
);

const ReservationForm = dynamic(
  () =>
    import("@/features/reservation/reservation-form").then((m) => ({
      default: m.ReservationForm,
    })),
  {
    loading: () => (
      <div className="h-80 animate-pulse rounded-2xl bg-latte/20" aria-hidden="true" />
    ),
  },
);

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${CAFE_INFO.name} — visit us at ${CAFE_INFO.address}, ${CAFE_INFO.city}, call, email, send a message, or book a table.`,
};

export default function ContactPage() {
  return (
    <>
      <Suspense fallback={null}>
        <HashScroll />
      </Suspense>
      <Container>
        <PageHeader
          title="Contact Us"
          description="We'd love to hear from you — whether it's a question, feedback, or booking a table."
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Contact", href: ROUTES.contact },
          ]}
        />
      </Container>

      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal className="space-y-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-latte/40 shadow-lift dark:border-latte/20">
                <div className="absolute inset-0 bg-gradient-to-br from-latte/60 via-cream/40 to-olive/20 dark:from-espresso dark:via-charcoal dark:to-espresso/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <MapPin className="size-10 text-olive" aria-hidden="true" />
                  <p className="mt-4 font-display text-xl text-espresso dark:text-cream">
                    {CAFE_INFO.address}
                  </p>
                  <p className="mt-1 font-sans text-sm text-charcoal/70 dark:text-cream/70">
                    {CAFE_INFO.city}
                  </p>
                  <p className="mt-4 max-w-xs font-sans text-xs text-charcoal/50 dark:text-cream/50">
                    Map placeholder — embed your Google Maps iframe here in production.
                  </p>
                </div>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(90,107,69,0.08) 35px, rgba(90,107,69,0.08) 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(90,107,69,0.08) 35px, rgba(90,107,69,0.08) 36px)",
                  }}
                  aria-hidden="true"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-latte/40 bg-cream/30 p-5 dark:border-latte/20 dark:bg-espresso/30">
                  <Phone className="size-5 text-olive" aria-hidden="true" />
                  <h2 className="mt-3 font-display text-lg text-espresso dark:text-cream">
                    Phone
                  </h2>
                  <a
                    href={`tel:${CAFE_INFO.phone.replace(/\s/g, "")}`}
                    className="mt-1 block font-sans text-sm text-charcoal/70 transition-colors hover:text-olive dark:text-cream/70"
                  >
                    {CAFE_INFO.phone}
                  </a>
                </div>
                <div className="rounded-3xl border border-latte/40 bg-cream/30 p-5 dark:border-latte/20 dark:bg-espresso/30">
                  <Mail className="size-5 text-olive" aria-hidden="true" />
                  <h2 className="mt-3 font-display text-lg text-espresso dark:text-cream">
                    Email
                  </h2>
                  <a
                    href={`mailto:${CAFE_INFO.email}`}
                    className="mt-1 block font-sans text-sm text-charcoal/70 transition-colors hover:text-olive dark:text-cream/70"
                  >
                    {CAFE_INFO.email}
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-latte/40 bg-warm-white p-6 dark:border-latte/20 dark:bg-charcoal">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-olive" aria-hidden="true" />
                  <h2 className="font-display text-lg text-espresso dark:text-cream">
                    Opening Hours
                  </h2>
                </div>
                <ul className="mt-4 space-y-2">
                  {CAFE_INFO.openingHours.map((row) => (
                    <li
                      key={row.day}
                      className="flex justify-between gap-4 font-sans text-sm text-charcoal/70 dark:text-cream/70"
                    >
                      <span>{row.day}</span>
                      <span className="font-medium text-espresso dark:text-cream">
                        {row.closed ? "Closed" : row.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-3xl border border-latte/40 bg-warm-white p-6 shadow-soft dark:border-latte/20 dark:bg-charcoal md:p-8">
                <h2 className="font-display text-2xl text-espresso dark:text-cream">
                  Send a message
                </h2>
                <p className="mt-2 font-sans text-sm text-charcoal/70 dark:text-cream/70">
                  Fill out the form below and our team will respond within one business day.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section
        id="book-table"
        className="scroll-mt-24 border-t border-border bg-cream/30 py-16 dark:bg-espresso/20 md:py-24"
      >
        <Container>
          <div className="mb-10 max-w-2xl">
            <SectionTitle
              eyebrow="Reservations"
              title="Book a table"
              description="Plan brunch, dinner, or a quiet morning pour — we'll save you a seat and confirm by email."
            />
          </div>
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8 md:p-10">
            <ReservationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
