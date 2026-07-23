"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Scrolls to #book-table when hash or ?book=1 is present. */
export function HashScroll() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const wantsBook =
      window.location.hash === "#book-table" || searchParams.get("book") === "1";
    if (!wantsBook) return;

    const scrollToBook = () => {
      const el = document.getElementById("book-table");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const frame = window.requestAnimationFrame(scrollToBook);
    const timer = window.setTimeout(scrollToBook, 150);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [searchParams]);

  return null;
}
