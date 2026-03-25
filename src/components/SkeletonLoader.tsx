export default function SkeletonLoader() {
  return (
    <div className="space-y-5">
      <section className="space-y-4 border-b border-brand-gray-200 pb-4">
        <div className="h-4 w-24 animate-pulse rounded-lg bg-brand-gray-100" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="h-10 w-20 animate-pulse rounded-lg bg-brand-gray-100" />
            <div className="h-32 w-32 animate-pulse rounded-full bg-brand-gray-100" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-20 animate-pulse rounded-lg bg-brand-gray-100" />
            <div className="h-28 w-full animate-pulse rounded-lg bg-brand-gray-100" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-20 animate-pulse rounded-lg bg-brand-gray-100" />
            <div className="h-10 w-20 animate-pulse rounded-lg bg-brand-gray-100" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded-lg bg-brand-gray-100" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 w-full animate-pulse rounded-lg bg-brand-gray-100" />
          ))}
        </div>
      </section>
    </div>
  );
}
