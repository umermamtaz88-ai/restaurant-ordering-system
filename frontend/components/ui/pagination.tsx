"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  pagination,
  onPageChange,
  className,
}: PaginationProps) {
  const { current_page, total_pages, total_items, has_next, has_previous } =
    pagination;

  if (total_pages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-2 py-3",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page {current_page} of {total_pages} ({total_items} items)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={!has_previous}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page + 1)}
          disabled={!has_next}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
