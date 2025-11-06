import { UserPreferences, TimeZoneInfo, TimezoneDataset } from "../types/timezone";
import { DEFAULT_USER_PREFERENCES, INITIAL_TIMEZONES } from "../data/initial-timezones";

const STORAGE_KEYS = {
  USER_PREFERENCES: "worldclock_user_preferences",
  TIMEZONE_DATA: "worldclock_timezone_data",
  DATA_VERSION: "worldclock_data_version",
};

export class StorageService {
  private isElectron: boolean;

  constructor() {
    this.isElectron = this.detectElectron();
  }

  private detectElectron(): boolean {
    return typeof window !== "undefined" && typeof window.electron !== "undefined";
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    if (this.isElectron) {
      return this.getElectronData<UserPreferences>(
        "user-preferences",
        DEFAULT_USER_PREFERENCES
      );
    } else {
      return this.getLocalStorageData<UserPreferences>(
        STORAGE_KEYS.USER_PREFERENCES,
        DEFAULT_USER_PREFERENCES
      );
    }
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    if (this.isElectron) {
      await this.saveElectronData("user-preferences", preferences);
    } else {
      this.saveLocalStorageData(STORAGE_KEYS.USER_PREFERENCES, preferences);
    }
  }

  // Timezone Data
  async getTimezoneData(): Promise<TimeZoneInfo[]> {
    if (this.isElectron) {
      const dataset = await this.getElectronData<TimezoneDataset>(
        "timezone-data",
        this.createInitialDataset()
      );
      return dataset.timezones;
    } else {
      const dataset = this.getLocalStorageData<TimezoneDataset>(
        STORAGE_KEYS.TIMEZONE_DATA,
        this.createInitialDataset()
      );
      return dataset.timezones;
    }
  }

  async saveTimezoneData(timezones: TimeZoneInfo[]): Promise<void> {
    const dataset: TimezoneDataset = {
      version: "1.0.0",
      last_updated: new Date().toISOString(),
      timezones,
    };

    if (this.isElectron) {
      await this.saveElectronData("timezone-data", dataset);
    } else {
      this.saveLocalStorageData(STORAGE_KEYS.TIMEZONE_DATA, dataset);
    }
  }

  async addTimezones(newTimezones: TimeZoneInfo[]): Promise<void> {
    const existing = await this.getTimezoneData();
    const existingIds = new Set(existing.map((tz) => tz.id));
    const toAdd = newTimezones.filter((tz) => !existingIds.has(tz.id));
    const updated = [...existing, ...toAdd];
    await this.saveTimezoneData(updated);
  }

  private createInitialDataset(): TimezoneDataset {
    return {
      version: "1.0.0",
      last_updated: new Date().toISOString(),
      timezones: INITIAL_TIMEZONES,
    };
  }

  // LocalStorage methods (for web)
  private getLocalStorageData<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  private saveLocalStorageData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  // Electron methods (for desktop)
  private async getElectronData<T>(key: string, defaultValue: T): Promise<T> {
    try {
      if (this.isElectron && window.electron?.storage) {
        const data = await window.electron.storage.get(key);
        return data ? JSON.parse(data) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error reading from Electron storage (${key}):`, error);
      return defaultValue;
    }
  }

  private async saveElectronData<T>(key: string, data: T): Promise<void> {
    try {
      if (this.isElectron && window.electron?.storage) {
        await window.electron.storage.set(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`Error writing to Electron storage (${key}):`, error);
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    if (this.isElectron && window.electron?.storage) {
      await window.electron.storage.clear();
    } else {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
  }
}

// Singleton instance
export const storageService = new StorageService();

// Type declaration for window.electron
declare global {
  interface Window {
    electron?: {
      storage: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<void>;
        clear: () => Promise<void>;
      };
    };
  }
}

