"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Clock Card Skeleton Component
 * 
 * A loading skeleton that matches the size and layout of clock cards.
 * Provides visual feedback during loading states.
 * 
 * @param size - Clock size preset (extra-small, small, large)
 */
interface ClockSkeletonProps {
  size?: "extra-small" | "small" | "large";
}

export function ClockSkeleton({ size = "large" }: ClockSkeletonProps) {
  // Match the sizing from getClockSizeInPixels
  const dimensions = {
    "extra-small": { clock: 120, gap: 8 },
    small: { clock: 180, gap: 12 },
    large: { clock: 280, gap: 16 },
  };

  const { clock: clockSize, gap } = dimensions[size];

  // Calculate card styling based on size
  const cardStyling = {
    "extra-small": {
      padding: "p-3",
      rounded: "rounded-lg",
    },
    small: {
      padding: "p-4",
      rounded: "rounded-xl",
    },
    large: {
      padding: "p-6",
      rounded: "rounded-2xl",
    },
  };

  const styling = cardStyling[size];

  return (
    <div
      className={`bg-white dark:bg-gray-800 ${styling.rounded} ${styling.padding} shadow-xl border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex flex-col items-center" style={{ gap: `${gap}px` }}>
        {/* Label Skeleton */}
        <Skeleton className="h-6 w-32 rounded" />

        {/* Clock Face Skeleton - Circular */}
        <Skeleton
          className="rounded-full"
          style={{
            width: `${clockSize}px`,
            height: `${clockSize}px`,
          }}
        />

        {/* Digital Time Skeleton */}
        <Skeleton className="h-7 w-28 rounded" />

        {/* Timezone Name Skeleton */}
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>
  );
}

/**
 * Clock Grid Skeleton Component
 * 
 * Displays a grid of clock skeletons matching the app's responsive layout.
 * Shows different number of skeletons based on size.
 * 
 * @param count - Number of skeleton clocks to display
 * @param size - Clock size preset
 */
interface ClockGridSkeletonProps {
  count?: number;
  size?: "extra-small" | "small" | "large";
}

export function ClockGridSkeleton({
  count = 6,
  size = "large",
}: ClockGridSkeletonProps) {
  // Match the grid classes from main page
  const gridClasses = {
    "extra-small": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
    small: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    large: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  const gapClasses = {
    "extra-small": "gap-4",
    small: "gap-6",
    large: "gap-8",
  };

  return (
    <div className={`grid ${gridClasses[size]} ${gapClasses[size]}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ClockSkeleton key={index} size={size} />
      ))}
    </div>
  );
}

/**
 * Timezone Selector Skeleton Component
 * 
 * Skeleton loader for the timezone selector dropdown.
 */
export function TimezoneSelectorSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-10 w-64 rounded-lg" />
    </div>
  );
}

/**
 * Header Skeleton Component
 * 
 * Skeleton loader for the app header.
 */
export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-8 bg-gray-200 dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Skeleton className="h-8 w-40 rounded" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </header>
  );
}

/**
 * Page Loading Skeleton Component
 * 
 * Full page skeleton that matches the app layout.
 * Use this for initial page load.
 */
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderSkeleton />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title and Description Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4 rounded" />
            <Skeleton className="h-6 w-96 mx-auto rounded" />
          </div>

          {/* Controls Skeleton */}
          <div className="flex justify-center items-center mb-12">
            <TimezoneSelectorSkeleton />
          </div>

          {/* Clocks Grid Skeleton */}
          <ClockGridSkeleton count={6} size="large" />
        </div>
      </main>
    </div>
  );
}

/**
 * Settings Menu Skeleton Component
 * 
 * Skeleton for settings drawer content.
 */
export function SettingsMenuSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

