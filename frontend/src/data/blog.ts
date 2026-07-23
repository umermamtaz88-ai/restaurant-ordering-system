import type { BlogPost } from "@/types";
import { unsplash } from "@/utils/images";

const img = (id: string, w = 800) => unsplash(id, w);
const avatar = (id: string) => unsplash(id, 96);

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "art-of-latte",
    title: "The Art of Latte: From Bean to Cup",
    excerpt:
      "Discover how our head barista transforms single-origin beans into the perfect pour, one cup at a time.",
    content: `At Solenne Café, every latte begins with intention. We source beans from small farms in Ethiopia and Colombia, roasting them in micro-batches to preserve their unique terroir. Our head barista, Marco, trains each team member to dial in espresso within a two-gram window — because consistency is the foundation of great coffee.

The milk matters just as much as the shot. We steam oat and whole milk to a silky microfoam, aiming for a temperature that sweetens naturally without scalding. Latte art isn't just decoration; it's proof that texture and temperature are dialed in correctly.

Visit us on a slow morning and watch the ritual unfold behind the bar. Ask for a tasting flight of our seasonal single origins — we love sharing the story behind every cup.`,
    image: img("1561882468-9110e03e0f78"),
    author: "Marco Bellini",
    authorAvatar: avatar("1507003211169-0a1dd7228f2d"),
    date: "2026-06-01",
    readTime: 5,
    tags: ["coffee", "barista", "craft"],
  },
  {
    id: "b2",
    slug: "seasonal-pastry-menu",
    title: "Introducing Our Summer Pastry Menu",
    excerpt:
      "Lemon-thyme tarts, berry galettes, and honey-glazed brioche — baked fresh before sunrise every day.",
    content: `Summer at Solenne means lighter flavors and brighter colors in our pastry case. Pastry chef Amélie has crafted a menu that celebrates peak-season fruit: think lemon-thyme tarts with mascarpone cream and rustic galettes folded with local strawberries and rhubarb.

Every item is laminated, proofed, and baked in-house. We refuse frozen dough — the difference shows in the flake of our croissants and the tender crumb of our morning buns. Arrive before 9 AM for the fullest selection; our almond croissants rarely last past noon.

Pair your pastry with a iced lavender latte or a sparkling hibiscus tea. The combination is designed to slow you down, even on the busiest weekday.`,
    image: img("1555507036-ab1f40382040"),
    author: "Amélie Dubois",
    authorAvatar: avatar("1438761681033-6461ffad8d80"),
    date: "2026-05-18",
    readTime: 4,
    tags: ["bakery", "seasonal", "recipes"],
  },
  {
    id: "b3",
    slug: "sustainable-sourcing",
    title: "Why Sustainable Sourcing Matters to Us",
    excerpt:
      "From fair-trade coffee to local produce, learn how we build a menu that respects people and planet.",
    content: `Solenne Café opened with a simple promise: serve food we'd be proud to feed our own families. That means knowing where every ingredient comes from. Our coffee partners pay farmers above fair-trade minimums, and we visit origin farms at least once a year.

In the kitchen, chef Luca prioritizes regional suppliers for vegetables, dairy, and proteins. Shorter supply chains mean fresher plates and a smaller carbon footprint. We compost kitchen scraps and donate unsold baked goods to a nearby shelter every evening.

Transparency builds trust. Scan the QR code on our menu to see supplier profiles and seasonal sourcing maps. We're not perfect, but we're committed to getting better — one purchase order at a time.`,
    image: img("1542838132-92c53300491e"),
    author: "Luca Romano",
    authorAvatar: avatar("1472099645785-5658abf4ff4e"),
    date: "2026-04-30",
    readTime: 6,
    tags: ["sustainability", "community", "values"],
  },
  {
    id: "b4",
    slug: "perfect-brunch-guide",
    title: "The Perfect Solenne Brunch Guide",
    excerpt:
      "Our manager's curated picks for a leisurely weekend morning — coffee, plates, and patio seating included.",
    content: `Brunch is a ritual, not a race. Start with a Velvet Cappuccino or our house cold brew, then share the avocado toast with poached eggs and the shakshuka baked in cast iron. If you're hungry, add the truffle mushroom flatbread — it's become a weekend legend.

Request a table on the patio when the weather cooperates. We take reservations for parties of four or more, but walk-ins are always welcome before 11 AM. Bring a book, leave your laptop, and let the morning unfold.

Finish with a slice of our seasonal cake and a macchiato. That's the Solenne way to reset before the week ahead.`,
    image: img("1533089860892-a7c6f0a88666"),
    author: "Sarah Kim",
    authorAvatar: avatar("1544005313-94ddf0286df2"),
    date: "2026-03-22",
    readTime: 4,
    tags: ["brunch", "guide", "lifestyle"],
  },
  {
    id: "b5",
    slug: "behind-the-espresso-bar",
    title: "Behind the Espresso Bar: A Day in the Life",
    excerpt:
      "Follow our team from 5 AM prep to the last pull of the night — the rhythm of a working café.",
    content: `The alarm goes off at 4:30 AM for our opening barista. By 6 AM, the ovens are warming, the espresso machine is purged, and the first regulars are already at the counter. There's a choreography to it: grind, tamp, extract, steam, serve — repeat hundreds of times before close.

Mid-morning brings the brunch rush. Our front-of-house team coordinates with the kitchen on timing so hot food and hot coffee land together. Afternoons slow down enough for deep cleaning, recipe testing, and the occasional latte art throwdown among the staff.

Closing means counting the till, breaking down the bar, and setting up for tomorrow's bake. It's demanding work, but the regulars who become friends make every shift worthwhile.`,
    image: img("1511920170035-9088a238372c"),
    author: "Marco Bellini",
    authorAvatar: avatar("1507003211169-0a1dd7228f2d"),
    date: "2026-02-10",
    readTime: 5,
    tags: ["team", "coffee", "culture"],
  },
  {
    id: "b6",
    slug: "five-years-of-solenne",
    title: "Five Years of Solenne: A Milestone Reflection",
    excerpt:
      "Owner Elena shares the journey from a single espresso machine to a beloved neighborhood gathering place.",
    content: `When we unlocked the doors in 2018, Solenne was a 40-seat room with one espresso machine and a dream. We didn't know if anyone would show up. They did — first a trickle, then a line out the door on Saturday mornings.

Growth came carefully. We expanded the kitchen, added evening service, and hired people who shared our obsession with hospitality. Every milestone — our first anniversary party, the patio build-out, the regional best café award — felt like a collective achievement with our guests.

Looking ahead, we're planning a small roasting lab and more community events: cuppings, pasta workshops, and charity bake sales. Thank you for five incredible years. Here's to many more cups together.`,
    image: img("1554118811-1e0d58224f24"),
    author: "Elena Solenne",
    authorAvatar: avatar("1494790108377-be9c29b29330"),
    date: "2026-01-05",
    readTime: 7,
    tags: ["anniversary", "story", "community"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
