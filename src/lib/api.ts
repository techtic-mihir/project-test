import {
  CreateProjectResponse,
  ProjectItem,
  ProjectMetricsResponse,
  ProjectsResponse,
  TrafficHistoryItem,
} from "@/types";

const BASE_URL = "https://hire-test-dbil.onrender.com";
const REQUEST_TIMEOUT_MS = 90_000;

async function request<T>(
  endpoint: string,
  init?: RequestInit,
  noStore = true,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...init,
      cache: noStore ? "no-store" : init?.cache,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("Request timed out. The server may be waking up.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  const response = await request<ProjectsResponse>("/get-dashboard-projects");
  return response.data ?? [];
}

export async function getProjectMetrics(
  project: string,
): Promise<ProjectMetricsResponse> {
  return request<ProjectMetricsResponse>(
    `/get-dashboard-project-metrics?project=${encodeURIComponent(project)}`,
  );
}

export async function getProjectTrafficHistory(
  project: string,
): Promise<TrafficHistoryItem[]> {
  return request<TrafficHistoryItem[]>(
    `/get-dashboard-project-traffic-history?project=${encodeURIComponent(project)}`,
  );
}

export async function createDashboardProject(
  project: string,
): Promise<CreateProjectResponse> {
  return request<CreateProjectResponse>(
    "/create-dashboard-project",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project }),
    },
    false,
  );
}
