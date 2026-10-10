export const RoommateCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between animate-pulse">
      <div>
        {/* Top Header: Avatar + Compatibility Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded-md" />
              <div className="h-4 w-20 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="h-7 w-24 bg-gray-200 rounded-full" />
        </div>

        {/* Location */}
        <div className="h-4 w-40 bg-gray-200 rounded-md mb-3" />

        {/* Bio lines */}
        <div className="space-y-2 mb-5">
          <div className="h-3.5 w-full bg-gray-200 rounded-md" />
          <div className="h-3.5 w-4/5 bg-gray-200 rounded-md" />
        </div>

        {/* Lifestyle Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-28 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-100">
        <div className="h-10 w-full bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

export const RoommateGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RoommateCardSkeleton key={i} />
      ))}
    </div>
  );
};
