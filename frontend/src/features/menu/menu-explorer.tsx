"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, LayoutList, SlidersHorizontal } from "lucide-react";
import { menuItems } from "@/data/menu";
import { categories } from "@/data/categories";
import type { CategoryId, SortOption, ViewMode } from "@/types";
import { ProductCard } from "@/components/shared/product-card";
import { SearchBar } from "@/components/ui/search-bar";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/utils/cn";

const PRICE_MIN = 0;
const PRICE_MAX = 25;

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Name A–Z", value: "name" },
];

function resolveCategory(slug: string | undefined): CategoryId | "all" {
  if (!slug || slug === "all") return "all";
  const match = categories.find((c) => c.slug === slug || c.id === slug);
  return match?.id ?? "all";
}

function sortItems(items: typeof menuItems, sort: SortOption) {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted.sort((a, b) => {
        const scoreA = (a.isBestSeller ? 2 : 0) + (a.isPopular ? 1 : 0);
        const scoreB = (b.isBestSeller ? 2 : 0) + (b.isPopular ? 1 : 0);
        return scoreB - scoreA || b.rating - a.rating;
      });
  }
}

export interface MenuExplorerProps {
  initialCategory?: string;
  initialSearch?: string;
}

export function MenuExplorer({
  initialCategory = "all",
  initialSearch = "",
}: MenuExplorerProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<CategoryId | "all">(
    resolveCategory(initialCategory)
  );
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [priceMin, setPriceMin] = useState(String(PRICE_MIN));
  const [priceMax, setPriceMax] = useState(String(PRICE_MAX));
  const [popularOnly, setPopularOnly] = useState(false);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [seasonalOnly, setSeasonalOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const min = Number(priceMin) || PRICE_MIN;
    const max = Number(priceMax) || PRICE_MAX;
    const query = search.trim().toLowerCase();

    const filtered = menuItems.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (item.price < min || item.price > max) return false;
      if (popularOnly && !item.isPopular) return false;
      if (vegetarianOnly && !item.isVegetarian) return false;
      if (bestSellerOnly && !item.isBestSeller) return false;
      if (seasonalOnly && !item.isSeasonal) return false;
      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some((i) => i.toLowerCase().includes(query)) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    });

    return sortItems(filtered, sort);
  }, [
    search,
    category,
    sort,
    priceMin,
    priceMax,
    popularOnly,
    vegetarianOnly,
    bestSellerOnly,
    seasonalOnly,
  ]);

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Featured";

  const toggleFilters: {
    key: string;
    label: string;
    active: boolean;
    onToggle: () => void;
  }[] = [
    {
      key: "popular",
      label: "Popular",
      active: popularOnly,
      onToggle: () => setPopularOnly((v) => !v),
    },
    {
      key: "vegetarian",
      label: "Vegetarian",
      active: vegetarianOnly,
      onToggle: () => setVegetarianOnly((v) => !v),
    },
    {
      key: "best-seller",
      label: "Best Seller",
      active: bestSellerOnly,
      onToggle: () => setBestSellerOnly((v) => !v),
    },
    {
      key: "seasonal",
      label: "Seasonal",
      active: seasonalOnly,
      onToggle: () => setSeasonalOnly((v) => !v),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={search}
          onValueChange={setSearch}
          placeholder="Search menu, ingredients, tags…"
          containerClassName="max-w-xl"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            aria-label="Sort menu items"
            trigger={
              <span className="inline-flex h-10 items-center rounded-xl border border-latte/40 bg-warm-white px-4 font-sans text-sm text-charcoal dark:border-latte/20 dark:bg-charcoal dark:text-cream">
                {activeSortLabel}
              </span>
            }
            items={SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
            onSelect={(value) => setSort(value as SortOption)}
            align="end"
          />
          <div className="inline-flex rounded-xl border border-latte/40 bg-warm-white p-1 dark:border-latte/20 dark:bg-charcoal">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(
                "rounded-lg p-2 transition-colors",
                view === "grid"
                  ? "bg-olive text-warm-white"
                  : "text-charcoal hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={cn(
                "rounded-lg p-2 transition-colors",
                view === "list"
                  ? "bg-olive text-warm-white"
                  : "text-charcoal hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
              )}
            >
              <LayoutList className="size-4" />
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="rounded-xl lg:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside
          className={cn(
            "w-full shrink-0 space-y-6 rounded-3xl border border-latte/40 bg-cream/30 p-6 dark:border-latte/20 dark:bg-espresso/30 lg:w-64 xl:w-72",
            !filtersOpen && "hidden lg:block"
          )}
        >
          <div>
            <h2 className="font-display text-lg text-espresso dark:text-cream">
              Categories
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "rounded-full px-3 py-1.5 font-sans text-xs font-medium transition-colors",
                  category === "all"
                    ? "bg-olive text-warm-white"
                    : "bg-warm-white text-charcoal hover:bg-latte/50 dark:bg-charcoal dark:text-cream dark:hover:bg-espresso"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-sans text-xs font-medium transition-colors",
                    category === cat.id
                      ? "bg-olive text-warm-white"
                      : "bg-warm-white text-charcoal hover:bg-latte/50 dark:bg-charcoal dark:text-cream dark:hover:bg-espresso"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-espresso dark:text-cream">
              Price Range
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                label="Min"
                type="number"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <Input
                label="Max"
                type="number"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-espresso dark:text-cream">
              Filters
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {toggleFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={filter.active}
                  onClick={filter.onToggle}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-sans text-xs font-medium transition-colors",
                    filter.active
                      ? "bg-olive text-warm-white"
                      : "bg-warm-white text-charcoal hover:bg-latte/50 dark:bg-charcoal dark:text-cream dark:hover:bg-espresso"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 font-sans text-sm text-charcoal/60 dark:text-cream/60">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} found
          </p>

          {filteredItems.length === 0 ? (
            <EmptyState
              title="No items match your filters"
              description="Try adjusting your search, category, or filter settings."
              action={
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setPopularOnly(false);
                    setVegetarianOnly(false);
                    setBestSellerOnly(false);
                    setSeasonalOnly(false);
                    setPriceMin(String(PRICE_MIN));
                    setPriceMax(String(PRICE_MAX));
                  }}
                >
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <div
              className={cn(
                view === "grid"
                  ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              )}
            >
              {filteredItems.map((item) => (
                <ProductCard key={item.id} item={item} view={view} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
