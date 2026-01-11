export default function LoadingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start justify-items-center p-8">
      <div className="flex w-full flex-row items-center gap-8 sm:items-start">
        {/* Sidebar skeleton */}
        <div className="w-1/4 animate-pulse space-y-4">
          <div className="h-10 rounded bg-muted"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="h-8 rounded bg-muted"></div>
            ))}
          </div>
        </div>

        {/* GTA Map skeleton */}
        <div className="w-3/4 animate-pulse">
          <div className="aspect-square rounded-md bg-accent"></div>
        </div>
      </div>
    </div>
  );
}
