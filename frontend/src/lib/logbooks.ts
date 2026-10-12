export type Logbook = {
  id: string;
  studentName: string;
  studentId?: string;
  week: number;
  details: string;
  submittedAt: string;
  status: "pending" | "approved";
  location?: {
    latitude: number;
    longitude: number;
    countryCode?: string;
    countryName?: string;
  };
};

const STORAGE_KEY = "internsync:logbooks:v1";
export const LOGBOOKS_UPDATED_EVENT = "internsync:logbooks-updated";

function isLocation(
  value: unknown,
): value is NonNullable<Logbook["location"]> {
  if (typeof value !== "object" || value === null) return false;

  const location = value as Record<string, unknown>;
  return (
    typeof location.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    typeof location.longitude === "number" &&
    Number.isFinite(location.longitude) &&
    location.longitude >= -180 &&
    location.longitude <= 180 &&
    (location.countryCode === undefined ||
      (typeof location.countryCode === "string" &&
        /^[a-z]{2}$/.test(location.countryCode))) &&
    (location.countryName === undefined ||
      typeof location.countryName === "string")
  );
}

function isLogbook(value: unknown): value is Logbook {
  if (!value || typeof value !== "object") return false;

  const logbook = value as Record<string, unknown>;
  return (
    typeof logbook.id === "string" &&
    typeof logbook.studentName === "string" &&
    (logbook.studentId === undefined ||
      typeof logbook.studentId === "string") &&
    typeof logbook.week === "number" &&
    typeof logbook.details === "string" &&
    typeof logbook.submittedAt === "string" &&
    (logbook.status === "pending" || logbook.status === "approved") &&
    (logbook.location === undefined || isLocation(logbook.location))
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

export function submitLogbook(
  studentName: string,
  studentId: string,
  week: number,
  details: string,
  location?: Logbook["location"],
): Logbook {
  const normalizedStudentName = studentName.trim();
  const normalizedStudentId = studentId.trim();
  if (!normalizedStudentName || !normalizedStudentId) {
    throw new Error("Student name and ID are required to submit a logbook");
  }

  const logbook: Logbook = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    studentName: normalizedStudentName,
    studentId: normalizedStudentId,
    week,
    details,
    submittedAt: new Date().toISOString(),
    status: "pending",
    ...(location ? { location } : {}),
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