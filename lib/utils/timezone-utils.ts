/**
 * Get UTC offset for a timezone at a specific date
 */
export function getTimezoneOffset(timezoneId: string, date: Date = new Date()): {
  offset: string;
  offsetMinutes: number;
  isDST: boolean;
} {
  try {
    // Get the offset in minutes
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneId,
      timeZoneName: "short",
    });
    
    // Get offset by comparing UTC time with timezone time
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezoneId }));
    const offsetMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / (1000 * 60));

    // Format as +HH:MM or -HH:MM
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    const offset = `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    // Check if DST is active
    const isDST = checkDST(timezoneId, date);

    return { offset, offsetMinutes, isDST };
  } catch (error) {
    console.error(`Error getting offset for ${timezoneId}:`, error);
    return { offset: "+00:00", offsetMinutes: 0, isDST: false };
  }
}

/**
 * Check if a timezone is currently observing DST
 */
export function checkDST(timezoneId: string, date: Date = new Date()): boolean {
  try {
    // Get offsets for January (winter) and July (summer)
    const year = date.getFullYear();
    const jan = new Date(year, 0, 1);
    const jul = new Date(year, 6, 1);

    const janOffset = getTimezoneOffsetMinutes(timezoneId, jan);
    const julOffset = getTimezoneOffsetMinutes(timezoneId, jul);
    const currentOffset = getTimezoneOffsetMinutes(timezoneId, date);

    // If offsets are different, DST is used
    if (janOffset === julOffset) {
      return false; // No DST observed
    }

    // In northern hemisphere, summer offset is greater
    // In southern hemisphere, winter offset is greater
    const maxOffset = Math.max(janOffset, julOffset);
    return currentOffset === maxOffset;
  } catch (error) {
    return false;
  }
}

/**
 * Get timezone offset in minutes only
 */
function getTimezoneOffsetMinutes(timezoneId: string, date: Date): number {
  try {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezoneId }));
    return Math.round((tzDate.getTime() - utcDate.getTime()) / (1000 * 60));
  } catch {
    return 0;
  }
}

/**
 * Format timezone offset for display
 */
export function formatUTCOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Get timezone abbreviation (e.g., PST, EST, JST)
 */
export function getTimezoneAbbreviation(timezoneId: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneId,
      timeZoneName: "short",
    });
    
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find((part) => part.type === "timeZoneName");
    return timeZonePart?.value || "";
  } catch {
    return "";
  }
}

