export interface TimeZoneInfo {
  id: string; // Unique identifier
  region: string; // e.g., "America", "Europe", "Asia"
  city: string; // e.g., "New_York", "London", "Tokyo"
  timezone_id: string; // IANA timezone ID e.g., "America/New_York"
  country_code: string; // ISO 3166-1 alpha-2 code e.g., "US", "GB"
  country_name: string; // Full country name
  utc_offset: string; // e.g., "+05:00", "-08:00"
  utc_offset_minutes: number; // Offset in minutes from UTC
  is_dst: boolean; // Whether currently observing daylight saving time
  current_time?: string; // ISO 8601, computed at runtime
  latitude?: number; // Geographic coordinates
  longitude?: number;
  display_name?: string; // Human-friendly display name
  aliases?: string[]; // Alternative names
  popular?: boolean; // Frequently used timezone
}

export interface UserTimezonePreference {
  timezone_id: string;
  order: number; // Display order
  added_at: string; // ISO timestamp
}

export interface TimezoneDataset {
  version: string;
  last_updated: string;
  timezones: TimeZoneInfo[];
}

export type ClockSkin = 
  | "classic" 
  | "minimal" 
  | "swiss" 
  | "artdeco"
  | "neon"
  | "wooden"
  | "glass"
  | "neomorphic";

export interface UserPreferences {
  selected_timezones: UserTimezonePreference[];
  clock_size: "extra-small" | "small" | "large";
  theme: "light" | "dark" | "system";
  clock_skin?: ClockSkin;
  last_sync?: string;
}

