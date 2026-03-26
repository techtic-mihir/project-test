import InfoIcon from "@/components/InfoIcon";
import ChatGPTIcon from "@/icons/chatgpt.svg";
import GeminiIcon from "@/icons/gemini.svg";
import CopilotIcon from "@/icons/copilot.svg";
import PerplexityIcon from "@/icons/perplexity.svg";
import OverviewStarIcon from "@/icons/overview-star.svg";

type CitationItem = {
  name: string;
  value: number;
  delta?: number;
  pages: number;
  pagesDelta: number;
  icon: JSX.Element;
};

const citations: CitationItem[] = [
  {
    name: "Overview",
    value: 57,
    delta: -33,
    pages: 33,
    pagesDelta: -23,
    icon: <OverviewStarIcon width={16} height={16} style={{ color: "#3179ED" }} aria-hidden="true" />,
  },
  {
    name: "ChatGPT",
    value: 95,
    delta: 8,
    pages: 33,
    pagesDelta: 12,
    icon: <ChatGPTIcon width={12} height={12} aria-hidden="true" />,
  },
  {
    name: "Perplexity",
    value: 73,
    pages: 58,
    pagesDelta: -3,
    icon: <PerplexityIcon width={10} height={12} aria-hidden="true" />,
  },
  {
    name: "Gemini",
    value: 0,
    pages: 33,
    pagesDelta: 20,
    icon: <GeminiIcon width={14} height={14} aria-hidden="true" />,
  },
  {
    name: "Copilot",
    value: 26,
    pages: 33,
    pagesDelta: -19,
    icon: <CopilotIcon width={12} height={12} aria-hidden="true" />,
  },
];

export default function AiCitations() {
  // Layout: Row 1 = Overview, ChatGPT, Perplexity | Row 2 = Gemini, Copilot
  const row1 = [citations[0], citations[1], citations[2]];
  const row2 = [citations[3], citations[4]];

  return (
    <section aria-label="AI Citations" className="space-y-4">
      {/* Section header (NOT blurred) */}
      <div className="flex items-center gap-1 border-b border-brand-gray-200 pb-2">
        <h3 className="text-sm font-medium text-brand-navy sm:text-base">AI Citations</h3>
        <span className="mb-2">
          <InfoIcon />
        </span>
      </div>

      {/* Blurred content preview + coming soon overlay */}
      <div className="relative overflow-hidden rounded-card border border-brand-gray-200">
        <div aria-hidden="true" className="pointer-events-none select-none blur-[5px]">
          {/* Citations grid */}
          <div className="space-y-0 px-4 py-3">
            {/* Row 1: always 3 columns (even on mobile) */}
            <div className="grid grid-cols-3">
              {row1.map((item, index) => (
                <div
                  key={item.name}
                  className={`min-w-0 ${index < row1.length - 1 ? "border-r border-brand-gray-200" : ""}`}
                >
                  <CitationCell item={item} />
                </div>
              ))}
            </div>

            {/* Row 2: 2 columns + empty third column for alignment (still side-by-side on mobile) */}
            <div className="grid grid-cols-3">
              {row2.map((item, index) => (
                <div key={item.name} className={`min-w-0 ${index === 0 ? "border-r border-brand-gray-200" : ""}`}>
                  <CitationCell item={item} />
                </div>
              ))}
              <div />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/20 px-4 text-center">
          <p role="status" className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl">
            AI Citations Coming Soon
          </p>
        </div>
      </div>
    </section>
  );
}

function CitationCell({ item }: { item: CitationItem }) {
  return (
    <article className="w-full space-y-2 border-b border-brand-gray-200 py-3 pr-0 first:pt-0 sm:pr-2.5">
      {/* Icon + Name */}
      <div className="flex items-center gap-1 text-sm font-normal text-brand-navy">
        {item.icon}
        <span>{item.name}</span>
      </div>

      {/* Main value + delta */}
      <div className="flex flex-wrap items-end gap-1">
        <span className="text-[28px] font-medium leading-none text-brand-blue sm:text-[32px]">{item.value}</span>
        {item.delta !== undefined && item.delta !== 0 ? (
          <span className={`text-sm font-medium leading-[13px] ${item.delta > 0 ? "text-brand-green" : "text-brand-orange"}`}>
            {item.delta > 0 ? `+${item.delta}` : item.delta}
          </span>
        ) : null}
      </div>

      {/* Pages row */}
      <div className="flex items-center gap-0.5">
        <span className="text-sm font-medium leading-[17px] text-brand-blue">{item.pages}</span>
        <span className="text-sm font-normal leading-[17px] text-brand-gray-400">pages</span>
        <span className={`text-sm font-medium leading-[17px] ${item.pagesDelta >= 0 ? "text-brand-green" : "text-brand-orange"}`}>
          {item.pagesDelta > 0 ? `+${item.pagesDelta}` : item.pagesDelta}
        </span>
      </div>
    </article>
  );
}
