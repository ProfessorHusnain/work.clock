"use client";

import { AnalogClock } from "@/components/analog-clock";
import { ClockSizeSelector, getClockSizeInPixels } from "@/components/clock-size-selector";
import { TimezoneSelector } from "@/components/timezone-selector";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {
    selectedTimezones,
    clockSize,
    setClockSize,
    removeTimezone,
    isLoading,
    error,
  } = useTimezones();

  const sizeInPixels = getClockSizeInPixels(clockSize);

  // Get card styling based on size
  const getCardStyling = () => {
    switch (clockSize) {
      case "extra-small":
        return {
          padding: "p-3",
          rounded: "rounded-lg",
          gap: "gap-4",
        };
      case "small":
        return {
          padding: "p-4",
          rounded: "rounded-xl",
          gap: "gap-6",
        };
      case "large":
        return {
          padding: "p-6",
          rounded: "rounded-2xl",
          gap: "gap-8",
        };
    }
  };

  const cardStyling = getCardStyling();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading world clocks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-gray-900 dark:to-black pt-24 px-8 pb-12">
      <main className="container mx-auto max-w-7xl py-12">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            World Clock
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Track time across different timezones around the world
          </p>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <ClockSizeSelector
                value={clockSize}
                onValueChange={setClockSize}
              />
            </div>
            
            <TimezoneSelector />
          </div>
        </div>

        {/* Clocks Grid */}
        {selectedTimezones.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              No timezones selected. Click "Add Timezone" to get started!
            </p>
          </div>
        ) : (
          <div
            className={`grid ${cardStyling.gap} ${
              clockSize === "extra-small"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                : clockSize === "small"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {selectedTimezones.map((tz) => (
              <div
                key={tz.id}
                className={`relative group bg-white dark:bg-gray-800 ${cardStyling.rounded} ${cardStyling.padding} shadow-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl hover:scale-105`}
              >
                {/* DST Indicator */}
                {tz.is_dst && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500 text-white text-xs font-semibold shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      DST
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeTimezone(tz.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg z-10"
                  title="Remove timezone"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <AnalogClock
                  label={tz.display_name || `${tz.city}, ${tz.country_name}`}
                  timezone={tz.timezone_id}
                  size={sizeInPixels}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
