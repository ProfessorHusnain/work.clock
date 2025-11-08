import { AppMenu } from "./app-menu";
import { Clock } from "lucide-react";

/**
 * Header Component
 * 
 * Main application header with branding and standardized menu system.
 * Features a professional menu bar with organized options for file operations,
 * view settings, appearance customization, and help resources.
 */
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-none">
              World Clock
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Track time globally
            </p>
          </div>
        </div>

        {/* Professional Menu System */}
        <AppMenu />
      </div>
    </header>
  );
}
