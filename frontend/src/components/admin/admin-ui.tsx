"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export function AdminModal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={cn(
          "max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#151b22] p-5 shadow-2xl",
          wide ? "max-w-2xl" : "max-w-lg",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block font-sans text-sm">
      <span className="mb-1.5 block text-white/60">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-white/15 bg-[#0f1419] px-3 py-2.5 font-sans text-sm text-white outline-none focus:border-olive";

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/5 font-sans text-xs uppercase tracking-wide text-white/50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
}
