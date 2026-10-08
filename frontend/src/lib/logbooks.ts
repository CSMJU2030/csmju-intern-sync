export type Logbook = {
  id: string;
  studentName: string;
  week: number;
  details: string;
  submittedAt: string;
  status: "pending" | "approved";
};

const STORAGE_KEY = "internsync:logbooks:v1";
export const LOGBOOKS_UPDATED_EVENT = "internsync:logbooks-updated";

function isLogbook(value: unknown): value is Logbook {
  if (!value || typeof value !== "object") return false;

  const logbook = value as Record<string, unknown>;
  return (
    typeof logbook.id === "string" &&
    typeof logbook.studentName === "string" &&
    typeof logbook.week === "number" &&
    typeof logbook.details === "string" &&
    typeof logbook.submittedAt === "string" &&
    (logbook.status === "pending" || logbook.status === "approved")
  );
}

export function readLogbooks(): Logbook[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isLogbook) : [];
  } catch {
    return [];
  }
}

function writeLogbooks(logbooks: Logbook[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logbooks));
  window.dispatchEvent(new Event(LOGBOOKS_UPDATED_EVENT));
}

export function submitLogbook(week: number, details: string): Logbook {
  const logbook: Logbook = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    studentName: "นายณัฐพงษ์ บุญสถิตย์",
    week,
    details,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  writeLogbooks([logbook, ...readLogbooks()]);
  return logbook;
}

export function approveLogbook(id: string): Logbook[] {
  const logbooks = readLogbooks().map((logbook) =>
    logbook.id === id ? { ...logbook, status: "approved" as const } : logbook,
  );
  writeLogbooks(logbooks);
  return logbooks;
}