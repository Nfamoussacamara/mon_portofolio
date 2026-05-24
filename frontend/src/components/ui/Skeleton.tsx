export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-white/5 rounded-md ${className}`} />
  );
};

export const ProjectSkeleton = () => {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-white/2 dark:bg-white/[0.02] p-0 h-[400px]">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
};
