"use client";

import { useEffect } from "react";

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
};

/**
 * useKeyboardShortcuts Hook
 * 
 * Manages global keyboard shortcuts for the application.
 * Supports modifier keys (Cmd/Ctrl, Shift, Alt) and custom callbacks.
 * 
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether shortcuts are currently enabled
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   { key: 'k', meta: true, callback: () => openCommandPalette() },
 *   { key: 's', meta: true, callback: () => save() }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.meta
          ? event.metaKey || event.ctrlKey
          : !event.metaKey && !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          metaMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * getModifierKey
 * 
 * Returns the appropriate modifier key symbol based on the platform.
 * Shows "⌘" for Mac and "Ctrl" for Windows/Linux.
 */
export function getModifierKey() {
  if (typeof window === "undefined") return "⌘";
  return navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl";
}

