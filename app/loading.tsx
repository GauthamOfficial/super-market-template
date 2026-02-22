export default function RootLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="h-10 w-64 rounded-md bg-muted animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
