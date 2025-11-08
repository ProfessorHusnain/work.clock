"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  key: string[];
  description: string;
  category?: string;
}

const shortcuts: Shortcut[] = [
  // File Operations
  { key: ["⌘", "I"], description: "Import Preferences", category: "File" },
  { key: ["⌘", "E"], description: "Export Preferences", category: "File" },
  { key: ["⌘", "R"], description: "Refresh Data", category: "File" },
  
  // View
  { key: ["⌘", "1"], description: "Set Clock Size to Extra Small", category: "View" },
  { key: ["⌘", "2"], description: "Set Clock Size to Small", category: "View" },
  { key: ["⌘", "3"], description: "Set Clock Size to Large", category: "View" },
  { key: ["⌘", "K"], description: "Open Command Palette", category: "View" },
  
  // Appearance
  { key: ["⌘", "Shift", "L"], description: "Toggle Light Theme", category: "Appearance" },
  { key: ["⌘", "Shift", "D"], description: "Toggle Dark Theme", category: "Appearance" },
  
  // Navigation
  { key: ["⌘", "T"], description: "Add New Timezone", category: "Navigation" },
  { key: ["⌘", ","], description: "Open Settings", category: "Navigation" },
  
  // Help
  { key: ["⌘", "/"], description: "Show Keyboard Shortcuts", category: "Help" },
  { key: ["⌘", "Shift", "A"], description: "About World Clock", category: "Help" },
];

const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
  const category = shortcut.category || "General";
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(shortcut);
  return acc;
}, {} as Record<string, Shortcut[]>);

/**
 * KeyboardShortcutsDialog Component
 * 
 * Displays a comprehensive list of all keyboard shortcuts available in the application.
 * Organized by category for easy navigation and reference.
 * 
 * Features:
 * - Categorized shortcuts
 * - Visual keyboard key representation using Kbd component
 * - Scrollable content for long lists
 * - Responsive design
 */
export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick reference for all available keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[450px] -mr-4 pr-6">
          <div className="space-y-6 pr-2">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.key.map((key, keyIndex) => (
                          <Kbd key={keyIndex}>{key}</Kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {category !== Object.keys(groupedShortcuts).slice(-1)[0] && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Tip:</strong> Press <Kbd>⌘</Kbd> + <Kbd>/</Kbd> anytime to view these shortcuts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

