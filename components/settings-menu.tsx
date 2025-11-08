"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ClockSizeSelector } from "@/components/clock-size-selector";
import { ClockSkinSelector } from "@/components/clock-skin-selector";
import { useTimezones } from "@/lib/hooks/useTimezones";

/**
 * Settings Menu Component
 * 
 * A slide-out panel that contains all clock customization options.
 * Uses ShadCN Sheet component for a drawer-style interface.
 * 
 * Features:
 * - Clock size selection
 * - Clock style/skin selection
 * - Organized into sections
 * - Responsive design
 * - Accessible (keyboard navigation, screen readers)
 */
export function SettingsMenu() {
  const { clockSize, setClockSize, clockSkin, setClockSkin } = useTimezones();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-xl font-semibold">Clock Settings</SheetTitle>
          <SheetDescription className="text-sm">
            Customize your world clock display
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Clock Size Section */}
          <SettingsSection
            title="Clock Size"
            description="Choose the size of your clock displays"
          >
            <ClockSizeSelector
              value={clockSize}
              onValueChange={setClockSize}
            />
          </SettingsSection>

          <Separator className="my-6" />

          {/* Clock Style Section */}
          <SettingsSection
            title="Clock Style"
            description="Select your preferred clock design"
          >
            <ClockSkinSelector
              value={clockSkin}
              onValueChange={setClockSkin}
            />
          </SettingsSection>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Settings Section Component
 * 
 * Reusable wrapper for settings sections with consistent spacing and typography.
 * Follows ShadCN UI design patterns.
 * 
 * @param title - Section heading
 * @param description - Optional description text
 * @param children - Setting controls to display
 */
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

