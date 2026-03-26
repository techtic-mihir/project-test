import DomainRatingGauge from "@/components/DomainRatingGauge";
import InfoIcon from "@/components/InfoIcon";
import MetricCard from "@/components/MetricCard";
import TrafficChart from "@/components/TrafficChart";
import { formatDeltaValue, getDeltaToneClass } from "@/lib/formatters";
import type { Metrics, TrafficHistoryItem } from "@/types";

interface SeoInsightsProps {
  metrics: Metrics;
  oldMetrics: Metrics | null;
  trafficHistory: TrafficHistoryItem[];
}

export default function SeoInsights({ metrics, oldMetrics, trafficHistory }: SeoInsightsProps) {
  const trafficDelta = formatDeltaValue(metrics.TRAFFIC, oldMetrics?.TRAFFIC ?? null);

  return (
    <section aria-label="SEO Insights" className="space-y-4 border-b border-brand-gray-200 pb-4">
      {/* Section header */}
      <div className="flex items-center gap-1 border-b border-brand-gray-200 pb-2">
        <h3 className="text-base font-medium text-brand-navy">SEO Insights</h3>
        <span className="mb-2">
          <InfoIcon />
          </span>
      </div>

      {/* Metrics grid: 3-column layout with vertical dividers */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-3">
        {/* Column 1: Domain Rating + Gauge */}
        <div className="flex flex-col gap-6 lg:w-[34%]">
          <MetricCard
            label="Domain Rating (DR)"
            value={metrics.DR}
            oldValue={oldMetrics?.DR}
            suffix="/100"
            formatValue={false}
          />
          <DomainRatingGauge value={metrics.DR} />
        </div>

        {/* Vertical divider */}
        <div className="hidden w-px shrink-0 bg-brand-gray-200 lg:block" />

        {/* Column 2: Organic traffic + Chart */}
        <div className="flex flex-col gap-3 lg:w-[33%]">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-normal text-brand-navy">
              <span>Organic traffic</span>
              <span className="mb-2">
              <InfoIcon />
              </span>
            </div>
            <div className="flex flex-wrap items-end gap-1">
              <span className="text-[32px] font-medium leading-none text-brand-blue">
                {metrics.TRAFFIC >= 1000 ? `${(metrics.TRAFFIC / 1000).toFixed(1)}K` : metrics.TRAFFIC}
              </span>
              {trafficDelta ? (
                <span className={`text-sm font-medium leading-[8px] ${getDeltaToneClass(metrics.TRAFFIC, oldMetrics?.TRAFFIC)}`}>
                  {trafficDelta}
                </span>
              ) : null}
            </div>
          </div>
          <TrafficChart data={trafficHistory} />
        </div>

        {/* Vertical divider */}
        <div className="hidden w-px shrink-0 bg-brand-gray-200 lg:block" />

        {/* Column 3: Keywords + Referring Domains stacked */}
        <div className="flex flex-col gap-3 lg:w-[30%]">
          <MetricCard label="Keywords" value={metrics.KEYWORDS} oldValue={oldMetrics?.KEYWORDS} />
          <div className="border-b border-brand-gray-200" />
          <MetricCard label="Referring Domains" value={metrics.RD} oldValue={oldMetrics?.RD} />
        </div>
      </div>
    </section>
  );
}
