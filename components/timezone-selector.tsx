"use client";

import { useState } from "react";
import { Plus, Search, Globe, Download, Loader2 } from "lucide-react";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Timezone
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-2xl">Add Timezone</DialogTitle>
          <DialogDescription>
            Search and add timezones to your world clock
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search by city, country, or timezone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredResults.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Globe />
              </EmptyMedia>
              <EmptyTitle>
                {searchQuery ? "No timezones found" : "All timezones added"}
              </EmptyTitle>
              <EmptyDescription>
                {searchQuery
                  ? "Try a different search term or download more timezones."
                  : "All available timezones have been added to your world clock."}
              </EmptyDescription>
            </Empty>
          ) : (
            <>
              {!searchQuery && (
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Popular Timezones
                </h3>
              )}
              <ItemGroup className={'gap-2'}>
                {filteredResults.map((tz) => (
                  <Item key={tz.id} variant="outline">
                    <ItemMedia variant="icon">
                      <Globe />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {tz.display_name || `${tz.city}, ${tz.country_name}`}
                      </ItemTitle>
                      <ItemDescription>
                        {tz.timezone_id} • UTC {tz.utc_offset}
                        {tz.is_dst && " • DST"}
                      </ItemDescription>
                    </ItemContent>
                    <Button
                      onClick={() => handleAdd(tz.id)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </Item>
                ))}
              </ItemGroup>
            </>
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
      </DialogContent>
    </Dialog>
  );
}

