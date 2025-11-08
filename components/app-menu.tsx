"use client";

import * as React from "react";
import {
  Settings,
  Palette,
  Monitor,
  Moon,
  Sun,
  Info,
  Github,
  HelpCircle,
  Keyboard,
  Download,
  Upload,
  RefreshCw,
  Maximize2,
  Minimize2,
  Circle,
  LayoutGrid,
  Clock,
  Plus,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { useTimezones } from "@/lib/hooks/useTimezones";
import { useTheme } from "next-themes";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog";
import { AboutDialog } from "@/components/about-dialog";
import { ExportDialog, ImportDialog } from "@/components/import-export-dialogs";
import { CommandPalette } from "@/components/command-palette";
import { TimezoneSelector } from "@/components/timezone-selector";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import type { ClockSize } from "@/components/clock-size-selector";
import type { ClockSkin } from "@/lib/types/timezone";

/**
 * AppMenu Component
 * 
 * A professional, standardized menu bar for the World Clock application.
 * Features organized menus with keyboard shortcuts, icons, and logical groupings.
 * 
 * Menu Structure:
 * - File: Import/Export preferences, refresh data
 * - View: Clock size, layout options
 * - Appearance: Theme, clock styles
 * - Help: About, documentation, keyboard shortcuts
 * 
 * Integrates:
 * - Keyboard shortcuts
 * - Command palette
 * - Import/Export dialogs
 * - About dialog
 */
export function AppMenu() {
  const { clockSize, setClockSize, clockSkin, setClockSkin, refreshTimezones } = useTimezones();
  const { theme, setTheme } = useTheme();

  // Dialog states
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [showCommandPalette, setShowCommandPalette] = React.useState(false);
  const [showTimezoneSelector, setShowTimezoneSelector] = React.useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    // File operations
    { key: "t", meta: true, callback: () => setShowTimezoneSelector(true) },
    { key: "i", meta: true, callback: () => setShowImport(true) },
    { key: "e", meta: true, callback: () => setShowExport(true) },
    { key: "r", meta: true, callback: refreshTimezones },
    
    // View
    { key: "1", meta: true, callback: () => setClockSize("extra-small") },
    { key: "2", meta: true, callback: () => setClockSize("small") },
    { key: "3", meta: true, callback: () => setClockSize("large") },
    { key: "k", meta: true, callback: () => setShowCommandPalette(true) },
    
    // Appearance
    { key: "l", meta: true, shift: true, callback: () => setTheme("light") },
    { key: "d", meta: true, shift: true, callback: () => setTheme("dark") },
    
    // Help
    { key: "/", meta: true, callback: () => setShowKeyboardShortcuts(true) },
    { key: "a", meta: true, shift: true, callback: () => setShowAbout(true) },
  ]);

  return (
    <>
      <Menubar className="border-none bg-transparent">
        {/* File Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-semibold cursor-pointer">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setShowTimezoneSelector(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Timezone
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => setShowImport(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import Preferences
              <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => setShowExport(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export Preferences
              <MenubarShortcut>⌘E</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={refreshTimezones}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
              <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

      {/* View Menu */}
      <MenubarMenu>
        <MenubarTrigger className="font-semibold cursor-pointer">View</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Clock Size
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value={clockSize} onValueChange={(value) => setClockSize(value as ClockSize)}>
                <MenubarRadioItem value="extra-small">
                  <Circle className="mr-2 h-3 w-3" />
                  Extra Small
                  <MenubarShortcut>⌘1</MenubarShortcut>
                </MenubarRadioItem>
                <MenubarRadioItem value="small">
                  <Minimize2 className="mr-2 h-4 w-4" />
                  Small
                  <MenubarShortcut>⌘2</MenubarShortcut>
                </MenubarRadioItem>
                <MenubarRadioItem value="large">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Large
                  <MenubarShortcut>⌘3</MenubarShortcut>
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      {/* Appearance Menu */}
      <MenubarMenu>
        <MenubarTrigger className="font-semibold cursor-pointer">Appearance</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <Monitor className="mr-2 h-4 w-4" />
              Theme
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value={theme} onValueChange={setTheme}>
                <MenubarRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </MenubarRadioItem>
                <MenubarRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </MenubarRadioItem>
                <MenubarRadioItem value="system">
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Clock className="mr-2 h-4 w-4" />
              Clock Style
            </MenubarSubTrigger>
            <MenubarSubContent className="w-56">
              <MenubarRadioGroup value={clockSkin} onValueChange={(value) => setClockSkin(value as ClockSkin)}>
                <MenubarRadioItem value="classic">
                  <Palette className="mr-2 h-4 w-4" />
                  Classic
                </MenubarRadioItem>
                <MenubarRadioItem value="minimal">
                  <Palette className="mr-2 h-4 w-4" />
                  Minimal
                </MenubarRadioItem>
                <MenubarRadioItem value="swiss">
                  <Palette className="mr-2 h-4 w-4" />
                  Swiss Railway
                </MenubarRadioItem>
                <MenubarRadioItem value="artdeco">
                  <Palette className="mr-2 h-4 w-4" />
                  Art Deco
                </MenubarRadioItem>
                <MenubarRadioItem value="neon">
                  <Palette className="mr-2 h-4 w-4" />
                  Neon
                </MenubarRadioItem>
                <MenubarRadioItem value="wooden">
                  <Palette className="mr-2 h-4 w-4" />
                  Wooden
                </MenubarRadioItem>
                <MenubarRadioItem value="glass">
                  <Palette className="mr-2 h-4 w-4" />
                  Glass
                </MenubarRadioItem>
                <MenubarRadioItem value="neomorphic">
                  <Palette className="mr-2 h-4 w-4" />
                  Neomorphic
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      {/* Help Menu */}
        <MenubarMenu>
          <MenubarTrigger className="font-semibold cursor-pointer">Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setShowKeyboardShortcuts(true)}>
              <Keyboard className="mr-2 h-4 w-4" />
              Keyboard Shortcuts
              <MenubarShortcut>⌘/</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => window.open("https://github.com/yourusername/world-clock", "_blank")}>
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </MenubarItem>
            <MenubarItem onClick={() => setShowAbout(true)}>
              <Info className="mr-2 h-4 w-4" />
              About World Clock
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Dialogs */}
      <KeyboardShortcutsDialog
        open={showKeyboardShortcuts}
        onOpenChange={setShowKeyboardShortcuts}
      />
      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
      <ExportDialog open={showExport} onOpenChange={setShowExport} />
      <ImportDialog open={showImport} onOpenChange={setShowImport} />
      <TimezoneSelector 
        open={showTimezoneSelector} 
        onOpenChange={setShowTimezoneSelector} 
      />
      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
        onShowAbout={() => setShowAbout(true)}
        onExportPreferences={() => setShowExport(true)}
        onImportPreferences={() => setShowImport(true)}
      />
    </>
  );
}

