import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, getPostBySlug } from "@/data/blog";
import { ROUTES } from "@/constants/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <>
      <article>
        <div className="relative aspect-[21/9] min-h-[240px] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/30 to-transparent" />
        </div>

        <Container className="py-10 md:py-14">
          <Button variant="ghost" size="sm" className="mb-6 rounded-full" asChild>
            <Link href={ROUTES.blog}>
              <ArrowLeft className="size-4" />
              Back to journal
            </Link>
          </Button>

          <ScrollReveal>
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="olive">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold text-espresso dark:text-cream md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-latte/40 pb-8 dark:border-latte/20">
                <div className="relative size-12 overflow-hidden rounded-full">
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-espresso dark:text-cream">
                    {post.author}
                  </p>
                  <p className="font-sans text-xs text-charcoal/60 dark:text-cream/60">
                    {formatDate(post.date)} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readTime} min read
                    </span>
                  </p>
                </div>
              </div>

              <div className="prose-cafe mt-8 space-y-6">
                {paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="font-sans text-base leading-relaxed text-charcoal/80 dark:text-cream/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </article>
    </>
  );
}
