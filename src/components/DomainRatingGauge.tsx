 "use client";

import { useEffect, useState } from "react";

interface DomainRatingGaugeProps {
  value: number;
}

export default function DomainRatingGauge({ value }: DomainRatingGaugeProps) {
  const boundedValue = Math.max(0, Math.min(100, value));
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    setAnimatedValue(0);
    const frame = requestAnimationFrame(() => {
      setAnimatedValue(boundedValue);
    });
    return () => cancelAnimationFrame(frame);
  }, [boundedValue]);

  return (
    <div
      className="w-full max-w-none [--dr-gauge-stroke:16px] sm:max-w-[190px] sm:[--dr-gauge-stroke:20px]"
      aria-label={`Domain rating gauge: ${boundedValue} out of 100`}
    >
      <svg viewBox="0 0 190 110" className="h-auto w-full">
        <defs>
          <linearGradient id="drGaugeGradient" x1="20" y1="95" x2="170" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0080FF1A" />
            <stop offset="100%" stopColor="#0080FF" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d="M20 95 A75 75 0 0 1 170 95"
          fill="none"
          stroke="#E9EAEB"
          strokeWidth="var(--dr-gauge-stroke)"
          strokeLinecap="round"
          pathLength={100}
        />
        {/* Value arc */}
        <path
          d="M20 95 A75 75 0 0 1 170 95"
          fill="none"
          stroke="url(#drGaugeGradient)"
          strokeWidth="var(--dr-gauge-stroke)"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - animatedValue}
          className="transition-all duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
    </div>
  );
}
