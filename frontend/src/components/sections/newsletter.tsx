import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { SectionTitle } from "@/components/ui/section-title";

function CoffeeIllustration() {
  return (
    <div
      className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-latte/60 via-cream to-olive/20 sm:min-h-[320px]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 400 400" className="size-full" fill="none">
          <circle cx="200" cy="200" r="160" fill="url(#newsletterGrad1)" />
          <circle cx="280" cy="120" r="80" fill="url(#newsletterGrad2)" />
          <circle cx="100" cy="280" r="60" fill="url(#newsletterGrad3)" />
          <defs>
            <radialGradient id="newsletterGrad1">
              <stop offset="0%" stopColor="#5a6b45" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5a6b45" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="newsletterGrad2">
              <stop offset="0%" stopColor="#6b4423" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6b4423" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="newsletterGrad3">
              <stop offset="0%" stopColor="#d4b896" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#d4b896" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <svg
        viewBox="0 0 200 200"
        className="relative z-10 w-40 drop-shadow-lg sm:w-48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="100" cy="170" rx="70" ry="8" fill="#2c1810" fillOpacity="0.12" />
        <path
          d="M55 75 C55 55 75 45 100 45 C125 45 145 55 145 75 L145 130 C145 150 125 160 100 160 C75 160 55 150 55 130 Z"
          fill="#fbf8f4"
          stroke="#2c1810"
          strokeWidth="2.5"
        />
        <path
          d="M145 90 C165 90 175 100 175 115 C175 130 165 140 145 140"
          stroke="#2c1810"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M65 130 C65 130 80 145 100 145 C120 145 135 130 135 130"
          fill="#6b4423"
          fillOpacity="0.6"
        />
        <path
          d="M85 35 C85 20 95 10 100 10 C105 10 115 20 115 35"
          stroke="#d4b896"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M95 25 C95 15 98 8 100 8 C102 8 105 15 105 25"
          stroke="#d4b896"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M105 30 C105 18 108 12 112 12"
          stroke="#d4b896"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export function Newsletter() {
  return (
    <section className="pb-16 md:pb-24 lg:pb-28">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="grid lg:grid-cols-2">
            <ScrollReveal className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <SectionTitle
                eyebrow="Stay in the loop"
                title="Join the Solenne circle"
                description="Seasonal menus, early access to events, and the occasional pastry surprise — delivered gently to your inbox."
              />
              <div className="mt-8">
                <NewsletterForm />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="p-4 sm:p-6 lg:p-8">
              <CoffeeIllustration />
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
