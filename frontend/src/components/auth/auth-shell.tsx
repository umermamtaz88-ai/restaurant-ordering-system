import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";
import { unsplash } from "@/utils/images";

const CAFE_IMAGE = unsplash("1495474472287-4d71bcdd2085", 900, 70);

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:min-h-[calc(100vh-4.25rem)] lg:flex-row">
      <div className="relative hidden min-h-[320px] lg:flex lg:w-1/2 lg:min-h-0">
        <Image
          src={CAFE_IMAGE}
          alt="Warm café interior with coffee and pastries"
          fill
          className="object-cover"
          priority
          quality={70}
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/35 to-espresso/10" />
        <div className="relative z-10 flex flex-col justify-end p-10 xl:p-14">
          <Link
            href="/"
            className="font-display text-3xl text-warm-white transition-opacity hover:opacity-90 xl:text-4xl"
          >
            {SITE_NAME}
          </Link>
          <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-cream/90 xl:text-lg">
            {SITE_TAGLINE}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-warm-white px-4 py-10 dark:bg-charcoal sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-espresso dark:text-cream">
            {title}
          </h1>
          <p className="mt-2 font-sans text-sm text-charcoal/70 dark:text-cream/70">
            {subtitle}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
