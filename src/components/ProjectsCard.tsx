import ProjectsCardClient from "@/components/ProjectsCardClient";
import type { Metrics, ProjectItem, TrafficHistoryItem } from "@/types";

interface ProjectsCardProps {
  projects: ProjectItem[];
  activeProject: string | null;
  initialMetrics: Metrics | null;
  initialOldMetrics: Metrics | null;
  initialTrafficHistory: TrafficHistoryItem[];
}

export default function ProjectsCard({
  projects,
  activeProject,
  initialMetrics,
  initialOldMetrics,
  initialTrafficHistory,
}: ProjectsCardProps) {
  return (
    <ProjectsCardClient
      initialProjects={projects}
      initialActiveProject={activeProject}
      initialMetrics={initialMetrics}
      initialOldMetrics={initialOldMetrics}
      initialTrafficHistory={initialTrafficHistory}
    />
  );
}
