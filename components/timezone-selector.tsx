"use client";

import { useState } from "react";
import { Plus, Search, X, Globe, MapPin, Download, Loader2 } from "lucide-react";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { Button } from "./ui/button";

export function TimezoneSelector() {
  const {
    availableTimezones,
    selectedTimezones,
    addTimezone,
    searchTimezones,
    downloadMoreTimezones,
  } = useTimezones();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const searchResults = searchQuery 
    ? searchTimezones(searchQuery) 
    : availableTimezones.filter((tz) => tz.popular);
  
  const selectedIds = new Set(selectedTimezones.map((tz) => tz.id));
  const filteredResults = searchResults.filter((tz) => !selectedIds.has(tz.id));

  const handleAdd = async (timezoneId: string) => {
    await addTimezone(timezoneId);
    setSearchQuery("");
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadMessage(null);
      const count = await downloadMoreTimezones();
      
      if (count > 0) {
        setDownloadMessage(`✓ Successfully downloaded ${count} new timezone${count !== 1 ? 's' : ''}!`);
      } else {
        setDownloadMessage("All available timezones are already downloaded.");
      }
      
      // Clear message after 5 seconds
      setTimeout(() => setDownloadMessage(null), 5000);
    } catch (error) {
      setDownloadMessage("❌ Failed to download timezones. Please check your internet connection.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2"
        size="lg"
      >
        <Plus className="h-5 w-5" />
        Add Timezone
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Add Timezone
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Search and add timezones to your world clock
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, country, or timezone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "No timezones found. Try a different search."
                  : "All available timezones have been added!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {!searchQuery && (
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Popular Timezones
                </h3>
              )}
              {filteredResults.map((tz) => (
                <div
                  key={tz.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {tz.display_name || `${tz.city}, ${tz.country_name}`}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>{tz.timezone_id}</span>
                      <span>•</span>
                      <span>UTC {tz.utc_offset}</span>
                      {tz.is_dst && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 dark:text-blue-400">DST</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAdd(tz.id)}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {filteredResults.length} timezone{filteredResults.length !== 1 ? "s" : ""} available
            </p>
            
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download More
                </>
              )}
            </Button>
          </div>
          
          {/* Download Message */}
          {downloadMessage && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              downloadMessage.startsWith("✓") 
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
                : downloadMessage.startsWith("❌")
                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
            }`}>
              {downloadMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

