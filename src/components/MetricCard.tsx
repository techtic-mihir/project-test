import InfoIcon from "@/components/InfoIcon";
import { formatDeltaValue, formatMetricValue, getDeltaToneClass } from "@/lib/formatters";

interface MetricCardProps {
  label: string;
  value: number;
  oldValue?: number | null;
  suffix?: string;
  formatValue?: boolean;
}

export default function MetricCard({
  label,
  value,
  oldValue = null,
  suffix,
  formatValue = true,
}: MetricCardProps) {
  const formattedValue = formatValue ? formatMetricValue(value) : `${value}`;
  const deltaText = formatDeltaValue(value, oldValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-sm font-normal text-brand-navy">
        <span>{label}</span>
        <span className="mb-2">
          <InfoIcon />
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
        <span className="text-[32px] font-medium leading-none text-brand-blue">{formattedValue}</span>
        {deltaText ? (
          <span className={`text-sm font-medium leading-[17px] ${getDeltaToneClass(value, oldValue)}`}>
            {deltaText}
          </span>
        ) : null}
        {suffix ? <span className="text-sm font-medium leading-[17px] text-brand-navy">{suffix}</span> : null}
      </div>
    </div>
  );
}
