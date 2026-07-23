import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { MenuExplorer } from "@/features/menu/menu-explorer";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore our full menu — specialty coffee, seasonal plates, pastries, and more at Solenne Café.",
};

type MenuPageProps = {
  searchParams: Promise<{ category?: string; search?: string; q?: string }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;

  return (
    <>
      <Container>
        <PageHeader
          title="Our Menu"
          description="Single-origin espresso, house-made plates, and pastries baked before sunrise — crafted for every moment of your day."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Menu", href: "/menu" },
          ]}
        />
      </Container>

      <section className="py-10 md:py-14">
        <Container>
          <MenuExplorer
            initialCategory={params.category}
            initialSearch={params.search ?? params.q ?? ""}
          />
        </Container>
      </section>
    </>
  );
}
