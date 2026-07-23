"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  showEdges?: boolean;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblingCount * 2), "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      "ellipsis",
      ...range(totalPages - (2 + siblingCount * 2), totalPages),
    ];
  }

  return [
    1,
    "ellipsis",
    ...range(leftSibling, rightSibling),
    "ellipsis",
    totalPages,
  ];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  showEdges = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  const buttonBase =
    "inline-flex size-9 items-center justify-center rounded-lg font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {showEdges && (
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            buttonBase,
            "text-charcoal hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
          )}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
      )}

      <ul className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`}>
                <span
                  className="inline-flex size-9 items-center justify-center text-charcoal/40 dark:text-cream/40"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="size-4" />
                </span>
              </li>
            );
          }

          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                aria-label={`Page ${page}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={cn(
                  buttonBase,
                  isActive
                    ? "bg-olive text-warm-white"
                    : "text-charcoal hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
                )}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>

      {showEdges && (
        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            buttonBase,
            "text-charcoal hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
          )}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </nav>
  );
}
