import type { OpeningHours } from "@/types";

export const SITE_NAME = "Solenne";

export const SITE_TAGLINE =
  "Crafted coffee, seasonal plates, and the quiet warmth of a neighborhood sanctuary.";

export const ROUTES = {
  home: "/",
  menu: "/menu",
  about: "/about",
  gallery: "/gallery",
  reservation: "/contact?book=1",
  reservations: "/contact?book=1",
  contact: "/contact",
  blog: "/blog",
  testimonials: "/testimonials",
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  kitchen: "/kitchen",
  admin: "/admin",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const TAX_RATE = 0.0875;
export const DELIVERY_FEE = 4.5;
export const FREE_DELIVERY_THRESHOLD = 35;

const OPENING_HOURS: OpeningHours[] = [
  { day: "Monday", hours: "7:00 AM – 8:00 PM" },
  { day: "Tuesday", hours: "7:00 AM – 8:00 PM" },
  { day: "Wednesday", hours: "7:00 AM – 8:00 PM" },
  { day: "Thursday", hours: "7:00 AM – 9:00 PM" },
  { day: "Friday", hours: "7:00 AM – 10:00 PM" },
  { day: "Saturday", hours: "8:00 AM – 10:00 PM" },
  { day: "Sunday", hours: "8:00 AM – 7:00 PM" },
];

export const CAFE_INFO = {
  name: `${SITE_NAME} Café`,
  description:
    "Solenne Café is a premium neighborhood coffee house and kitchen in Brooklyn — single-origin espresso, seasonal plates, and warm hospitality since 2018.",
  tagline: SITE_TAGLINE,
  rating: 4.9,
  reviewCount: 2847,
  phone: "+1 (718) 555-0142",
  email: "hello@solenne.cafe",
  address: "142 Maple Street",
  city: "Brooklyn, NY 11201",
  country: "United States",
  mapEmbedLabel: "Solenne Café location on Maple Street, Brooklyn",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
  },
  openingHours: OPENING_HOURS,
};
