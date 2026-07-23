import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import {
  getMenuItemBySlug,
  getRelatedItems,
  menuItems,
} from "@/data/menu";
import { ProductDetails } from "@/features/menu/product-details";
import { ROUTES } from "@/constants/site";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return menuItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug);

  if (!item) {
    return { title: "Item Not Found" };
  }

  return {
    title: item.name,
    description: item.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const relatedItems = getRelatedItems(item);

  return (
    <>
      <Container>
        <PageHeader
          title={item.name}
          description={item.description}
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Menu", href: ROUTES.menu },
            { label: item.name, href: `/menu/${item.slug}` },
          ]}
        />
      </Container>

      <section className="py-10 md:py-14">
        <Container>
          <ProductDetails item={item} />
        </Container>
      </section>

      {relatedItems.length > 0 ? (
        <section className="border-t border-latte/40 bg-cream/30 py-14 dark:border-latte/20 dark:bg-espresso/20 md:py-20">
          <Container>
            <ScrollReveal>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionTitle
                  eyebrow="You may also like"
                  title="Related Items"
                  description="More favorites from the same category and our guest picks."
                />
                <Button variant="outline" className="rounded-full shrink-0" asChild>
                  <Link href={ROUTES.menu}>View full menu</Link>
                </Button>
              </div>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedItems.map((related) => (
                <ScrollReveal key={related.id}>
                  <ProductCard item={related} />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
