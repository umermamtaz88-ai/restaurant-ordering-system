import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ROUTES, CAFE_INFO } from "@/constants/site";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="How Solenne Café handles your information."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Privacy Policy" },
        ]}
      />
      <Container size="narrow" className="py-10 sm:py-14">
        <article className="prose-cafe space-y-6 font-sans text-sm leading-relaxed text-charcoal/80 dark:text-cream/80">
          <p className="text-base text-charcoal dark:text-cream">
            Last updated: July 2026
          </p>
          <p>
            {CAFE_INFO.name} respects your privacy. This policy describes what
            information we may collect when you browse our website, place
            orders, or create an account — and how we use it to provide our
            services.
          </p>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              Information we collect
            </h2>
            <p>
              We may collect your name, email address, phone number, delivery
              details, and order history when you use our ordering features.
              Payment information is processed securely by our payment partners
              and is not stored on our servers.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              How we use your data
            </h2>
            <p>
              Your information helps us fulfill orders, send confirmations,
              improve our menu and service, and — with your consent — share
              occasional updates about seasonal offerings and events.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              Your choices
            </h2>
            <p>
              You may request access to or deletion of your personal data by
              contacting us at{" "}
              <a
                href={`mailto:${CAFE_INFO.email}`}
                className="font-medium text-olive underline-offset-2 hover:underline"
              >
                {CAFE_INFO.email}
              </a>
              . You can unsubscribe from marketing emails at any time.
            </p>
          </section>
          <p>
            For questions about this policy, reach us at {CAFE_INFO.address},{" "}
            {CAFE_INFO.city}, or call {CAFE_INFO.phone}.
          </p>
          <p>
            <Link
              href={ROUTES.home}
              className="font-medium text-olive underline-offset-2 hover:underline"
            >
              Return to home
            </Link>
          </p>
        </article>
      </Container>
    </>
  );
}
