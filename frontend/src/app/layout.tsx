import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/providers";
import { SiteShell } from "@/components/layout/site-shell";
import { CAFE_INFO, SITE_NAME, SITE_TAGLINE } from "@/constants/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} Café`,
    template: `%s | ${SITE_NAME} Café`,
  },
  description: CAFE_INFO.description,
  openGraph: {
    title: `${SITE_NAME} Café`,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${outfit.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
