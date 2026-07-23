import type { GalleryImage } from "@/types";
import { unsplash } from "@/utils/images";

const img = (id: string, w = 600) => unsplash(id, w);

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: img("1495474472287-4d71bcdd2085"),
    alt: "Barista pouring latte art into a ceramic cup",
    category: "coffee",
    span: "wide",
  },
  {
    id: "g2",
    src: img("1555507036-ab1f40382040"),
    alt: "Golden croissants displayed on a wooden board",
    category: "bakery",
    span: "tall",
  },
  {
    id: "g3",
    src: img("1513104890138-7c749659a591"),
    alt: "Wood-fired margherita pizza with fresh basil",
    category: "food",
  },
  {
    id: "g4",
    src: img("1561882468-9110e03e0f78"),
    alt: "Steaming cappuccino with cinnamon dusting",
    category: "coffee",
  },
  {
    id: "g5",
    src: img("1488477181946-6428a0291777"),
    alt: "Layered chocolate cake slice on a white plate",
    category: "desserts",
    span: "tall",
  },
  {
    id: "g6",
    src: img("1554118811-1e0d58224f24"),
    alt: "Sunlit café interior with marble tables and plants",
    category: "interior",
    span: "wide",
  },
  {
    id: "g7",
    src: img("1621996346565-e3dbc646d9a9"),
    alt: "Creamy truffle pasta twirled on a fork",
    category: "food",
  },
  {
    id: "g8",
    src: img("1517701604599-bb29b565090c"),
    alt: "Iced cold brew coffee with condensation",
    category: "coffee",
  },
  {
    id: "g9",
    src: img("1578985545062-69928b1d9587"),
    alt: "Strawberry layer cake with fresh berries",
    category: "desserts",
  },
  {
    id: "g10",
    src: img("1533089860892-a7c6f0a88666"),
    alt: "Avocado toast with poached eggs and microgreens",
    category: "breakfast",
    span: "wide",
  },
  {
    id: "g11",
    src: img("1442512595331-e89e8a173cb0"),
    alt: "Outdoor patio seating under string lights at dusk",
    category: "interior",
    span: "tall",
  },
  {
    id: "g12",
    src: img("1499636136210-6f4ee915583e"),
    alt: "Assorted cookies on a cooling rack",
    category: "bakery",
  },
  {
    id: "g13",
    src: img("1505252585461-04db1eb85825"),
    alt: "Colorful fruit smoothie in a glass jar",
    category: "drinks",
  },
  {
    id: "g14",
    src: img("1568901346375-23c9450c58cd"),
    alt: "Gourmet burger with melted cheese and fries",
    category: "food",
  },
  {
    id: "g15",
    src: img("1511920170035-9088a238372c"),
    alt: "Espresso machine pulling a fresh double shot",
    category: "coffee",
  },
  {
    id: "g16",
    src: img("1509440159556-2f255f1bfa3b"),
    alt: "Freshly baked sourdough loaves on a linen cloth",
    category: "bakery",
    span: "wide",
  },
];
