"use client";

import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Clock,
  Download,
  Upload,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  Palette,
  Plus,
  Keyboard,
  Info,
  LayoutGrid,
} from "lucide-react";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { useTheme } from "next-themes";
import type { ClockSize } from "@/components/clock-size-selector";
import type { ClockSkin } from "@/lib/types/timezone";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowKeyboardShortcuts: () => void;
  onShowAbout: () => void;
  onExportPreferences: () => void;
  onImportPreferences: () => void;
}

/**
 * CommandPalette Component
 * 
 * A VS Code-style command palette for quick access to all application features.
 * Searchable list of commands with keyboard shortcuts and icons.
 * 
 * Features:
 * - Fuzzy search through all commands
 * - Organized by category
 * - Keyboard navigation
 * - Quick action execution
 */
export function CommandPalette({
  open,
  onOpenChange,
  onShowKeyboardShortcuts,
  onShowAbout,
  onExportPreferences,
  onImportPreferences,
}: CommandPaletteProps) {
  const { clockSize, setClockSize, clockSkin, setClockSkin, refreshTimezones } = useTimezones();
  const { setTheme } = useTheme();

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty />
        
        {/* File Commands */}
        <CommandGroup heading="File">
          <CommandItem onSelect={() => runCommand(onImportPreferences)}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Import Preferences</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(onExportPreferences)}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Preferences</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(refreshTimezones)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Refresh Data</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        {/* View Commands */}
        <CommandGroup heading="View">
          <CommandItem onSelect={() => runCommand(() => setClockSize("extra-small"))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Clock Size: Extra Small</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setClockSize("small"))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Clock Size: Small</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setClockSize("large"))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Clock Size: Large</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        {/* Appearance Commands */}
        <CommandGroup heading="Appearance">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Theme: Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Theme: Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Theme: System</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        {/* Clock Styles */}
        <CommandGroup heading="Clock Styles">
          {(["classic", "minimal", "swiss", "artdeco", "neon", "wooden", "glass", "neomorphic"] as ClockSkin[]).map((skin) => (
            <CommandItem
              key={skin}
              onSelect={() => runCommand(() => setClockSkin(skin))}
            >
              <Palette className="mr-2 h-4 w-4" />
              <span>Clock Style: {skin.charAt(0).toUpperCase() + skin.slice(1)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        {/* Help Commands */}
        <CommandGroup heading="Help">
          <CommandItem onSelect={() => runCommand(onShowKeyboardShortcuts)}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard Shortcuts</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(onShowAbout)}>
            <Info className="mr-2 h-4 w-4" />
            <span>About World Clock</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

