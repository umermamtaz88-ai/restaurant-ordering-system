import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Solenne café admin panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
