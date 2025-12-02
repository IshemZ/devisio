export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Welcome header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-foreground/10" />
        <div className="h-4 w-96 animate-pulse rounded bg-foreground/10" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-foreground/10" />
                <div className="h-8 w-16 animate-pulse rounded bg-foreground/10" />
              </div>
              <div className="h-12 w-12 animate-pulse rounded-full bg-foreground/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts section skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-foreground/10" />
            <div className="h-64 w-full animate-pulse rounded bg-foreground/10" />
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <div className="h-6 w-40 animate-pulse rounded bg-foreground/10" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-foreground/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-foreground/10" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-3">
              <div className="h-12 w-12 animate-pulse rounded bg-foreground/10" />
              <div className="h-5 w-32 animate-pulse rounded bg-foreground/10" />
              <div className="h-3 w-full animate-pulse rounded bg-foreground/10" />
              <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
