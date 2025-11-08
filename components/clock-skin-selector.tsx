"use client";

import { ClockSkin } from "@/lib/types/timezone";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  CircleDot, 
  Minus, 
  Circle, 
  Square, 
  Sparkles, 
  TreePine, 
  Droplet,
  Layers
} from "lucide-react";

interface ClockSkinSelectorProps {
  value: ClockSkin;
  onValueChange: (value: ClockSkin) => void;
}

export function ClockSkinSelector({ value, onValueChange }: ClockSkinSelectorProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="clock-skin-selector">Clock Style</Label>
      <ToggleGroup
        id="clock-skin-selector"
        type="single"
        value={value}
        onValueChange={(newValue) => {
          if (newValue) onValueChange(newValue as ClockSkin);
        }}
        className="flex flex-wrap justify-start gap-2"
      >
        <ToggleGroupItem
          value="classic"
          aria-label="Classic clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Classic - Traditional analog clock with numbers"
        >
          <CircleDot className="h-5 w-5" />
          <span className="text-xs font-medium">Classic</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="minimal"
          aria-label="Minimal clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Minimal - Clean design with thin hands"
        >
          <Minus className="h-5 w-5" />
          <span className="text-xs font-medium">Minimal</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="swiss"
          aria-label="Swiss Railway clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Swiss Railway - Iconic design with red second hand"
        >
          <Circle className="h-5 w-5" />
          <span className="text-xs font-medium">Swiss</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="artdeco"
          aria-label="Art Deco clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Art Deco - Geometric design with gold accents"
        >
          <Square className="h-5 w-5" />
          <span className="text-xs font-medium">Art Deco</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="neon"
          aria-label="Neon/Cyberpunk clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Neon - Glowing cyberpunk style"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-medium">Neon</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="wooden"
          aria-label="Wooden clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Wooden - Vintage wood texture"
        >
          <TreePine className="h-5 w-5" />
          <span className="text-xs font-medium">Wooden</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="glass"
          aria-label="Glass Morphism clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Glass - Frosted glass effect"
        >
          <Droplet className="h-5 w-5" />
          <span className="text-xs font-medium">Glass</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="neomorphic"
          aria-label="Neomorphic clock style"
          className="flex flex-col items-center gap-1 px-4 py-3 h-auto data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          title="Neomorphic - Soft 3D shadows"
        >
          <Layers className="h-5 w-5" />
          <span className="text-xs font-medium">Neomorphic</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function getClockSkinName(skin: ClockSkin): string {
  const names: Record<ClockSkin, string> = {
    classic: "Classic",
    minimal: "Minimal",
    swiss: "Swiss Railway",
    artdeco: "Art Deco",
    neon: "Neon/Cyberpunk",
    wooden: "Wooden",
    glass: "Glass Morphism",
    neomorphic: "Neomorphic",
  };
  return names[skin] || "Classic";
}

export function getClockSkinDescription(skin: ClockSkin): string {
  const descriptions: Record<ClockSkin, string> = {
    classic: "Traditional analog clock with numbers and markings",
    minimal: "Clean design with no numbers and thin hands",
    swiss: "Iconic Swiss Railway clock with red circle second hand",
    artdeco: "Geometric design with gold accents and blue gradient",
    neon: "Glowing cyberpunk style with bright neon colors",
    wooden: "Vintage wooden texture with warm brown tones",
    glass: "Modern frosted glass effect with transparency",
    neomorphic: "Soft 3D effect with subtle shadows",
  };
  return descriptions[skin] || "";
}

