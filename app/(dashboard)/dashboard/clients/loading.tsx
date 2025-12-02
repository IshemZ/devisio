export default function ClientsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-foreground/10" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-foreground/10" />

      {/* Table skeleton */}
      <div className="rounded-lg border border-border bg-card">
        {/* Table header */}
        <div className="border-b border-border p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-4 w-20 animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-24 animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-28 animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-foreground/10" />
          </div>
        </div>

        {/* Table rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-border p-4 last:border-0">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-foreground/10" />
              <div className="h-4 w-40 animate-pulse rounded bg-foreground/10" />
              <div className="h-4 w-36 animate-pulse rounded bg-foreground/10" />
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-foreground/10" />
                <div className="h-8 w-8 animate-pulse rounded bg-foreground/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
