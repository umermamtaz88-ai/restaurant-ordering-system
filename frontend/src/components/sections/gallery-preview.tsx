"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { galleryImages } from "@/data/gallery";
import { ROUTES } from "@/constants/site";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { GalleryImage } from "@/types";

const previewImages = galleryImages.slice(0, 6);

function spanClass(span?: GalleryImage["span"]) {
  switch (span) {
    case "wide":
      return "sm:col-span-2";
    case "tall":
      return "sm:row-span-2";
    default:
      return "";
  }
}

export function GalleryPreview() {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  return (
    <section className="py-16 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="Moments"
            title="Inside the café"
            description="A glimpse of the pours, plates, and spaces that make Solenne feel like home."
          />
          <Button variant="outline" className="shrink-0 rounded-full" asChild>
            <Link href={ROUTES.gallery}>
              Full gallery
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </ScrollReveal>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[220px]">
          {previewImages.map((image, index) => (
            <ScrollReveal
              key={image.id}
              delay={index * 0.04}
              className={cn("relative", spanClass(image.span))}
            >
              <button
                type="button"
                onClick={() => setActiveImage(image)}
                className="group relative size-full overflow-hidden rounded-3xl shadow-soft transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2"
                aria-label={`View ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={70}
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-espresso/0 transition-colors duration-300 group-hover:bg-espresso/20" />
              </button>
            </ScrollReveal>
          ))}
        </div>
      </Container>

      <Modal
        open={activeImage !== null}
        onClose={() => setActiveImage(null)}
        title={activeImage?.alt ?? "Gallery image"}
        className="max-w-4xl overflow-hidden p-0"
        showCloseButton={false}
      >
        {activeImage && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-espresso/60 text-warm-white backdrop-blur-sm transition-colors hover:bg-espresso/80"
              aria-label="Close lightbox"
            >
              <X className="size-5" />
            </button>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
            <p className="p-4 font-sans text-sm text-muted-foreground">{activeImage.alt}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
