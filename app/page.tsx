"use client";

import { AnalogClock } from "@/components/analog-clock";
import { ClockSizeSelector, getClockSizeInPixels } from "@/components/clock-size-selector";
import { ClockSkinSelector } from "@/components/clock-skin-selector";
import { TimezoneSelector } from "@/components/timezone-selector";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { Trash2, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { TimeZoneInfo } from "@/lib/types/timezone";

export default function Home() {
  const {
    selectedTimezones,
    clockSize,
    setClockSize,
    clockSkin,
    setClockSkin,
    removeTimezone,
    reorderTimezones,
    isLoading,
    error,
  } = useTimezones();

  const [activeId, setActiveId] = useState<string | null>(null);
  const sizeInPixels = getClockSizeInPixels(clockSize);

  // Configure sensors with MouseSensor as primary (better for Electron)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = selectedTimezones.findIndex((tz) => tz.id === active.id);
      const newIndex = selectedTimezones.findIndex((tz) => tz.id === over.id);
      const newOrder = arrayMove(selectedTimezones, oldIndex, newIndex);
      reorderTimezones(newOrder.map((tz) => tz.id));
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

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
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <ClockSkinSelector
                value={clockSkin}
                onValueChange={setClockSkin}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={selectedTimezones.map((tz) => tz.id)}
              strategy={rectSortingStrategy}
            >
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
                  <ClockCard
                    key={tz.id}
                    timezone={tz}
                    cardStyling={cardStyling}
                    sizeInPixels={sizeInPixels}
                    removeTimezone={removeTimezone}
                    clockSkin={clockSkin}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeId ? (
                <ClockDragOverlay 
                  timezones={selectedTimezones}
                  cardStyling={cardStyling}
                  sizeInPixels={sizeInPixels}
                  activeId={activeId}
                  clockSkin={clockSkin}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>
    </div>
  );
}

/**
 * Clock Card Component Props
 */
interface ClockCardProps {
  timezone: TimeZoneInfo;
  cardStyling: {
    padding: string;
    rounded: string;
    gap: string;
  };
  sizeInPixels: number;
  removeTimezone: (id: string) => Promise<void>;
  clockSkin: import("@/lib/types/timezone").ClockSkin;
}

/**
 * ClockCard Component
 * 
 * Displays a single clock card with timezone information.
 * Integrates with the sortable system to enable drag-and-drop reordering.
 * 
 * Features:
 * - Drag handle for reordering
 * - DST (Daylight Saving Time) indicator
 * - Remove button
 * - Hover effects and animations
 * - Responsive design
 */
function ClockCard({
  timezone,
  cardStyling,
  sizeInPixels,
  removeTimezone,
  clockSkin,
}: ClockCardProps) {
  // Use dnd-kit sortable hook directly for better control
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: timezone.id });

  // Transform style for smooth drag animation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white dark:bg-gray-800 ${cardStyling.rounded} ${cardStyling.padding} shadow-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl ${
        isDragging ? "cursor-grabbing" : "hover:scale-105"
      }`}
    >
      {/* Drag Handle - Appears on hover */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white shadow-lg cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* DST Indicator - Shows when timezone is in daylight saving time */}
      {timezone.is_dst && (
        <div className="absolute top-2 left-14 z-10">
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

      {/* Remove Button - Appears on hover */}
      <button
        onClick={() => removeTimezone(timezone.id)}
        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg"
        title="Remove timezone"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Analog Clock Display */}
      <AnalogClock
        label={timezone.display_name || `${timezone.city}, ${timezone.country_name}`}
        timezone={timezone.timezone_id}
        size={sizeInPixels}
        skin={clockSkin}
      />
    </div>
  );
}

/**
 * ClockDragOverlay Component
 * 
 * Renders a preview of the clock being dragged.
 * This overlay follows the cursor during drag operations
 * and provides visual feedback to the user.
 */
interface ClockDragOverlayProps {
  timezones: TimeZoneInfo[];
  cardStyling: {
    padding: string;
    rounded: string;
    gap: string;
  };
  sizeInPixels: number;
  activeId: string;
  clockSkin: import("@/lib/types/timezone").ClockSkin;
}

function ClockDragOverlay({ 
  timezones, 
  cardStyling, 
  sizeInPixels,
  activeId,
  clockSkin
}: ClockDragOverlayProps) {
  // Find the timezone being dragged
  const activeTimezone = timezones.find((tz) => tz.id === activeId);

  if (!activeTimezone) return null;

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 ${cardStyling.rounded} ${cardStyling.padding} shadow-2xl border-2 border-blue-500`}
      style={{ opacity: 0.95 }}
    >
      <AnalogClock
        label={activeTimezone.display_name || `${activeTimezone.city}, ${activeTimezone.country_name}`}
        timezone={activeTimezone.timezone_id}
        size={sizeInPixels}
        skin={clockSkin}
      />
    </div>
  );
}
