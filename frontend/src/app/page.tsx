import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { SectionSkeleton } from "@/components/shared/section-skeleton";

const sectionOpts = {
  loading: () => <SectionSkeleton />,
  // Below-the-fold sections don't need SSR — faster first HTML
  ssr: false as const,
};

const FeaturedCategories = dynamic(
  () =>
    import("@/components/sections/featured-categories").then((m) => ({
      default: m.FeaturedCategories,
    })),
  sectionOpts,
);

const PopularMenu = dynamic(
  () =>
    import("@/components/sections/popular-menu").then((m) => ({
      default: m.PopularMenu,
    })),
  sectionOpts,
);

const SpecialOffers = dynamic(
  () =>
    import("@/components/sections/special-offers").then((m) => ({
      default: m.SpecialOffers,
    })),
  sectionOpts,
);

const AboutPreview = dynamic(
  () =>
    import("@/components/sections/about-preview").then((m) => ({
      default: m.AboutPreview,
    })),
  sectionOpts,
);

const WhyChoose = dynamic(
  () =>
    import("@/components/sections/why-choose").then((m) => ({
      default: m.WhyChoose,
    })),
  sectionOpts,
);

const GalleryPreview = dynamic(
  () =>
    import("@/components/sections/gallery-preview").then((m) => ({
      default: m.GalleryPreview,
    })),
  sectionOpts,
);

const Testimonials = dynamic(
  () =>
    import("@/components/sections/testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  sectionOpts,
);

const Newsletter = dynamic(
  () =>
    import("@/components/sections/newsletter").then((m) => ({
      default: m.Newsletter,
    })),
  sectionOpts,
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <PopularMenu />
      <SpecialOffers />
      <AboutPreview />
      <WhyChoose />
      <GalleryPreview />
      <Testimonials />
      <Newsletter />
    </>
  );
}
