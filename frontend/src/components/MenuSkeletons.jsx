import Skeleton from "./Skeleton";

export function CategoryNavSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

export function SearchBarSkeleton() {
  return <Skeleton className="h-11 w-full rounded-xl" />;
}

export function MenuCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-cream-200 bg-cream-50 p-5">
      <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-2/3" />
      <Skeleton className="mt-auto h-10 w-full rounded-xl" />
    </div>
  );
}

export function MenuGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <MenuCardSkeleton key={index} />
      ))}
    </div>
  );
}
