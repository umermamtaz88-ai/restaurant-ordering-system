import {
  Award,
  ChefHat,
  Coffee,
  Croissant,
  HeartHandshake,
  Leaf,
  Salad,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { whyChooseItems } from "@/data/why-choose";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  ChefHat,
  Coffee,
  Truck,
  Croissant,
  Salad,
  Award,
  HeartHandshake,
  Heart: HeartHandshake,
  Sparkles: Award,
  Cake: Croissant,
};

function WhyChooseIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Coffee;
  return (
    <span className="flex size-12 items-center justify-center rounded-2xl bg-olive/10 text-olive dark:bg-olive/20">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

export function WhyChoose() {
  return (
    <section className="bg-cream/30 py-16 dark:bg-espresso/20 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal className="mb-12">
          <SectionTitle
            eyebrow="The Solenne difference"
            title="Why choose us"
            description="Eight reasons guests return — from bean to plate, we never cut corners."
            align="center"
          />
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05}>
              <article
                className={cn(
                  "group h-full rounded-3xl border border-border bg-card p-6 shadow-soft",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                )}
              >
                <WhyChooseIcon name={item.icon} />
                <h3 className="mt-4 font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
