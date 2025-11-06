"use client";

import { useEffect, useState } from "react";

interface AnalogClockProps {
  timezone?: string;
  label?: string;
  size?: number;
}

export function AnalogClock({
  timezone = "UTC",
  label,
  size = 300,
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
  const secondAngle = (seconds * 6) - 90; // 6 degrees per second
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90; // 6 degrees per minute + smooth transition
  const hourAngle = (hours * 30 + minutes * 0.5) - 90; // 30 degrees per hour + smooth transition

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Calculate hand endpoints
  const getHandEndpoint = (angle: number, length: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + length * Math.cos(radian),
      y: centerY + length * Math.sin(radian),
    };
  };

  const hourHand = getHandEndpoint(hourAngle, radius * 0.5);
  const minuteHand = getHandEndpoint(minuteAngle, radius * 0.7);
  const secondHand = getHandEndpoint(secondAngle, radius * 0.8);

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
    if (i % 5 === 0) return null; // Skip hour positions
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

  return (
    <div className={`flex flex-col items-center ${textSize.gap}`}>
      {label && (
        <h2 className={`${textSize.label} font-semibold text-gray-900 dark:text-gray-100`}>
          {label}
        </h2>
      )}
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="drop-shadow-lg"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
        >
          {/* Clock face */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 10}
            className="fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
            strokeWidth="2"
          />

          {/* Hour marks */}
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

          {/* Minute marks */}
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

          {/* Hour hand */}
          <line
            x1={centerX}
            y1={centerY}
            x2={hourHand.x}
            y2={hourHand.y}
            className="stroke-gray-800 dark:stroke-gray-200"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1={centerX}
            y1={centerY}
            x2={minuteHand.x}
            y2={minuteHand.y}
            className="stroke-gray-700 dark:stroke-gray-300"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Second hand */}
          <line
            x1={centerX}
            y1={centerY}
            x2={secondHand.x}
            y2={secondHand.y}
            className="stroke-red-500"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            className="fill-gray-800 dark:fill-gray-200"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="4"
            className="fill-red-500"
          />
        </svg>
      </div>
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


