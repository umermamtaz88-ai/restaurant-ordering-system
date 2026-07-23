"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/data/gallery";
import type { GalleryImage } from "@/types";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/utils/cn";

export function GalleryGrid() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {galleryImages.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelected(image)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2"
          >
            <div
              className={cn(
                "relative overflow-hidden shadow-soft transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lift",
                image.span === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={70}
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="absolute inset-x-0 bottom-0 p-4 text-left font-sans text-sm text-warm-white opacity-0 transition-opacity group-hover:opacity-100">
                {image.alt}
              </p>
            </div>
          </button>
        ))}
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.alt ?? "Gallery image"}
        description={selected ? `Category: ${selected.category}` : undefined}
        className="max-w-4xl overflow-hidden p-0"
        showCloseButton
      >
        {selected ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={selected.src}
              alt={selected.alt}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
