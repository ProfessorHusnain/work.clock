import { TimeZoneInfo } from "../types/timezone";
import { getTimezoneOffset } from "../utils/timezone-utils";

// Helper to create timezone with calculated offsets
function createTimezone(
  id: string,
  tzId: string,
  city: string,
  countryCode: string,
  countryName: string,
  displayName: string,
  lat?: number,
  lng?: number,
  aliases?: string[]
): TimeZoneInfo {
  const { offset, offsetMinutes, isDST } = getTimezoneOffset(tzId);
  return {
    id,
    region: tzId.split("/")[0],
    city,
    timezone_id: tzId,
    country_code: countryCode,
    country_name: countryName,
    utc_offset: offset,
    utc_offset_minutes: offsetMinutes,
    is_dst: isDST,
    display_name: displayName,
    latitude: lat,
    longitude: lng,
    popular: true,
    aliases,
  };
}

// Get local timezone info
const localTzId = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localTzInfo = getTimezoneOffset(localTzId);

// Initial hardcoded popular timezones with real-time calculated offsets
export const INITIAL_TIMEZONES: TimeZoneInfo[] = [
  {
    id: "local",
    region: "Local",
    city: "Device",
    timezone_id: localTzId,
    country_code: "LOCAL",
    country_name: "Local Time",
    utc_offset: localTzInfo.offset,
    utc_offset_minutes: localTzInfo.offsetMinutes,
    is_dst: localTzInfo.isDST,
    display_name: "Local Time",
    popular: true,
  },
  createTimezone(
    "america-new_york",
    "America/New_York",
    "New York",
    "US",
    "United States",
    "New York (EST/EDT)",
    40.7128,
    -74.006,
    ["Eastern Time", "ET", "EST", "EDT"]
  ),
  createTimezone(
    "america-los_angeles",
    "America/Los_Angeles",
    "Los Angeles",
    "US",
    "United States",
    "Los Angeles (PST/PDT)",
    34.0522,
    -118.2437,
    ["Pacific Time", "PT", "PST", "PDT"]
  ),
  createTimezone(
    "europe-london",
    "Europe/London",
    "London",
    "GB",
    "United Kingdom",
    "London (GMT/BST)",
    51.5074,
    -0.1278,
    ["GMT", "BST", "British Time"]
  ),
  createTimezone(
    "europe-paris",
    "Europe/Paris",
    "Paris",
    "FR",
    "France",
    "Paris (CET/CEST)",
    48.8566,
    2.3522,
    ["Central European Time", "CET", "CEST"]
  ),
  createTimezone(
    "asia-tokyo",
    "Asia/Tokyo",
    "Tokyo",
    "JP",
    "Japan",
    "Tokyo (JST)",
    35.6762,
    139.6503,
    ["Japan Standard Time", "JST"]
  ),
  createTimezone(
    "asia-dubai",
    "Asia/Dubai",
    "Dubai",
    "AE",
    "United Arab Emirates",
    "Dubai (GST)",
    25.2048,
    55.2708,
    ["Gulf Standard Time", "GST"]
  ),
  createTimezone(
    "australia-sydney",
    "Australia/Sydney",
    "Sydney",
    "AU",
    "Australia",
    "Sydney (AEDT/AEST)",
    -33.8688,
    151.2093,
    ["Australian Eastern Time", "AEST", "AEDT"]
  ),
  createTimezone(
    "asia-singapore",
    "Asia/Singapore",
    "Singapore",
    "SG",
    "Singapore",
    "Singapore (SGT)",
    1.3521,
    103.8198,
    ["Singapore Time", "SGT"]
  ),
  createTimezone(
    "asia-hong_kong",
    "Asia/Hong_Kong",
    "Hong Kong",
    "HK",
    "Hong Kong",
    "Hong Kong (HKT)",
    22.3193,
    114.1694,
    ["Hong Kong Time", "HKT"]
  ),
];

// Default user preferences
export const DEFAULT_USER_PREFERENCES = {
  selected_timezones: [
    { timezone_id: "local", order: 0, added_at: new Date().toISOString() },
    { timezone_id: "america-new_york", order: 1, added_at: new Date().toISOString() },
    { timezone_id: "europe-london", order: 2, added_at: new Date().toISOString() },
    { timezone_id: "asia-tokyo", order: 3, added_at: new Date().toISOString() },
    { timezone_id: "australia-sydney", order: 4, added_at: new Date().toISOString() },
    { timezone_id: "asia-dubai", order: 5, added_at: new Date().toISOString() },
  ],
  clock_size: "large" as const,
  theme: "system" as const,
};

