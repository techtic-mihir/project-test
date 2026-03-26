"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AiCitations from "@/components/AiCitations";
import EmptyState, { DashboardGhostBackground, EmptyStateOverlay } from "@/components/EmptyState";
import SeoInsights from "@/components/SeoInsights";
import SkeletonLoader from "@/components/SkeletonLoader";
import { getProjectMetrics, getProjectTrafficHistory } from "@/lib/api";
import type { Metrics, ProjectItem, TrafficHistoryItem } from "@/types";
import TopRightDirectionArrowIcon from "@/icons/top-right-direction-arrow.svg";
import TrendUpIcon from "@/icons/trend-up-icon.svg";

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
  /** Project whose metrics are shown behind the “add project” overlay (previous selection). */
  const [addProjectBaseKey, setAddProjectBaseKey] = useState<string | null>(null);
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
    setShowAddProject(false);
    setAddProjectBaseKey(null);
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
      const base = activeProject ?? initialProjects[0].PROJECT;
      setAddProjectBaseKey(base);
      setShowAddProject(true);
    }
  }

  function handleAddProjectSuccess() {
    setShowAddProject(false);
    setAddProjectBaseKey(null);
  }

  const addOverlaySnapshot = addProjectBaseKey ? cache[addProjectBaseKey] : null;

  return (
    <div className="rounded-card bg-brand-white p-3.5 sm:p-6 lg:p-8">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium text-brand-navy sm:text-2xl">
          {initialProjects.length > 0 ? "Projekte" : "Projects"}
        </h1>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 rounded-btn bg-brand-gray-100 px-2.5 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-gray-200 sm:px-3 sm:text-base"
            aria-label="Detailed Analytics"
          >
            <TrendUpIcon aria-hidden="true" />
            <span className="hidden sm:block">Detailed Analytics</span>
          </button>
          <button
            type="button"
            className="flex cursor-pointer w-[42px] h-[42px] items-center justify-center rounded-btn bg-brand-gray-100 transition-colors hover:bg-brand-gray-200"
            aria-label="Export"
          >
            <TopRightDirectionArrowIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Project tabs */}
      <div className="mb-6 ml-0 overflow-x-auto scrollbar-hide sm:mb-8 sm:ml-3">
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
      {initialProjects.length > 0 ? (
        <div className="relative rounded-card">
          {!showAddProject ? (
            <>
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
            </>
          ) : null}

          {showAddProject ? (
            <div className="relative overflow-hidden">
              {addOverlaySnapshot ? (
                <DashboardGhostBackground
                  snapshot={{
                    metrics: addOverlaySnapshot.metrics,
                    oldMetrics: addOverlaySnapshot.oldMetrics,
                    trafficHistory: addOverlaySnapshot.trafficHistory,
                  }}
                />
              ) : (
                <div className="p-4">
                  <SkeletonLoader />
                </div>
              )}
              <EmptyStateOverlay variant="add" onAddSuccess={handleAddProjectSuccess} />
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
