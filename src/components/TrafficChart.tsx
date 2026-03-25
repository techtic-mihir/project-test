"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatChartAxisValue, formatMonthLabel } from "@/lib/formatters";
import type { TrafficHistoryItem } from "@/types";

interface TrafficChartProps {
  data: TrafficHistoryItem[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
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

  return (
    <div className="h-20 w-full sm:h-24 lg:h-[95px]" aria-label="Organic traffic trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trafficAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0080FF" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#0080FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#ABABAB", fontSize: 10, fontWeight: 400 }}
            interval="preserveStartEnd"
            dy={6}
          />
          <YAxis
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8C8C8C", fontSize: 14, fontWeight: 400 }}
            ticks={[minTraffic, maxTraffic]}
            tickFormatter={formatChartAxisValue}
            width={56}
            domain={[minTraffic, maxTraffic]}
          />
          <Area type="monotone" dataKey="TRAFFIC" stroke="#0080FF" strokeWidth={1.5} fill="url(#trafficAreaGradient)" dot={false} activeDot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
