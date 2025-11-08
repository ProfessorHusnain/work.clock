"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, Upload, Copy, Check } from "lucide-react";
import { useTimezones } from "@/lib/hooks/useTimezones";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ExportDialog Component
 * 
 * Allows users to export their preferences (timezones, clock size, theme, etc.)
 * as a JSON string that can be copied or downloaded.
 * 
 * Features:
 * - Pretty-printed JSON
 * - Copy to clipboard
 * - Download as file
 * - Toast notifications
 */
export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const { userPreferences } = useTimezones();
  const [copied, setCopied] = React.useState(false);

  const exportData = React.useMemo(() => {
    return JSON.stringify(userPreferences, null, 2);
  }, [userPreferences]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `world-clock-preferences-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Preferences file downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Preferences
          </DialogTitle>
          <DialogDescription>
            Copy or download your preferences to backup or share with other devices
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            readOnly
            value={exportData}
            className="font-mono text-xs h-64 resize-none"
          />
          
          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download as File
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ImportDialog Component
 * 
 * Allows users to import preferences from a JSON string.
 * Validates the format and applies the settings.
 * 
 * Features:
 * - JSON validation
 * - Error handling
 * - Preview before import
 * - Toast notifications
 */
export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { userPreferences, savePreferences } = useTimezones();
  const [importData, setImportData] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importData);
      
      // Validate the structure
      if (!parsed.selected_timezones || !Array.isArray(parsed.selected_timezones)) {
        throw new Error("Invalid preferences format: missing selected_timezones array");
      }

      // Save the preferences
      await savePreferences(parsed);
      
      toast.success("Preferences imported successfully!");
      
      onOpenChange(false);
      setImportData("");
      setError(null);
      
      // Reload to apply changes
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
      toast.error(`Import failed: ${errorMessage}`);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Preferences
          </DialogTitle>
          <DialogDescription>
            Paste your preferences JSON or upload a file to restore settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <Textarea
            placeholder="Paste your preferences JSON here..."
            value={importData}
            onChange={(e) => {
              setImportData(e.target.value);
              setError(null);
            }}
            className="font-mono text-xs h-64 resize-none"
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                Error: {error}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!importData.trim()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

