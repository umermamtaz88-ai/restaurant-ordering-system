import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ROUTES, CAFE_INFO } from "@/constants/site";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        description="The terms governing your use of Solenne Café services."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Terms of Service" },
        ]}
      />
      <Container size="narrow" className="py-10 sm:py-14">
        <article className="prose-cafe space-y-6 font-sans text-sm leading-relaxed text-charcoal/80 dark:text-cream/80">
          <p className="text-base text-charcoal dark:text-cream">
            Last updated: July 2026
          </p>
          <p>
            By using the {CAFE_INFO.name} website and placing orders through our
            platform, you agree to these Terms of Service. Please read them
            carefully before creating an account or completing a purchase.
          </p>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              Orders &amp; fulfillment
            </h2>
            <p>
              All orders are subject to availability. We reserve the right to
              modify menu items, pricing, and delivery areas. Estimated pickup
              and delivery times are provided in good faith but may vary during
              peak hours.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              Payments &amp; refunds
            </h2>
            <p>
              Prices displayed include applicable taxes at checkout. Refunds for
              incorrect or unsatisfactory orders may be issued at our discretion.
              Contact us within 24 hours of receiving your order to report an
              issue.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              Account responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity under your account. Notify
              us immediately if you suspect unauthorized access.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-espresso dark:text-cream">
              Contact
            </h2>
            <p>
              Questions about these terms? Email{" "}
              <a
                href={`mailto:${CAFE_INFO.email}`}
                className="font-medium text-olive underline-offset-2 hover:underline"
              >
                {CAFE_INFO.email}
              </a>{" "}
              or visit us at {CAFE_INFO.address}, {CAFE_INFO.city}.
            </p>
          </section>
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
