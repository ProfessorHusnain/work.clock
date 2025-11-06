"use client";

import { useState } from "react";
import { AnalogClock } from "@/components/analog-clock";
import {
  ClockSizeSelector,
  type ClockSize,
  getClockSizeInPixels,
} from "@/components/clock-size-selector";

export default function Home() {
  const [clockSize, setClockSize] = useState<ClockSize>("large");
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

  // Define all world clocks
  const worldClocks = [
    { label: "Local Time", timezone: undefined },
    { label: "New York", timezone: "America/New_York" },
    { label: "London", timezone: "Europe/London" },
    { label: "Tokyo", timezone: "Asia/Tokyo" },
    { label: "Sydney", timezone: "Australia/Sydney" },
    { label: "Dubai", timezone: "Asia/Dubai" },
  ];

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

          {/* Size Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <ClockSizeSelector
                value={clockSize}
                onValueChange={setClockSize}
              />
            </div>
          </div>
        </div>

        {/* Clocks Grid */}
        <div
          className={`grid ${cardStyling.gap} ${
            clockSize === "extra-small"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              : clockSize === "small"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {worldClocks.map((clock) => (
            <div
              key={clock.label}
              className={`bg-white dark:bg-gray-800 ${cardStyling.rounded} ${cardStyling.padding} shadow-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl hover:scale-105`}
            >
              <AnalogClock
                label={clock.label}
                timezone={clock.timezone}
                size={sizeInPixels}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
