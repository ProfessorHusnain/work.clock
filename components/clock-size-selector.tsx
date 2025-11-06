"use client";

import { Maximize2, Minimize2, Circle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ClockSize = "extra-small" | "small" | "large";

interface ClockSizeSelectorProps {
  value: ClockSize;
  onValueChange: (value: ClockSize) => void;
}

export function ClockSizeSelector({
  value,
  onValueChange,
}: ClockSizeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">
        Clock Size
      </Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => {
          if (val) onValueChange(val as ClockSize);
        }}
        className="bg-gray-200 dark:bg-gray-700"
      >
        <ToggleGroupItem
          value="extra-small"
          aria-label="Extra Small"
          className="gap-2"
        >
          <Circle className="h-3 w-3" />
          <span>Extra Small</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="small" aria-label="Small" className="gap-2">
          <Minimize2 className="h-4 w-4" />
          <span>Small</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="large" aria-label="Large" className="gap-2">
          <Maximize2 className="h-4 w-4" />
          <span>Large</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

// Helper function to get size in pixels
export function getClockSizeInPixels(size: ClockSize): number {
  switch (size) {
    case "extra-small":
      return 140;
    case "small":
      return 200;
    case "large":
      return 280;
  }
}

