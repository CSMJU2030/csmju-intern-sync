export type AuthenticatedProfile = {
  id: string;
  name: string | null;
  studentId: string | null;
  role: string;
};

export async function getAuthenticatedProfile(
  signal?: AbortSignal,
): Promise<AuthenticatedProfile> {
  const response = await fetch("/api/v1/me", {
    cache: "no-store",
    credentials: "same-origin",
    signal,
  });
  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "กรุณาเข้าสู่ระบบก่อนส่งบันทึก"
        : `ไม่สามารถโหลดข้อมูลผู้ใช้ได้ (HTTP ${response.status})`,
    );
  }

  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("success" in result) ||
    result.success !== true ||
    !("data" in result) ||
    typeof result.data !== "object" ||
    result.data === null
  ) {
    throw new Error("รูปแบบข้อมูลผู้ใช้จากเซิร์ฟเวอร์ไม่ถูกต้อง");
  }

  const data = result.data;
  if (
    !("id" in data) ||
    typeof data.id !== "string" ||
    !("name" in data) ||
    (typeof data.name !== "string" && data.name !== null) ||
    !("studentId" in data) ||
    (typeof data.studentId !== "string" && data.studentId !== null) ||
    !("role" in data) ||
    typeof data.role !== "string"
  ) {
    throw new Error("ข้อมูล profile ของผู้ใช้ไม่ครบถ้วน");
  }

  return {
    id: data.id,
    name: data.name,
    studentId: data.studentId,
    role: data.role,
  };
}
