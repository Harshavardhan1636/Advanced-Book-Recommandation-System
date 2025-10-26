'use client';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

export function SearchLoader() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardLoader() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" style={{ height: '150px' }} />
        ))}
      </div>
      <div className="p-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" style={{ height: '300px' }} />
    </div>
  );
}

export function ChartLoader() {
  return (
    <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4 animate-pulse" />
      <div className="h-80 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
    </div>
  );
}
