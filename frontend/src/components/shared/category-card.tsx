import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { ROUTES } from "@/constants/site";
import { cn } from "@/utils/cn";

export interface CategoryCardProps {
  category: Category;
  index?: number;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`${ROUTES.menu}?category=${category.slug}`}
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft",
        "transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2",
        className,
      )}
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        quality={70}
        loading="lazy"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 32vw, 20vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl text-warm-white">{category.name}</h3>
        <p className="mt-1 line-clamp-2 font-sans text-sm text-cream/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
