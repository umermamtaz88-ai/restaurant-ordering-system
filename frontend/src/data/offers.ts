import type { SpecialOffer } from "@/types";
import { unsplash } from "@/utils/images";

const img = (id: string, w = 720) => unsplash(id, w);

export const specialOffers: SpecialOffer[] = [
  {
    id: "o1",
    title: "Morning Coffee Bundle",
    description:
      "Start your day with our signature latte and a fresh croissant — 20% off when ordered together.",
    discount: 20,
    image: img("1561882468-9110e03e0f78"),
    endsAt: "2026-08-01T23:59:59.000Z",
    productIds: ["m1", "m16"],
    code: "MORNING20",
  },
  {
    id: "o2",
    title: "Weekend Brunch Special",
    description:
      "Enjoy 15% off our most-loved brunch plates and a complimentary cold brew upgrade.",
    discount: 15,
    image: img("1533089860892-a7c6f0a88666"),
    endsAt: "2026-09-15T23:59:59.000Z",
    productIds: ["m6", "m8", "m15"],
    code: "BRUNCH15",
  },
  {
    id: "o3",
    title: "Sweet Treat Duo",
    description:
      "Pair any dessert with a specialty mocha and save 25% — perfect for an afternoon indulgence.",
    discount: 25,
    image: img("1488477181946-6428a0291777"),
    endsAt: "2026-07-30T23:59:59.000Z",
    productIds: ["m4", "m18", "m20"],
  },
];
