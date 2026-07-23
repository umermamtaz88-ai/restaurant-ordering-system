import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blog";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories from Solenne Café — coffee craft, seasonal menus, sustainability, and café culture.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Container>
        <PageHeader
          title="Journal"
          description="Notes from our bar, kitchen, and community — recipes, rituals, and the Solenne story."
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Blog", href: ROUTES.blog },
          ]}
        />
      </Container>

      <section className="py-10 md:py-14">
        <Container>
          {featured ? (
            <ScrollReveal>
              <Link
                href={`${ROUTES.blog}/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-latte/40 bg-card shadow-soft transition-transform hover:-translate-y-1 dark:border-latte/20 lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-olive">
                    Featured
                  </span>
                  <h2 className="mt-3 font-display text-2xl text-espresso transition-colors group-hover:text-olive dark:text-cream md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 font-sans text-base leading-relaxed text-charcoal/70 dark:text-cream/70">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 font-sans text-sm text-charcoal/60 dark:text-cream/60">
                    <span>{featured.author}</span>
                    <span>{formatDate(featured.date)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {featured.readTime} min read
                    </span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 font-sans text-sm font-medium text-olive">
                    Read article
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ) : null}

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.05}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-latte/40 bg-card shadow-soft transition-transform hover:-translate-y-1 dark:border-latte/20">
                  <Link
                    href={`${ROUTES.blog}/${post.slug}`}
                    className="relative aspect-[16/10] overflow-hidden"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`${ROUTES.blog}/${post.slug}`}>
                      <h2 className="mt-3 font-display text-xl text-espresso transition-colors group-hover:text-olive dark:text-cream">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-2 line-clamp-3 flex-1 font-sans text-sm leading-relaxed text-charcoal/70 dark:text-cream/70">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between font-sans text-xs text-charcoal/50 dark:text-cream/50">
                      <span>{formatDate(post.date)}</span>
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
