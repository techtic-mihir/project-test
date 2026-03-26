import AddProjectInput from "@/components/AddProjectInput";
import AiCitations from "@/components/AiCitations";
import SeoInsights from "@/components/SeoInsights";
import type { Metrics, TrafficHistoryItem } from "@/types";

export type DashboardSnapshot = {
  metrics: Metrics;
  oldMetrics: Metrics | null;
  trafficHistory: TrafficHistoryItem[];
};

/** Ghost layer: real SEO + AI layout when snapshot exists; otherwise static placeholders (no projects). */
export function DashboardGhostBackground({ snapshot }: { snapshot?: DashboardSnapshot | null }) {
  if (snapshot) {
    return (
      <div className="space-y-4 p-4 opacity-30 blur-[3px] select-none pointer-events-none" aria-hidden="true">
        <SeoInsights
          metrics={snapshot.metrics}
          oldMetrics={snapshot.oldMetrics}
          trafficHistory={snapshot.trafficHistory}
        />
        <AiCitations />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 opacity-30 blur-[3px] select-none pointer-events-none" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-brand-gray-200 pb-2 text-base font-medium text-brand-navy">
        SEO Insights &amp; AI citations
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="6" stroke="#ABABAB" strokeWidth="1.17" />
          <text x="7" y="10" textAnchor="middle" fill="#ABABAB" fontSize="8" fontFamily="sans-serif">
            i
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-brand-navy">Domain Rating (DR)</div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-medium text-brand-blue">77</span>
              <span className="text-xs text-brand-green">+3</span>
            </div>
            <div className="text-xs text-brand-navy">/100</div>
          </div>
          <div className="flex justify-start">
            <svg viewBox="0 0 140 80" className="h-16 w-24">
              <path d="M15 70 A55 55 0 0 1 125 70" fill="none" stroke="#E9EAEB" strokeWidth="14" strokeLinecap="round" />
              <path
                d="M15 70 A55 55 0 0 1 125 70"
                fill="none"
                stroke="#0080FF"
                strokeWidth="14"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={23}
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-brand-navy">Organic traffic</div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-medium text-brand-blue">429.9K</span>
            <span className="text-xs text-brand-green">+31.8K</span>
          </div>
          <div className="h-20 rounded bg-brand-gray-100" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-brand-navy">Keywords</div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-medium text-brand-blue">273</span>
              <span className="text-xs text-brand-green">+97</span>
            </div>
          </div>
          <div className="border-b border-brand-gray-200" />
          <div className="space-y-1">
            <div className="text-xs text-brand-navy">Referring Domains</div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-medium text-brand-blue">273</span>
              <span className="text-xs text-brand-green">+97</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-gray-200 pt-2 text-xs text-brand-navy">AI citations</div>
      <div className="grid grid-cols-3 gap-3">
        {["Overview", "ChatGPT", "Perplexity", "Gemini", "Copilot"].map((name) => (
          <div key={name} className="border-b border-brand-gray-200 pb-3">
            <div className="text-xs text-brand-navy">{name}</div>
            <div className="text-2xl font-medium text-brand-blue">57</div>
            <div className="text-xs text-brand-blue">
              33 <span className="text-brand-gray-400">pages</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyStateOverlay({
  variant,
  onAddSuccess,
}: {
  variant: "first" | "add";
  onAddSuccess?: () => void;
}) {
  const title =
    variant === "first" ? (
      <>
        Add your first project
        <br />
        to view your Statistics
      </>
    ) : (
      <>
        Add a new project
        <br />
        Enter your website URL below
      </>
    );

  return (
    <div
      className="absolute inset-0 flex flex-col rounded-card bg-transparent p-4"
      style={{
        backdropFilter: "blur(6px) blur(3px)",
        WebkitBackdropFilter: "blur(6px) blur(3px)",
      }}
    >
      <div className="flex items-center gap-1.5 border-b border-brand-gray-200 pb-2 text-base font-medium text-brand-navy">
        SEO Insights &amp; AI citations
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="6" stroke="#ABABAB" strokeWidth="1.17" />
          <text
            x="7"
            y="10"
            textAnchor="middle"
            fill="#ABABAB"
            fontSize="8"
            fontFamily="sans-serif"
          >
            i
          </text>
        </svg>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h2 className="text-center text-2xl font-medium leading-[1.2] text-brand-navy">{title}</h2>
        <AddProjectInput onSuccess={onAddSuccess} />
      </div>
    </div>
  );
}

export default function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-card border border-brand-gray-200">
      
      <DashboardGhostBackground />
      <EmptyStateOverlay variant="first" />
    </div>
  );
}
