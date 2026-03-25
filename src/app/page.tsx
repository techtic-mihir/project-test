import type { Metadata } from "next";
import ProjectsCard from "@/components/ProjectsCard";
import { getProjectMetrics, getProjects, getProjectTrafficHistory } from "@/lib/api";
import type { Metrics, ProjectItem, TrafficHistoryItem } from "@/types";

interface HomePageProps {
  searchParams?: {
    project?: string;
  };
}

async function resolveActiveProject(projects: ProjectItem[], requested?: string): Promise<ProjectItem | null> {
  if (!projects.length) {
    return null;
  }

  if (!requested) {
    return projects[0];
  }

  return projects.find((project) => project.PROJECT === requested) ?? projects[0];
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  let projects: ProjectItem[] = [];
  try {
    projects = await getProjects();
  } catch {
    projects = [];
  }
  const activeProject = await resolveActiveProject(projects, searchParams?.project);

  if (!activeProject) {
    return { title: { absolute: "Projects — Dashboard" } };
  }

  return {
    title: activeProject.PROJECT,
    icons: activeProject.THUMBNAIL ? { icon: activeProject.THUMBNAIL } : undefined,
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  let projects: ProjectItem[] = [];
  try {
    projects = await getProjects();
  } catch {
    projects = [];
  }
  const activeProject = await resolveActiveProject(projects, searchParams?.project);

  let initialMetrics: Metrics | null = null;
  let initialOldMetrics: Metrics | null = null;
  let initialTrafficHistory: TrafficHistoryItem[] = [];

  if (activeProject) {
    try {
      const [metricsResponse, trafficHistory] = await Promise.all([
        getProjectMetrics(activeProject.PROJECT),
        getProjectTrafficHistory(activeProject.PROJECT),
      ]);
      initialMetrics = metricsResponse.metrics;
      initialOldMetrics = metricsResponse.oldMetrics;
      initialTrafficHistory = trafficHistory;
    } catch {
      initialMetrics = null;
      initialOldMetrics = null;
      initialTrafficHistory = [];
    }
  }

  return (
    <main className="min-h-screen bg-brand-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[674px]">
        <ProjectsCard
          projects={projects}
          activeProject={activeProject?.PROJECT ?? null}
          initialMetrics={initialMetrics}
          initialOldMetrics={initialOldMetrics}
          initialTrafficHistory={initialTrafficHistory}
        />
      </div>
    </main>
  );
}
