"use client";

import { useEffect, useState } from "react";
import { ClockSkin } from "@/lib/types/timezone";

interface AnalogClockProps {
  timezone?: string;
  label?: string;
  size?: number;
  skin?: ClockSkin;
}

export function AnalogClock({
  timezone = "UTC",
  label,
  size = 300,
  skin = "classic",
}: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get time for specific timezone
  const getTimeForTimezone = () => {
    try {
      return new Date(
        time.toLocaleString("en-US", { timeZone: timezone })
      );
    } catch {
      return time;
    }
  };

  const currentTime = getTimeForTimezone();
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Calculate angles
  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Format digital time
  const digitalTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Get text size based on clock size
  const getTextSize = () => {
    if (size <= 150) {
      return {
        label: "text-sm",
        digital: "text-sm",
        timezone: "text-xs",
        gap: "gap-2",
      };
    } else if (size <= 220) {
      return {
        label: "text-base",
        digital: "text-lg",
        timezone: "text-xs",
        gap: "gap-3",
      };
    } else {
      return {
        label: "text-xl",
        digital: "text-2xl",
        timezone: "text-sm",
        gap: "gap-4",
      };
    }
  };

  const textSize = getTextSize();

  // Render different clock skins
  const renderClock = () => {
    switch (skin) {
      case "minimal":
        return <MinimalClock {...{ size, radius, centerX, centerY, hourAngle, minuteAngle, secondAngle }} />;
      case "swiss":
        return <SwissClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
      case "artdeco":
        return <ArtDecoClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
      case "neon":
        return <NeonClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
      case "wooden":
        return <WoodenClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
      case "glass":
        return <GlassClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
      case "neomorphic":
        return <NeomorphicClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
      case "classic":
      default:
        return <ClassicClock {...{ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }} />;
    }
  };

  return (
    <div className={`flex flex-col items-center ${textSize.gap}`}>
      {label && (
        <h2 className={`${textSize.label} font-semibold text-gray-900 dark:text-gray-100`}>
          {label}
        </h2>
      )}
      {renderClock()}
      <div className={`${textSize.digital} font-mono font-semibold text-gray-900 dark:text-gray-100`}>
        {digitalTime}
      </div>
      {timezone !== "UTC" && (
        <div className={`${textSize.timezone} text-gray-600 dark:text-gray-400`}>
          {timezone.replace(/_/g, " ")}
        </div>
      )}
    </div>
  );
}

// Helper function to get hand endpoints
const getHandEndpoint = (centerX: number, centerY: number, angle: number, length: number) => {
  const radian = (angle * Math.PI) / 180;
  return {
    x: centerX + length * Math.cos(radian),
    y: centerY + length * Math.sin(radian),
  };
};

// Classic Clock (Original Design)
function ClassicClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.8);

  // Generate hour marks
  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    const innerRadius = radius * 0.8;
    return {
      x1: centerX + innerRadius * Math.cos(angle),
      y1: centerY + innerRadius * Math.sin(angle),
      x2: centerX + outerRadius * Math.cos(angle),
      y2: centerY + outerRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  // Generate minute marks
  const minuteMarks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    const innerRadius = radius * 0.85;
    return {
      x1: centerX + innerRadius * Math.cos(angle),
      y1: centerY + innerRadius * Math.sin(angle),
      x2: centerX + outerRadius * Math.cos(angle),
      y2: centerY + outerRadius * Math.sin(angle),
    };
  }).filter(Boolean);

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      <circle
        cx={centerX}
        cy={centerY}
        r={radius - 10}
        className="fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
        strokeWidth="2"
      />

      {hourMarks.map((mark, i) => (
        <g key={i}>
          <line
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            className="stroke-gray-800 dark:stroke-gray-200"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x={centerX + (radius * 0.65) * Math.cos((i * 30 - 90) * Math.PI / 180)}
            y={centerY + (radius * 0.65) * Math.sin((i * 30 - 90) * Math.PI / 180)}
            className="fill-gray-800 dark:fill-gray-200 text-sm font-semibold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {mark.number}
          </text>
        </g>
      ))}

      {minuteMarks.map((mark, i) => (
        mark && (
          <line
            key={`min-${i}`}
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth="1"
            strokeLinecap="round"
          />
        )
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} className="stroke-gray-800 dark:stroke-gray-200" strokeWidth="8" strokeLinecap="round" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="6" strokeLinecap="round" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} className="stroke-red-500" strokeWidth="2" strokeLinecap="round" />

      <circle cx={centerX} cy={centerY} r="8" className="fill-gray-800 dark:fill-gray-200" />
      <circle cx={centerX} cy={centerY} r="4" className="fill-red-500" />
    </svg>
  );
}

