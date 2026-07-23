import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { CAFE_INFO, ROUTES } from "@/constants/site";
import { achievements, teamMembers, timeline } from "@/data/team";
import { unsplash } from "@/utils/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind Solenne Café — our team, our coffee philosophy, and seven years of warm hospitality in Brooklyn.",
};

const HERO_IMAGE = unsplash("1554118811-1e0d58224f24", 960, 70);
const COFFEE_STORY_IMAGE = unsplash("1495474472287-4d71bcdd2085", 800, 70);
const CHEF_IMAGE = unsplash("1577219491135-ce391730fb2c", 720, 70);

const chefs = teamMembers.filter(
  (member) =>
    member.role.toLowerCase().includes("chef") ||
    member.role.toLowerCase().includes("barista")
);

export default function AboutPage() {
  return (
    <>
      <Container>
        <PageHeader
          title="Our Story"
          description="From a single espresso machine to a beloved neighborhood gathering place — this is Solenne."
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "About", href: ROUTES.about },
          ]}
        />
      </Container>

      <section className="relative overflow-hidden py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift">
                <Image
                  src={HERO_IMAGE}
                  alt="Warm interior of Solenne Café with natural light and plants"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <SectionTitle
                eyebrow="Since 2018"
                title="A quiet sanctuary for coffee lovers"
                description={CAFE_INFO.description}
              />
              <p className="mt-6 font-sans text-base leading-relaxed text-charcoal/70 dark:text-cream/70">
                Elena Solenne opened our doors with a simple promise: serve food and coffee
                we&apos;d be proud to share with our own families. What began as a 40-seat room
                on Maple Street has grown into an all-day destination — but the heart of Solenne
                remains unchanged. Every guest is welcomed like family, every cup pulled with
                intention.
              </p>
              <Button variant="secondary" className="mt-8 rounded-full" asChild>
                <Link href={ROUTES.menu}>
                  Explore our menu
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-latte/40 bg-cream/30 py-14 dark:border-latte/20 dark:bg-espresso/20 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle
              eyebrow="Milestones"
              title="Our Journey"
              description="Key moments that shaped who we are today."
              align="center"
            />
          </ScrollReveal>
          <div className="relative mt-12">
            <div
              className="absolute left-4 top-0 hidden h-full w-px bg-latte/60 md:left-1/2 md:block dark:bg-latte/30"
              aria-hidden="true"
            />
            <div className="space-y-10">
              {timeline.map((event, index) => (
                <ScrollReveal key={event.year} delay={index * 0.05}>
                  <div
                    className={`relative flex flex-col gap-4 md:w-1/2 ${
                      index % 2 === 0
                        ? "md:ml-0 md:pr-12 md:text-right"
                        : "md:ml-auto md:pl-12"
                    }`}
                  >
                    <span className="font-display text-2xl text-olive">{event.year}</span>
                    <h3 className="font-display text-xl text-espresso dark:text-cream">
                      {event.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-charcoal/70 dark:text-cream/70">
                      {event.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle
              eyebrow="By the numbers"
              title="Achievements"
              align="center"
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.06}>
                <div className="rounded-3xl border border-latte/40 bg-warm-white p-6 text-center shadow-soft dark:border-latte/20 dark:bg-charcoal">
                  <p className="font-display text-4xl text-olive">{item.value}</p>
                  <p className="mt-2 font-display text-lg text-espresso dark:text-cream">
                    {item.label}
                  </p>
                  <p className="mt-1 font-sans text-sm text-charcoal/60 dark:text-cream/60">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="overflow-hidden bg-espresso py-16 text-warm-white md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-olive/30 px-4 py-1.5 font-sans text-xs uppercase tracking-widest text-cream">
                <Coffee className="size-3.5" />
                Coffee Story
              </div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">
                From bean to cup, every step matters
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-cream/80">
                We partner with small farms in Ethiopia and Colombia, paying above fair-trade
                minimums and visiting origin at least once a year. Beans are roasted in
                micro-batches to preserve terroir — then dialed in daily by Marco and our bar
                team within a two-gram window.
              </p>
              <p className="mt-4 font-sans text-base leading-relaxed text-cream/80">
                Milk is steamed to a temperature that sweetens naturally. Latte art isn&apos;t
                decoration — it&apos;s proof that texture and timing are right. Ask for a tasting
                flight of our seasonal single origins; we love sharing the story behind every cup.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
                <Image
                  src={COFFEE_STORY_IMAGE}
                  alt="Barista pouring latte art into a ceramic cup"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle
              eyebrow="The kitchen"
              title="Meet Our Chefs & Baristas"
              description="The people behind every plate and every pour."
              align="center"
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {chefs.map((member, index) => (
              <ScrollReveal key={member.id} delay={index * 0.05}>
                <article className="group overflow-hidden rounded-3xl border border-latte/40 bg-card shadow-soft transition-transform hover:-translate-y-1 dark:border-latte/20">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-espresso dark:text-cream">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-sans text-sm font-medium text-olive">
                      {member.role}
                    </p>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70 dark:text-cream/70">
                      {member.bio}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-latte/40 bg-cream/30 py-14 dark:border-latte/20 dark:bg-espresso/20 md:py-20">
        <Container>
          <ScrollReveal>
            <SectionTitle
              eyebrow="Full team"
              title="The Solenne Family"
              description="Every shift, every smile — the team that makes it all happen."
              align="center"
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <ScrollReveal key={member.id} delay={index * 0.04}>
                <article className="flex gap-4 rounded-3xl border border-latte/40 bg-warm-white p-4 shadow-soft dark:border-latte/20 dark:bg-charcoal">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-espresso dark:text-cream">
                      {member.name}
                    </h3>
                    <p className="font-sans text-xs font-medium text-olive">{member.role}</p>
                    <p className="mt-2 line-clamp-3 font-sans text-xs leading-relaxed text-charcoal/70 dark:text-cream/70">
                      {member.bio}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-latte/30 lg:grid-cols-2 dark:bg-espresso/40">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
              <Image
                src={CHEF_IMAGE}
                alt="Chef preparing a dish in the Solenne kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <ScrollReveal className="p-8 lg:p-12">
              <h2 className="font-display text-2xl text-espresso dark:text-cream md:text-3xl">
                Visit us on Maple Street
              </h2>
              <p className="mt-4 font-sans text-base text-charcoal/70 dark:text-cream/70">
                {CAFE_INFO.address}, {CAFE_INFO.city}
              </p>
              <Button variant="secondary" className="mt-6 rounded-full" asChild>
                <Link href={ROUTES.reservation}>Book a table</Link>
              </Button>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
