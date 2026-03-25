"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AiCitations from "@/components/AiCitations";
import EmptyState from "@/components/EmptyState";
import SeoInsights from "@/components/SeoInsights";
import SkeletonLoader from "@/components/SkeletonLoader";
import { getProjectMetrics, getProjectTrafficHistory } from "@/lib/api";
import type { Metrics, ProjectItem, TrafficHistoryItem } from "@/types";

interface ProjectsCardClientProps {
  initialProjects: ProjectItem[];
  initialActiveProject: string | null;
  initialMetrics: Metrics | null;
  initialOldMetrics: Metrics | null;
  initialTrafficHistory: TrafficHistoryItem[];
}

type MetricsCache = Record<
  string,
  {
    metrics: Metrics;
    oldMetrics: Metrics | null;
    trafficHistory: TrafficHistoryItem[];
  }
>;

export default function ProjectsCardClient({
  initialProjects,
  initialActiveProject,
  initialMetrics,
  initialOldMetrics,
  initialTrafficHistory,
}: ProjectsCardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeProject, setActiveProject] = useState<string | null>(initialActiveProject);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [cache, setCache] = useState<MetricsCache>(() =>
    initialActiveProject && initialMetrics
      ? {
          [initialActiveProject]: {
            metrics: initialMetrics,
            oldMetrics: initialOldMetrics,
            trafficHistory: initialTrafficHistory,
          },
        }
      : {},
  );

  const activeData = useMemo(() => {
    if (!activeProject) {
      return null;
    }
    return cache[activeProject] ?? null;
  }, [activeProject, cache]);

  async function updateProjectData(projectName: string) {
    if (cache[projectName]) {
      setActiveProject(projectName);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [metricsResponse, trafficHistory] = await Promise.all([
        getProjectMetrics(projectName),
        getProjectTrafficHistory(projectName),
      ]);

      setCache((previous) => ({
        ...previous,
        [projectName]: {
          metrics: metricsResponse.metrics,
          oldMetrics: metricsResponse.oldMetrics,
          trafficHistory,
        },
      }));
      setActiveProject(projectName);
    } catch {
      setError("Failed to load data. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProjectChange(projectName: string) {
    // Exit add-project mode when selecting a real project
    setShowAddProject(false);
    await updateProjectData(projectName);

    const params = new URLSearchParams(searchParams.toString());
    params.set("project", projectName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    document.title = `${projectName} — Projects`;

    const current = initialProjects.find((item) => item.PROJECT === projectName);
    if (current?.THUMBNAIL) {
      const faviconElement = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (faviconElement) {
        faviconElement.href = current.THUMBNAIL;
      }
    }
  }

  function handleAddProjectClick() {
    if (initialProjects.length > 0) {
      setShowAddProject(true);
      setActiveProject(null);
    }
  }

  return (
    <div className="rounded-card bg-brand-white p-4 sm:p-6 lg:p-8">
      {/* Header row */}
      <div className="mb-8 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-medium text-brand-navy">
          {initialProjects.length > 0 ? "Projekte" : "Projects"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex cursor-not-allowed items-center gap-1 rounded-btn bg-brand-gray-100 px-3 py-2 text-base font-medium text-brand-navy transition-colors hover:bg-brand-gray-200"
            aria-label="Detailed Analytics"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 14L8 10L11 13L16 7" stroke="#2B456B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 11V7H12" stroke="#2B456B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:block">Detailed Analytics</span>
          </button>
          <button
            type="button"
            className="flex h-[42px] w-[42px] cursor-not-allowed items-center justify-center rounded-btn bg-brand-gray-100 transition-colors hover:bg-brand-gray-200"
            aria-label="Export"
          >
            <svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 14L14.7 7.3M9 6.8H15.2V13" stroke="#2B456B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 11.5V16C15 16.6 14.6 17 14 17H6C5.4 17 5 16.6 5 16V8C5 7.4 5.4 7 6 7H10.5" stroke="#2B456B" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project tabs */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max flex-nowrap gap-3">
          {initialProjects.map((project) => {
            const isActive = !showAddProject && activeProject === project.PROJECT;
            return (
              <button
                type="button"
                key={project.PROJECT}
                onClick={() => handleProjectChange(project.PROJECT)}
                className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-pill px-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive
                    ? "border-[1.5px] border-brand-indigo bg-[rgba(62,79,234,0.10)] text-brand-indigo"
                    : "bg-brand-gray-100 text-brand-navy hover:bg-brand-gray-200"
                }`}
                aria-pressed={isActive}
              >
                {project.THUMBNAIL ? (
                  <Image
                    src={project.THUMBNAIL}
                    alt=""
                    className="h-[15px] w-[15px] rounded-full object-cover"
                    width={15}
                    height={15}
                  />
                ) : (
                  <span className="h-[15px] w-[15px] rounded-full bg-brand-gray-200" aria-hidden="true" />
                )}
                <span>{project.PROJECT}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleAddProjectClick}
            className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-pill px-3 text-sm font-medium transition-all duration-200 ease-in-out ${
              showAddProject
                ? "border-[1.5px] border-brand-indigo bg-[rgba(62,79,234,0.10)] text-brand-indigo"
                : "bg-brand-gray-100 text-brand-navy hover:bg-brand-gray-200"
            }`}
            aria-label="Add project"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke={showAddProject ? "#3E4FEA" : "#2B456B"} strokeWidth="1.4" />
              <path d="M8 5V11M5 8H11" stroke={showAddProject ? "#3E4FEA" : "#2B456B"} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span>project</span>
          </button>
        </div>
      </div>

      {/* Content area */}
      {showAddProject ? (
        /* Show Empty State with blurred background + "Add your first project" overlay */
        <EmptyState />
      ) : initialProjects.length > 0 ? (
        <div className="rounded-card border border-brand-gray-200 p-3 sm:p-4">
          {isLoading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
              {activeProject ? (
                <button
                  type="button"
                  className="rounded-pill bg-brand-gray-100 px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-gray-200"
                  onClick={() => updateProjectData(activeProject)}
                >
                  Retry
                </button>
              ) : null}
            </div>
          ) : activeData ? (
            <div key={activeProject} className="animate-fadeSlideUp space-y-4">
              <SeoInsights
                metrics={activeData.metrics}
                oldMetrics={activeData.oldMetrics}
                trafficHistory={activeData.trafficHistory}
              />
              <AiCitations />
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