// Minimal Clock (No numbers, thin hands)
function MinimalClock({ size, radius, centerX, centerY, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.45);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.65);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.75);

  // Only 4 marks (12, 3, 6, 9)
  const mainMarks = [0, 3, 6, 9].map(i => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.92;
    const innerRadius = radius * 0.88;
    return {
      x1: centerX + innerRadius * Math.cos(angle),
      y1: centerY + innerRadius * Math.sin(angle),
      x2: centerX + outerRadius * Math.cos(angle),
      y2: centerY + outerRadius * Math.sin(angle),
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-sm">
      <circle cx={centerX} cy={centerY} r={radius - 10} className="fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />

      {mainMarks.map((mark, i) => (
        <line
          key={i}
          x1={mark.x1}
          y1={mark.y1}
          x2={mark.x2}
          y2={mark.y2}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="4" strokeLinecap="round" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" strokeLinecap="round" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeLinecap="round" />

      <circle cx={centerX} cy={centerY} r="3" className="fill-gray-700 dark:fill-gray-300" />
    </svg>
  );
}

// Swiss Railway Clock (Iconic red second hand)
function SwissClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.75);

  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    const innerRadius = radius * 0.75;
    return {
      x1: centerX + innerRadius * Math.cos(angle),
      y1: centerY + innerRadius * Math.sin(angle),
      x2: centerX + outerRadius * Math.cos(angle),
      y2: centerY + outerRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      <circle cx={centerX} cy={centerY} r={radius - 10} className="fill-white dark:fill-gray-100 stroke-black dark:stroke-gray-800" strokeWidth="3" />

      {hourMarks.map((mark, i) => (
        <line
          key={i}
          x1={mark.x1}
          y1={mark.y1}
          x2={mark.x2}
          y2={mark.y2}
          className="stroke-black dark:stroke-gray-800"
          strokeWidth="8"
          strokeLinecap="butt"
        />
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} className="stroke-black dark:stroke-gray-800" strokeWidth="10" strokeLinecap="butt" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} className="stroke-black dark:stroke-gray-800" strokeWidth="8" strokeLinecap="butt" />
      
      {/* Swiss railway characteristic: circle at end of second hand */}
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} className="stroke-red-600" strokeWidth="3" strokeLinecap="round" />
      <circle cx={secondHand.x} cy={secondHand.y} r="10" className="fill-red-600" />

      <circle cx={centerX} cy={centerY} r="8" className="fill-black dark:fill-gray-800" />
    </svg>
  );
}

// Art Deco Clock (Geometric, gold accents)
function ArtDecoClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.8);

  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    const innerRadius = radius * 0.75;
    return {
      x1: centerX + innerRadius * Math.cos(angle),
      y1: centerY + innerRadius * Math.sin(angle),
      x2: centerX + outerRadius * Math.cos(angle),
      y2: centerY + outerRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-xl">
      <defs>
        <linearGradient id="artdecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#312e81', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <circle cx={centerX} cy={centerY} r={radius - 10} fill="url(#artdecoGradient)" stroke="#f59e0b" strokeWidth="4" />
      <circle cx={centerX} cy={centerY} r={radius - 20} fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />

      {hourMarks.map((mark, i) => (
        <g key={i}>
          <line
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke="#fbbf24"
            strokeWidth="6"
            strokeLinecap="square"
          />
          <text
            x={centerX + (radius * 0.6) * Math.cos((i * 30 - 90) * Math.PI / 180)}
            y={centerY + (radius * 0.6) * Math.sin((i * 30 - 90) * Math.PI / 180)}
            fill="#fbbf24"
            className="text-lg font-bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {mark.number}
          </text>
        </g>
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} stroke="url(#goldGradient)" strokeWidth="10" strokeLinecap="square" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} stroke="url(#goldGradient)" strokeWidth="7" strokeLinecap="square" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

      <circle cx={centerX} cy={centerY} r="12" fill="#f59e0b" />
      <circle cx={centerX} cy={centerY} r="6" fill="#fbbf24" />
    </svg>
  );
}

// Neon/Cyberpunk Clock (Glowing colors)
function NeonClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.8);

  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    return {
      x: centerX + outerRadius * Math.cos(angle),
      y: centerY + outerRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-2xl">
      <defs>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle cx={centerX} cy={centerY} r={radius - 10} className="fill-gray-900 dark:fill-black" stroke="#0ea5e9" strokeWidth="3" filter="url(#neonGlow)" />
      <circle cx={centerX} cy={centerY} r={radius - 20} fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />

      {hourMarks.map((mark, i) => (
        <text
          key={i}
          x={mark.x}
          y={mark.y}
          fill="#06b6d4"
          className="text-base font-bold"
          textAnchor="middle"
          dominantBaseline="middle"
          filter="url(#neonGlow)"
        >
          {mark.number}
        </text>
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" filter="url(#neonGlow)" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" filter="url(#neonGlow)" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} stroke="#ec4899" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlow)" />

      <circle cx={centerX} cy={centerY} r="8" fill="#06b6d4" filter="url(#neonGlow)" />
    </svg>
  );
}

// Wooden Clock (Texture, vintage feel)
function WoodenClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.8);

  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    const innerRadius = radius * 0.8;
    return {
      x1: centerX + innerRadius * Math.cos(angle),
      y1: centerY + innerRadius * Math.sin(angle),
      x2: centerX + outerRadius * Math.cos(angle),
      y2: centerY + outerRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      <defs>
        <radialGradient id="woodGradient">
          <stop offset="0%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#92400e', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#78350f', stopOpacity: 1 }} />
        </radialGradient>
      </defs>

      <circle cx={centerX} cy={centerY} r={radius - 10} fill="url(#woodGradient)" stroke="#451a03" strokeWidth="5" />

      {/* Wood grain effect */}
      {Array.from({ length: 5 }, (_, i) => (
        <circle
          key={i}
          cx={centerX}
          cy={centerY}
          r={radius - 20 - (i * 15)}
          fill="none"
          stroke="#78350f"
          strokeWidth="1"
          opacity={0.3}
        />
      ))}

      {hourMarks.map((mark, i) => (
        <g key={i}>
          <line
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke="#fef3c7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x={centerX + (radius * 0.65) * Math.cos((i * 30 - 90) * Math.PI / 180)}
            y={centerY + (radius * 0.65) * Math.sin((i * 30 - 90) * Math.PI / 180)}
            fill="#fef3c7"
            className="text-sm font-serif font-bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {mark.number}
          </text>
        </g>
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} stroke="#fef3c7" strokeWidth="8" strokeLinecap="round" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} stroke="#fde68a" strokeWidth="6" strokeLinecap="round" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />

      <circle cx={centerX} cy={centerY} r="10" fill="#451a03" />
      <circle cx={centerX} cy={centerY} r="5" fill="#fef3c7" />
    </svg>
  );
}

// Glass Morphism Clock (Frosted glass effect)
function GlassClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.8);

  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerRadius = radius * 0.9;
    return {
      x: centerX + outerRadius * Math.cos(angle),
      y: centerY + outerRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-2xl">
      <defs>
        <filter id="glassBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      <circle cx={centerX} cy={centerY} r={radius - 10} fill="url(#glassGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" filter="url(#glassBlur)" />
      <circle cx={centerX} cy={centerY} r={radius - 15} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {hourMarks.map((mark, i) => (
        <text
          key={i}
          x={mark.x}
          y={mark.y}
          className="fill-gray-700 dark:fill-gray-300 text-sm font-semibold"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
        >
          {mark.number}
        </text>
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} className="stroke-gray-800 dark:stroke-gray-200" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} className="stroke-blue-500" strokeWidth="2" strokeLinecap="round" />

      <circle cx={centerX} cy={centerY} r="8" className="fill-white dark:fill-gray-700" opacity="0.7" />
      <circle cx={centerX} cy={centerY} r="4" className="fill-blue-500" />
    </svg>
  );
}

// Neomorphic Clock (Soft shadows, 3D effect)
function NeomorphicClock({ size, radius, centerX, centerY, hours, minutes, seconds, hourAngle, minuteAngle, secondAngle }: any) {
  const hourHand = getHandEndpoint(centerX, centerY, hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(centerX, centerY, minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(centerX, centerY, secondAngle, radius * 0.8);

  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const markRadius = radius * 0.85;
    return {
      x: centerX + markRadius * Math.cos(angle),
      y: centerY + markRadius * Math.sin(angle),
      number: i === 0 ? 12 : i,
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-2xl">
      <defs>
        <filter id="neoInner">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="-2" dy="-2" result="offsetblur"/>
          <feFlood floodColor="#ffffff" floodOpacity="0.5"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="neoOuter">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="4" dy="4" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.2"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle cx={centerX} cy={centerY} r={radius - 10} className="fill-gray-200 dark:fill-gray-800" filter="url(#neoOuter)" />
      <circle cx={centerX} cy={centerY} r={radius - 15} className="fill-gray-200 dark:fill-gray-800" filter="url(#neoInner)" />

      {hourMarks.map((mark, i) => (
        <g key={i}>
          <circle cx={mark.x} cy={mark.y} r="4" className="fill-gray-300 dark:fill-gray-700" filter="url(#neoInner)" />
          <text
            x={centerX + (radius * 0.65) * Math.cos((i * 30 - 90) * Math.PI / 180)}
            y={centerY + (radius * 0.65) * Math.sin((i * 30 - 90) * Math.PI / 180)}
            className="fill-gray-600 dark:fill-gray-400 text-sm font-semibold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {mark.number}
          </text>
        </g>
      ))}

      <line x1={centerX} y1={centerY} x2={hourHand.x} y2={hourHand.y} className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="10" strokeLinecap="round" filter="url(#neoOuter)" />
      <line x1={centerX} y1={centerY} x2={minuteHand.x} y2={minuteHand.y} className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="7" strokeLinecap="round" filter="url(#neoOuter)" />
      <line x1={centerX} y1={centerY} x2={secondHand.x} y2={secondHand.y} className="stroke-blue-500" strokeWidth="2" strokeLinecap="round" />

      <circle cx={centerX} cy={centerY} r="12" className="fill-gray-300 dark:fill-gray-700" filter="url(#neoInner)" />
      <circle cx={centerX} cy={centerY} r="6" className="fill-blue-500" />
    </svg>
  );
}
