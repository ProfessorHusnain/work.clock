"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Github, Heart, Code2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * AboutDialog Component
 * 
 * Displays information about the World Clock application including:
 * - Version information
 * - Description and features
 * - Technology stack
 * - Credits and links
 * - License information
 */
export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const version = "2.0.0";
  const buildDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            World Clock
          </DialogTitle>
          <DialogDescription className="text-center">
            Track time across different timezones around the world
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Version Info */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Version
            </span>
            <Badge variant="secondary">{version}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Build Date
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {buildDate}
            </span>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Features
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Multiple timezone support</li>
              <li>8 beautiful clock skins</li>
              <li>Drag & drop reordering</li>
              <li>Dark mode support</li>
              <li>Keyboard shortcuts</li>
              <li>Import/Export preferences</li>
            </ul>
          </div>

          <Separator />

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Next.js 15</Badge>
              <Badge variant="outline">React 19</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Electron</Badge>
              <Badge variant="outline">Shadcn UI</Badge>
            </div>
          </div>

          <Separator />

          {/* Links */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                window.open("https://github.com/yourusername/world-clock", "_blank")
              }
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                window.open("https://github.com/yourusername/world-clock/issues", "_blank")
              }
            >
              <Code2 className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>

          {/* Made with love */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
            Made with <Heart className="inline h-4 w-4 text-red-500" /> by the World Clock Team
          </div>

          {/* License */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-500">
            Licensed under MIT License
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

