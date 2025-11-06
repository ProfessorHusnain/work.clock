"use client";

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {TimeZoneInfo, UserPreferences, UserTimezonePreference} from "../types/timezone";
import {storageService} from "../services/storage-service";
import {type ClockSize} from "@/components/clock-size-selector";

interface TimezoneContextValue {
  // Timezone data
  availableTimezones: TimeZoneInfo[];
  selectedTimezones: TimeZoneInfo[];
  
  // User preferences
  clockSize: ClockSize;
  setClockSize: (size: ClockSize) => void;
  
  // Actions
  addTimezone: (timezoneId: string) => Promise<void>;
  removeTimezone: (timezoneId: string) => Promise<void>;
  reorderTimezones: (timezoneIds: string[]) => Promise<void>;
  searchTimezones: (query: string) => TimeZoneInfo[];
  downloadMoreTimezones: () => Promise<number>; // Returns count of new timezones
  
  // State
  isLoading: boolean;
  error: string | null;
}

const TimezoneContext = createContext<TimezoneContextValue | undefined>(undefined);

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [availableTimezones, setAvailableTimezones] = useState<TimeZoneInfo[]>([]);
  const [selectedTimezones, setSelectedTimezones] = useState<TimeZoneInfo[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [timezones, preferences] = await Promise.all([
        storageService.getTimezoneData(),
        storageService.getUserPreferences(),
      ]);

      setAvailableTimezones(timezones);
      setUserPreferences(preferences);

      // Load selected timezones
      const selected = preferences.selected_timezones
        .sort((a, b) => a.order - b.order)
        .map((pref) => {
            return timezones.find((t) => t.id === pref.timezone_id);
        })
        .filter(Boolean) as TimeZoneInfo[];

      setSelectedTimezones(selected);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading timezone data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (prefs: UserPreferences) => {
    await storageService.saveUserPreferences(prefs);
    setUserPreferences(prefs);
  };

  const setClockSize = async (size: ClockSize) => {
    if (!userPreferences) return;
    const updated = { ...userPreferences, clock_size: size };
    await savePreferences(updated);
  };

  const addTimezone = async (timezoneId: string) => {
    if (!userPreferences) return;

    const timezone = availableTimezones.find((tz) => tz.id === timezoneId);
    if (!timezone) {
      throw new Error("Timezone not found");
    }

    // Check if already selected
    if (userPreferences.selected_timezones.some((tz) => tz.timezone_id === timezoneId)) {
      return; // Already selected
    }

    const newPref: UserTimezonePreference = {
      timezone_id: timezoneId,
      order: userPreferences.selected_timezones.length,
      added_at: new Date().toISOString(),
    };

    const updated = {
      ...userPreferences,
      selected_timezones: [...userPreferences.selected_timezones, newPref],
    };

    await savePreferences(updated);
    setSelectedTimezones([...selectedTimezones, timezone]);
  };

  const removeTimezone = async (timezoneId: string) => {
    if (!userPreferences) return;

    const updated = {
      ...userPreferences,
      selected_timezones: userPreferences.selected_timezones
        .filter((tz) => tz.timezone_id !== timezoneId)
        .map((tz, index) => ({ ...tz, order: index })), // Reindex
    };

    await savePreferences(updated);
    setSelectedTimezones(selectedTimezones.filter((tz) => tz.id !== timezoneId));
  };

  const reorderTimezones = async (timezoneIds: string[]) => {
    if (!userPreferences) return;

    const reordered = timezoneIds.map((id, index) => {
      const existing = userPreferences.selected_timezones.find(
        (tz) => tz.timezone_id === id
      );
      return existing ? { ...existing, order: index } : null;
    }).filter(Boolean) as UserTimezonePreference[];

    const updated = { ...userPreferences, selected_timezones: reordered };
    await savePreferences(updated);

    // Reorder selected timezones
    const reorderedSelected = timezoneIds
      .map((id) => selectedTimezones.find((tz) => tz.id === id))
      .filter(Boolean) as TimeZoneInfo[];
    
    setSelectedTimezones(reorderedSelected);
  };

  const searchTimezones = (query: string): TimeZoneInfo[] => {
    if (!query.trim()) return availableTimezones;

    const lowerQuery = query.toLowerCase();
    return availableTimezones.filter(
      (tz) =>
        tz.city.toLowerCase().includes(lowerQuery) ||
        tz.country_name.toLowerCase().includes(lowerQuery) ||
        tz.timezone_id.toLowerCase().includes(lowerQuery) ||
        tz.display_name?.toLowerCase().includes(lowerQuery) ||
        tz.aliases?.some((alias) => alias.toLowerCase().includes(lowerQuery))
    );
  };

  const downloadMoreTimezones = async (): Promise<number> => {
    try {
      const { timezoneApiService } = await import("../services/timezone-api");
      const newTimezones = await timezoneApiService.fetchAllTimezones();
      
      // Filter out timezones we already have
      const existingIds = new Set(availableTimezones.map((tz) => tz.id));
      const toAdd = newTimezones.filter((tz) => !existingIds.has(tz.id));
      
      if (toAdd.length > 0) {
        const updated = [...availableTimezones, ...toAdd];
        await storageService.saveTimezoneData(updated);
        setAvailableTimezones(updated);
      }
      
      return toAdd.length;
    } catch (error) {
      console.error("Error downloading timezones:", error);
      throw error;
    }
  };

  const value: TimezoneContextValue = {
    availableTimezones,
    selectedTimezones,
    clockSize: userPreferences?.clock_size || "large",
    setClockSize,
    addTimezone,
    removeTimezone,
    reorderTimezones,
    searchTimezones,
    downloadMoreTimezones,
    isLoading,
    error,
  };

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezones() {
  const context = useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error("useTimezones must be used within a TimezoneProvider");
  }
  return context;
}

