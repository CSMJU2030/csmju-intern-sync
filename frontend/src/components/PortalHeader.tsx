import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";

export default function PortalHeader({ active }: { active?: "student" | "teacher" }) {
  return (
    <header className="border-b border-surface-border bg-surface">
      <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap aria-hidden="true" size={23} strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-lg font-bold leading-tight text-primary-dark">InternSync</span>
            <span className="hidden text-xs text-muted sm:block">ระบบติดตามการฝึกงานสหกิจศึกษา</span>
          </span>
        </Link>

        <nav aria-label="เมนูหลัก" className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/student"
            aria-current={active === "student" ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active === "student" ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-muted hover:text-foreground"}`}
          >
            นักศึกษา
          </Link>
          <Link
            href="/teacher"
            aria-current={active === "teacher" ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active === "teacher" ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-muted hover:text-foreground"}`}
          >
            <span className="hidden sm:inline">อาจารย์นิเทศก์</span>
            <span className="sm:hidden">อาจารย์</span>
          </Link>
          <a
            href="https://www.maejo.ac.th/"
            target="_blank"
            rel="noreferrer"
            aria-label="เว็บไซต์มหาวิทยาลัยแม่โจ้ (เปิดแท็บใหม่)"
            className="ml-1 hidden rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-primary sm:inline-flex"
          >
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </nav>
      </div>
    </header>
  );
}