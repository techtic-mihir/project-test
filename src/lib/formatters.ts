function formatCompactValue(value: number): string {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (absolute >= 1_000) {
    const compact = value / 1_000;
    const rounded = Number.isInteger(compact) ? compact.toFixed(0) : compact.toFixed(1);
    return `${rounded}K`;
  }

  return `${value}`;
}

export function formatMetricValue(value: number): string {
  return formatCompactValue(value);
}

export function formatDeltaValue(current: number, previous?: number | null): string | null {
  if (previous === null || previous === undefined) {
    return null;
  }

  const delta = current - previous;
  if (delta === 0) {
    return null;
  }

  const sign = delta > 0 ? "+" : "-";
  return `${sign}${formatCompactValue(Math.abs(delta))}`;
}

export function getDeltaToneClass(current: number, previous?: number | null): string {
  if (previous === null || previous === undefined) {
    return "text-brand-orange";
  }

  const delta = current - previous;
  return delta >= 0 ? "text-brand-green" : "text-brand-orange";
}

export function formatChartAxisValue(value: number): string {
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)} K`;
  }
  return `${value}`;
}

export function formatMonthLabel(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short" });
}
