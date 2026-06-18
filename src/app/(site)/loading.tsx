export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-bg-secondary rounded-2xl mb-8" />

      {/* Grid skeleton — matches product card aspect to keep CLS low */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="aspect-square bg-bg-secondary" />
            <div className="p-4 space-y-2.5">
              <div className="h-2.5 bg-bg-secondary rounded w-1/3" />
              <div className="h-3.5 bg-bg-secondary rounded w-3/4" />
              <div className="h-5 bg-bg-secondary rounded w-1/2 mt-1" />
              <div className="h-9 bg-bg-secondary rounded-xl w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
