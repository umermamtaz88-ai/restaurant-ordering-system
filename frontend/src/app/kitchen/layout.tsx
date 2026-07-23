import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitchen",
  description: "Live order queue for Solenne kitchen staff.",
};

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1410] text-cream">{children}</div>
  );
}
