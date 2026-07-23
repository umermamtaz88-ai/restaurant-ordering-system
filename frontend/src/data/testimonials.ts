import type { Testimonial } from "@/types";
import { unsplash } from "@/utils/images";

const avatar = (id: string) => unsplash(id, 96);

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Elena Marchetti",
    role: "Regular Guest",
    avatar: avatar("1494790108377-be9c29b29330"),
    rating: 5,
    review:
      "The Solenne Signature Latte is the best I've had in the city. Warm atmosphere, attentive staff, and pastries that taste like they came straight from Paris.",
    date: "2026-06-12",
  },
  {
    id: "t2",
    name: "James Okonkwo",
    role: "Food Blogger",
    avatar: avatar("1507003211169-0a1dd7228f2d"),
    rating: 5,
    review:
      "From the wood-fired pizza to the cold brew, every dish feels thoughtfully crafted. The gallery-worthy plating makes it a must-visit for brunch lovers.",
    date: "2026-05-28",
  },
  {
    id: "t3",
    name: "Sophie Laurent",
    role: "Local Artist",
    avatar: avatar("1438761681033-6461ffad8d80"),
    rating: 4,
    review:
      "I come here to sketch on Sunday mornings. Excellent cappuccino, quiet corners, and the almond croissant is dangerously good.",
    date: "2026-05-15",
  },
  {
    id: "t4",
    name: "Marcus Chen",
    role: "Software Engineer",
    avatar: avatar("1472099645785-5658abf4ff4e"),
    rating: 5,
    review:
      "Fast delivery without sacrificing quality. My go-to order is the truffle pasta and a Velvet Cappuccino — always arrives hot and perfectly packed.",
    date: "2026-04-22",
  },
  {
    id: "t5",
    name: "Priya Sharma",
    role: "Yoga Instructor",
    avatar: avatar("1544005313-94ddf0286df2"),
    rating: 5,
    review:
      "Finally a café with genuinely healthy options that don't feel like an afterthought. The green smoothie bowl and oat milk lattes are my weekly ritual.",
    date: "2026-04-08",
  },
  {
    id: "t6",
    name: "Daniel Reyes",
    role: "Event Planner",
    avatar: avatar("1500648767791-00dcc994a43e"),
    rating: 4,
    review:
      "Hosted a small client breakfast here and the team exceeded expectations. Flexible reservations, beautiful space, and the pastry spread was a hit.",
    date: "2026-03-19",
  },
  {
    id: "t7",
    name: "Amelia Foster",
    role: "University Student",
    avatar: avatar("1534528741775-53994a69daeb"),
    rating: 5,
    review:
      "Student-friendly hours and fair prices for premium coffee. The seasonal pumpkin spice latte is worth the wait every autumn.",
    date: "2026-02-27",
  },
  {
    id: "t8",
    name: "Thomas Berg",
    role: "Retired Teacher",
    avatar: avatar("1560250097-0b93528c311a"),
    rating: 4,
    review:
      "A neighborhood gem. The staff remembers my order, the bread is baked fresh daily, and the quiet patio is perfect for reading the paper.",
    date: "2026-01-14",
  },
];
