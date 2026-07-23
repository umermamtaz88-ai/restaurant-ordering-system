import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { GalleryGrid } from "@/features/gallery/gallery-grid";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual tour of Solenne Café — coffee, cuisine, pastries, and our warm interior spaces.",
};

export default function GalleryPage() {
  return (
    <>
      <Container>
        <PageHeader
          title="Gallery"
          description="Moments from our bar, kitchen, and dining room — the sights and flavors of Solenne."
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Gallery", href: ROUTES.gallery },
          ]}
        />
      </Container>

      <section className="py-10 md:py-14">
        <Container>
          <GalleryGrid />
        </Container>
      </section>
    </>
  );
}
