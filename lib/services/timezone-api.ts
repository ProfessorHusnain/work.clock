import { TimeZoneInfo } from "../types/timezone";
import { getTimezoneOffset } from "../utils/timezone-utils";

// Free public API - no API key required
const WORLDTIME_API_BASE = "https://worldtimeapi.org/api/timezone";

interface WorldTimeApiTimezone {
  timezone: string;
  abbreviation: string;
  utc_offset: string;
  dst: boolean;
  dst_offset: number;
  raw_offset: number;
}

// Map of common timezone aliases
const TIMEZONE_METADATA: Record<string, { country: string; country_code: string; city: string; lat?: number; lng?: number; popular?: boolean }> = {
  "America/Anchorage": { country: "United States", country_code: "US", city: "Anchorage", lat: 61.2181, lng: -149.9003 },
  "America/Chicago": { country: "United States", country_code: "US", city: "Chicago", lat: 41.8781, lng: -87.6298, popular: true },
  "America/Denver": { country: "United States", country_code: "US", city: "Denver", lat: 39.7392, lng: -104.9903 },
  "America/Phoenix": { country: "United States", country_code: "US", city: "Phoenix", lat: 33.4484, lng: -112.0740 },
  "America/Toronto": { country: "Canada", country_code: "CA", city: "Toronto", lat: 43.6532, lng: -79.3832, popular: true },
  "America/Vancouver": { country: "Canada", country_code: "CA", city: "Vancouver", lat: 49.2827, lng: -123.1207 },
  "America/Mexico_City": { country: "Mexico", country_code: "MX", city: "Mexico City", lat: 19.4326, lng: -99.1332 },
  "America/Sao_Paulo": { country: "Brazil", country_code: "BR", city: "São Paulo", lat: -23.5505, lng: -46.6333, popular: true },
  "America/Buenos_Aires": { country: "Argentina", country_code: "AR", city: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  "Europe/Berlin": { country: "Germany", country_code: "DE", city: "Berlin", lat: 52.5200, lng: 13.4050, popular: true },
  "Europe/Madrid": { country: "Spain", country_code: "ES", city: "Madrid", lat: 40.4168, lng: -3.7038 },
  "Europe/Rome": { country: "Italy", country_code: "IT", city: "Rome", lat: 41.9028, lng: 12.4964 },
  "Europe/Moscow": { country: "Russia", country_code: "RU", city: "Moscow", lat: 55.7558, lng: 37.6173, popular: true },
  "Europe/Istanbul": { country: "Turkey", country_code: "TR", city: "Istanbul", lat: 41.0082, lng: 28.9784 },
  "Asia/Shanghai": { country: "China", country_code: "CN", city: "Shanghai", lat: 31.2304, lng: 121.4737, popular: true },
  "Asia/Bangkok": { country: "Thailand", country_code: "TH", city: "Bangkok", lat: 13.7563, lng: 100.5018 },
  "Asia/Seoul": { country: "South Korea", country_code: "KR", city: "Seoul", lat: 37.5665, lng: 126.9780, popular: true },
  "Asia/Kolkata": { country: "India", country_code: "IN", city: "Kolkata", lat: 22.5726, lng: 88.3639, popular: true },
  "Asia/Mumbai": { country: "India", country_code: "IN", city: "Mumbai", lat: 19.0760, lng: 72.8777 },
  "Asia/Jakarta": { country: "Indonesia", country_code: "ID", city: "Jakarta", lat: -6.2088, lng: 106.8456 },
  "Asia/Manila": { country: "Philippines", country_code: "PH", city: "Manila", lat: 14.5995, lng: 120.9842 },
  "Pacific/Auckland": { country: "New Zealand", country_code: "NZ", city: "Auckland", lat: -36.8485, lng: 174.7633 },
  "Pacific/Fiji": { country: "Fiji", country_code: "FJ", city: "Suva", lat: -18.1416, lng: 178.4419 },
  "Africa/Cairo": { country: "Egypt", country_code: "EG", city: "Cairo", lat: 30.0444, lng: 31.2357 },
  "Africa/Johannesburg": { country: "South Africa", country_code: "ZA", city: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  "Africa/Lagos": { country: "Nigeria", country_code: "NG", city: "Lagos", lat: 6.5244, lng: 3.3792 },
  "Africa/Nairobi": { country: "Kenya", country_code: "KE", city: "Nairobi", lat: -1.2864, lng: 36.8172 },
};

export class TimezoneApiService {
  private cache: Map<string, TimeZoneInfo[]> = new Map();
  private cacheExpiry: number = 1000 * 60 * 60 * 24; // 24 hours

  /**
   * Fetch all available timezones from WorldTimeAPI
   */
  async fetchAllTimezones(): Promise<TimeZoneInfo[]> {
    try {
      // Check cache first
      const cached = this.cache.get("all");
      if (cached) {
        return cached;
      }

      // Fetch list of all timezones
      const response = await fetch(`${WORLDTIME_API_BASE}`);
      if (!response.ok) {
        throw new Error("Failed to fetch timezone list");
      }

      const timezoneList: string[] = await response.json();

      // Convert to TimeZoneInfo format with real UTC offsets
      const timezones: TimeZoneInfo[] = timezoneList.map((tzId) => {
        const metadata = TIMEZONE_METADATA[tzId] || this.parseTimezoneId(tzId);
        
        // Calculate actual UTC offset and DST status
        const { offset, offsetMinutes, isDST } = getTimezoneOffset(tzId);
        
        return {
          id: tzId.toLowerCase().replace(/\//g, "-"),
          region: tzId.split("/")[0],
          city: metadata.city,
          timezone_id: tzId,
          country_code: metadata.country_code,
          country_name: metadata.country,
          utc_offset: offset,
          utc_offset_minutes: offsetMinutes,
          is_dst: isDST,
          display_name: `${metadata.city}, ${metadata.country}`,
          latitude: metadata.lat,
          longitude: metadata.lng,
          popular: metadata.popular,
        };
      });

      // Cache the results
      this.cache.set("all", timezones);

      return timezones;
    } catch (error) {
      console.error("Error fetching timezones:", error);
      throw new Error("Failed to download timezones. Please check your internet connection.");
    }
  }

  /**
   * Fetch detailed info for a specific timezone
   */
  async fetchTimezoneDetails(timezoneId: string): Promise<Partial<TimeZoneInfo>> {
    try {
      const response = await fetch(`${WORLDTIME_API_BASE}/${timezoneId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch timezone: ${timezoneId}`);
      }

      const data: WorldTimeApiTimezone = await response.json();

      return {
        timezone_id: data.timezone,
        utc_offset: data.utc_offset,
        utc_offset_minutes: this.offsetToMinutes(data.utc_offset),
        is_dst: data.dst,
      };
    } catch (error) {
      console.error(`Error fetching timezone ${timezoneId}:`, error);
      return {};
    }
  }

  /**
   * Parse timezone ID to extract region, city, country
   */
  private parseTimezoneId(tzId: string): { country: string; country_code: string; city: string } {
    const parts = tzId.split("/");
    const region = parts[0];
    const city = parts[parts.length - 1].replace(/_/g, " ");

    // Map region to country (simplified)
    const regionToCountry: Record<string, { name: string; code: string }> = {
      America: { name: "Americas", code: "AM" },
      Europe: { name: "Europe", code: "EU" },
      Asia: { name: "Asia", code: "AS" },
      Africa: { name: "Africa", code: "AF" },
      Pacific: { name: "Pacific", code: "PA" },
      Atlantic: { name: "Atlantic", code: "AT" },
      Indian: { name: "Indian Ocean", code: "IO" },
      Antarctica: { name: "Antarctica", code: "AQ" },
    };

    const countryInfo = regionToCountry[region] || { name: region, code: region.substring(0, 2).toUpperCase() };

    return {
      country: countryInfo.name,
      country_code: countryInfo.code,
      city,
    };
  }

  /**
   * Convert UTC offset string to minutes
   */
  private offsetToMinutes(offset: string): number {
    const match = offset.match(/([+-])(\d{2}):(\d{2})/);
    if (!match) return 0;

    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    return sign * (hours * 60 + minutes);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const timezoneApiService = new TimezoneApiService();

