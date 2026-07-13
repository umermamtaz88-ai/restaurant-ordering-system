"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorState
        title="Something went wrong"
        message={error.message || "An unexpected error occurred."}
        onRetry={reset}
      />
    </div>
  );
}
