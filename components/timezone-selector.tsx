"use client";

import { useState } from "react";
import { Plus, Search, Globe, Download, Loader2 } from "lucide-react";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
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
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";

interface TimezoneSelectorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TimezoneSelector({ open, onOpenChange }: TimezoneSelectorProps = {}) {
  const {
    availableTimezones,
    selectedTimezones,
    addTimezone,
    searchTimezones,
    downloadMoreTimezones,
  } = useTimezones();

  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Support both controlled and uncontrolled modes
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const searchResults = searchQuery 
    ? searchTimezones(searchQuery) 
    : availableTimezones.filter((tz) => tz.popular);
  
  const selectedIds = new Set(selectedTimezones.map((tz) => tz.id));
  const filteredResults = searchResults.filter((tz) => !selectedIds.has(tz.id));
  
  // Show total available count when searching, filtered count otherwise
  const displayCount = searchQuery ? searchResults.length : filteredResults.length;

  const handleAdd = async (timezoneId: string) => {
    await addTimezone(timezoneId);
    setSearchQuery("");
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const count = await downloadMoreTimezones();
      
      if (count > 0) {
        toast.success(`Successfully downloaded ${count} new timezone${count !== 1 ? 's' : ''}!`);
      } else {
        toast.info("All available timezones are already downloaded.");
      }
    } catch (error) {
      toast.error("Failed to download timezones. Please check your internet connection.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render trigger button when in uncontrolled mode (open prop not provided) */}
      {open === undefined && (
        <DialogTrigger asChild>
          <Button className="gap-2" size="lg">
            <Plus className="h-5 w-5" />
            Add Timezone
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <DialogTitle className="text-2xl">Add Timezone</DialogTitle>
          <DialogDescription>
            Search and add timezones to your world clock
          </DialogDescription>
        </DialogHeader>

        {/* Search with Download Button */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <InputGroup className="flex-1">
              <InputGroupInput
                type="text"
                placeholder="Search by city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <Search className="h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download more timezones</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Results - Scrollable Area */}
        <ScrollArea className="h-[400px]">
          <div className="px-6 py-4">
            {filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                {/* Animated Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg">
                    <Globe className="h-10 w-10 text-gray-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {searchQuery ? "No timezones found" : "All timezones added"}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-center max-w-sm mb-6">
                  {searchQuery ? (
                    <>
                      We couldn't find any timezones matching{" "}
                      <span className="text-blue-400 font-medium">"{searchQuery}"</span>
                    </>
                  ) : (
                    "Great job! You've added all available timezones to your world clock."
                  )}
                </p>

                {/* Suggestions */}
                {searchQuery ? (
                  <div className="w-full max-w-md space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-semibold">1</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">Try a different search</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Search by city name, country, or timezone code
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <span className="text-purple-400 text-xs font-semibold">2</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">Download more timezones</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Click the download button to get the latest timezone database
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-400">
                      All timezones in use
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {searchQuery ? "Search Results" : "Popular Timezones"}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {displayCount} timezone{displayCount !== 1 ? "s" : ""}
                  </span>
                </div>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

