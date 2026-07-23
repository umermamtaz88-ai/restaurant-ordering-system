import type { Achievement, TeamMember, TimelineEvent } from "@/types";
import { unsplash } from "@/utils/images";

const img = (id: string, w = 400) => unsplash(id, w);

export const teamMembers: TeamMember[] = [
  {
    id: "tm1",
    name: "Elena Solenne",
    role: "Owner & Founder",
    bio: "Former hospitality consultant who turned a lifelong love of coffee into a neighborhood institution. Elena sets the vision and knows every regular by name.",
    image: img("1494790108377-be9c29b29330"),
  },
  {
    id: "tm2",
    name: "Marco Bellini",
    role: "Head Barista",
    bio: "Competition-trained barista with a decade of experience across Milan and New York. Marco oversees espresso quality and trains the entire bar team.",
    image: img("1507003211169-0a1dd7228f2d"),
  },
  {
    id: "tm3",
    name: "Luca Romano",
    role: "Executive Chef",
    bio: "Trained in Rome and Copenhagen, Luca builds a seasonal menu that balances Italian comfort with modern technique and local ingredients.",
    image: img("1472099645785-5658abf4ff4e"),
  },
  {
    id: "tm4",
    name: "Amélie Dubois",
    role: "Pastry Chef",
    bio: "Lyon-born pâtissière who laments every shortcut. Amélie leads the dawn bake and creates the croissants, tarts, and cakes that define our mornings.",
    image: img("1438761681033-6461ffad8d80"),
  },
  {
    id: "tm5",
    name: "Sarah Kim",
    role: "General Manager",
    bio: "Sarah keeps the floor running smoothly — reservations, events, staff scheduling, and the guest experience from door to table.",
    image: img("1544005313-94ddf0286df2"),
  },
  {
    id: "tm6",
    name: "Diego Morales",
    role: "Sous Chef",
    bio: "Diego is Luca's right hand in the kitchen, executing pasta, pizza, and brunch service with precision and calm under pressure.",
    image: img("1500648767791-00dcc994a43e"),
  },
];

export const timeline: TimelineEvent[] = [
  {
    year: "2018",
    title: "Doors Open on Maple Street",
    description:
      "Elena Solenne opens a 40-seat café with a single espresso machine and a commitment to craft coffee and warm hospitality.",
  },
  {
    year: "2020",
    title: "Kitchen Expansion",
    description:
      "Luca Romano joins as executive chef, adding full brunch and lunch service with house-made pasta and wood-fired pizza.",
  },
  {
    year: "2022",
    title: "Patio & Pastry Lab",
    description:
      "Outdoor seating and a dedicated pastry kitchen launch, with Amélie Dubois leading dawn bakes that draw weekend crowds.",
  },
  {
    year: "2024",
    title: "Regional Best Café Award",
    description:
      "Solenne earns recognition for sustainability practices and guest experience, cementing its place as a neighborhood destination.",
  },
  {
    year: "2025",
    title: "Evening Service & Events",
    description:
      "Extended hours, wine pairings, and community cuppings transform Solenne into an all-day gathering place.",
  },
];

export const achievements: Achievement[] = [
  {
    id: "a1",
    value: "50K+",
    label: "Happy Guests",
    description: "Served since opening day",
  },
  {
    id: "a2",
    value: "24",
    label: "Menu Items",
    description: "Crafted in-house daily",
  },
  {
    id: "a3",
    value: "4.9",
    label: "Average Rating",
    description: "Across thousands of reviews",
  },
  {
    id: "a4",
    value: "7",
    label: "Years Strong",
    description: "And counting",
  },
];
