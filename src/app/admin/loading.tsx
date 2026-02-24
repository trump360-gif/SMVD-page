export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Skeleton header */}
      <header className="bg-white shadow">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-2" />
            </div>
            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      {/* Skeleton content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab skeleton */}
          <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
            <div className="flex-1 h-11 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 h-11 bg-gray-100 rounded-lg animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Preview skeleton */}
        <div className="hidden lg:flex lg:w-1/2 bg-white border-l border-gray-200 flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse mt-1" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </div>
      </main>
    </div>
  );
}
