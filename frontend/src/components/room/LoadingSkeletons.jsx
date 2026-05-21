import React from 'react';

export const CardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="aspect-[4/3] bg-gray-200 w-full" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-5 bg-gray-200 rounded-md w-3/4" />
      <div className="h-4 bg-gray-200 rounded-md w-1/2" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded-md w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded-md w-16" />
      </div>
    </div>
  </div>
);

export const DetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="w-full h-8 bg-gray-200 rounded-md mb-6 max-w-lg" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="w-full aspect-video bg-gray-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full" />
          <div className="h-4 bg-gray-200 rounded-md w-5/6" />
          <div className="h-4 bg-gray-200 rounded-md w-4/6" />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="w-full h-80 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  </div>
);
