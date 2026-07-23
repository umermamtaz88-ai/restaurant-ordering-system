import { cn } from "@/utils/cn";

export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("py-16 md:py-24 lg:py-28", className)}
      aria-hidden="true"
    >
      <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 rounded-full bg-latte/30" />
        <div className="mb-4 h-12 w-2/3 max-w-md rounded-2xl bg-latte/25" />
        <div className="h-64 rounded-3xl bg-latte/20" />
      </div>
    </div>
  );
}
