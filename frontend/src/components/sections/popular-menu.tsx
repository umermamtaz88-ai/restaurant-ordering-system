import Link from "next/link";
import { getPopularItems } from "@/data/menu";
import { ROUTES } from "@/constants/site";
import { ProductCard } from "@/components/shared/product-card";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const popularItems = getPopularItems(6);

export function PopularMenu() {
  return (
    <section className="bg-cream/30 py-16 dark:bg-espresso/20 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="Guest favorites"
            title="Popular on the menu"
            description="The pours and plates our regulars order again and again."
          />
          <Button variant="outline" className="shrink-0 rounded-full" asChild>
            <Link href={ROUTES.menu}>
              Full menu
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05}>
              <ProductCard item={item} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
