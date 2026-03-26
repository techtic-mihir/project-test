"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatChartAxisValue, formatMonthLabel } from "@/lib/formatters";
import type { TrafficHistoryItem } from "@/types";

interface TrafficChartProps {
  data: TrafficHistoryItem[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const gradientId = useId().replace(/:/g, "");

  if (data.length === 0) {
    return <div className="h-20 w-full rounded-lg bg-brand-gray-100 sm:h-24 lg:h-[95px]" />;
  }

  const formattedData = data.map((item) => ({
    ...item,
    month: formatMonthLabel(item.DATE),
  }));

  const trafficValues = data.map((item) => item.TRAFFIC);
  const minTraffic = Math.min(...trafficValues);
  const maxTraffic = Math.max(...trafficValues);

  const hasRange = minTraffic !== maxTraffic;
  const pad = hasRange ? 0 : Math.max(Math.abs(maxTraffic) * 0.08, 1);
  const domainMin = hasRange ? minTraffic : minTraffic - pad;
  const domainMax = hasRange ? maxTraffic : maxTraffic + pad;

  /** Matches AreaChart margins so min/max labels align with the plot top/bottom. */
  const margin = { top: 8, right: 0, left: 0, bottom: 4 } as const;

  return (
    <div className="relative h-20 w-full sm:h-24 lg:h-[95px]" aria-label="Organic traffic trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={margin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0080FF" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#0080FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Scale only — no reserved width; labels are overlaid on the right */}
          <YAxis hide domain={[domainMin, domainMax]} />

          <CartesianGrid
            vertical={false}
            stroke="#E9EAEB"
            strokeWidth={1}
            horizontalCoordinatesGenerator={(props) => {
              const { offset } = props;
              const yTop = offset.top;
              const yBottom = offset.top + offset.height;
              const span = yBottom - yTop;
              return [yTop, yTop + span / 3, yTop + (2 * span) / 3, yBottom];
            }}
          />
{/* 
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#ABABAB", fontSize: 10, fontWeight: 400 }}
            interval={0}
            minTickGap={8}
            dy={6}
          /> */}

          <Area
            type="monotone"
            dataKey="TRAFFIC"
            stroke="#0080FF"
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Min/max on the right, over the chart — nudged so labels don’t sit on the stroke */}
      <div
        className="pointer-events-none absolute right-0 flex flex-col justify-between text-right text-xs font-normal leading-none text-brand-gray-600"
        style={{
          top: margin.top,
          bottom: margin.bottom - 18,
        }}
      >
        <span className="block -translate-y-1.5 pr-px">{formatChartAxisValue(maxTraffic)}</span>
        <span className="block translate-y-1 pr-px">{formatChartAxisValue(minTraffic)}</span>
      </div>
    </div>
  );
}
