import { Loading } from "@/components/ui/loading";

export default function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-20">
      <Loading label="Loading…" />
    </div>
  );
}
