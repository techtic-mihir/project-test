export interface ProjectItem {
  PROJECT: string;
  THUMBNAIL: string | null;
}

export interface ProjectsResponse {
  data: ProjectItem[];
}

export interface Metrics {
  DR: number;
  TRAFFIC: number;
  RD: number;
  KEYWORDS: number;
}

export interface ProjectMetricsResponse {
  metrics: Metrics;
  oldMetrics: Metrics | null;
}

export interface TrafficHistoryItem {
  TRAFFIC: number;
  DATE: string;
}

export interface CreateProjectResponse {
  success: boolean;
}
