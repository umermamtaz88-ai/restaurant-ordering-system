import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CAFE_INFO, ROUTES, SITE_NAME } from "@/constants/site";
import { Container } from "@/components/shared/container";
import { NewsletterForm } from "@/components/sections/newsletter-form";

const QUICK_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.gallery, label: "Gallery" },
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.testimonials, label: "Testimonials" },
  { href: ROUTES.contact, label: "Contact" },
  { href: ROUTES.reservation, label: "Book a Table" },
];

const MENU_LINKS = [
  { href: `${ROUTES.menu}?category=latte`, label: "Coffee & Espresso" },
  { href: `${ROUTES.menu}?category=breakfast`, label: "Breakfast" },
  { href: `${ROUTES.menu}?category=pasta`, label: "Lunch Plates" },
  { href: `${ROUTES.menu}?category=desserts`, label: "Desserts" },
  { href: `${ROUTES.menu}?category=bakery`, label: "Bakery" },
  { href: ROUTES.menu, label: "Full Menu" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-espresso text-cream">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <Link
              href={ROUTES.home}
              className="font-display text-3xl text-warm-white transition-opacity hover:opacity-90"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-cream/75">
              {CAFE_INFO.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href={CAFE_INFO.social.instagram} label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href={CAFE_INFO.social.facebook} label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href={CAFE_INFO.social.twitter} label="X (Twitter)">
                <XIcon />
              </SocialLink>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-warm-white">Quick Links</h2>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/75 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg text-warm-white">Menu</h2>
            <ul className="mt-4 space-y-2.5">
              {MENU_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/75 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 font-display text-lg text-warm-white">Hours</h2>
            <ul className="mt-3 space-y-1.5 font-sans text-sm text-cream/75">
              {CAFE_INFO.openingHours.slice(0, 3).map((row) => (
                <li key={row.day} className="flex justify-between gap-4">
                  <span>{row.day}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.contact}
                  className="text-olive-muted transition-colors hover:text-warm-white"
                >
                  See all hours
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg text-warm-white">Contact</h2>
            <ul className="mt-4 space-y-3 font-sans text-sm text-cream/75">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-olive-muted" aria-hidden="true" />
                <span>
                  {CAFE_INFO.address}
                  <br />
                  {CAFE_INFO.city}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${CAFE_INFO.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-warm-white"
                >
                  <Phone className="size-4 text-olive-muted" aria-hidden="true" />
                  {CAFE_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CAFE_INFO.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-warm-white"
                >
                  <Mail className="size-4 text-olive-muted" aria-hidden="true" />
                  {CAFE_INFO.email}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h2 className="font-display text-lg text-warm-white">Newsletter</h2>
              <p className="mt-2 font-sans text-sm text-cream/70">
                Seasonal menus and quiet invitations.
              </p>
              <div className="mt-4 [&_input]:border-cream/20 [&_input]:bg-warm-white/10 [&_input]:text-warm-white [&_input]:placeholder:text-cream/50">
                <NewsletterForm compact />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-warm-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-cream/60">
            © {year} {SITE_NAME} Café. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-sm">
            <Link
              href={ROUTES.privacy}
              className="text-cream/60 transition-colors hover:text-warm-white"
            >
              Privacy
            </Link>
            <Link
              href={ROUTES.terms}
              className="text-cream/60 transition-colors hover:text-warm-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full border border-warm-white/15 text-cream/80 transition-colors hover:border-olive-muted hover:text-warm-white"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M17.7 3H20l-6.4 7.3L21 21h-5.2l-4.1-5.4L7 21H4.7l6.8-7.8L3 3h5.3l3.7 4.9L17.7 3Zm-1.8 16.2h1.4L8.2 4.7H6.7l9.2 14.5Z" />
    </svg>
  );
}
