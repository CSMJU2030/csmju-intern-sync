import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  MapPin,
  UsersRound,
} from "lucide-react";
import PortalHeader from "@/src/components/PortalHeader";

export default function InternSyncPage() {
  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <section aria-labelledby="welcome-title" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold text-primary">MAEJO UNIVERSITY · COOPERATIVE EDUCATION</p>
            <h1 id="welcome-title" className="max-w-2xl font-display text-3xl font-bold leading-tight text-primary-dark sm:text-4xl">
              ติดตามการฝึกงาน<br className="hidden sm:block" />ได้ครบในที่เดียว
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              พื้นที่ทำงานสำหรับนักศึกษาและอาจารย์นิเทศก์ ตั้งแต่บันทึกประจำสัปดาห์ไปจนถึงการติดตามผลการฝึกงาน
            </p>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-primary/20 pl-4 text-sm text-muted lg:mb-1">
            <CalendarDays aria-hidden="true" className="shrink-0 text-primary" size={21} />
            <p>ภาคเรียนที่ 1 <span className="mx-1 text-surface-border">/</span> ปีการศึกษา 2569</p>
          </div>
        </section>

        <section aria-labelledby="workspace-title" className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="workspace-title" className="text-xl font-bold text-foreground">เลือกพื้นที่ทำงาน</h2>
              <p className="mt-1 text-sm text-muted">เข้าสู่เครื่องมือที่ตรงกับบทบาทของคุณ</p>
            </div>
            <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning">ข้อมูลตัวอย่าง</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/student" className="group flex min-h-44 flex-col justify-between rounded-xl border border-surface-border bg-surface p-6 transition hover:border-primary/40 hover:shadow-md focus-visible:outline-offset-4">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <BookOpenCheck aria-hidden="true" size={24} />
                </span>
                <ArrowRight aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" size={20} />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-foreground">พื้นที่นักศึกษา</h3>
                <p className="mt-1 text-sm text-muted">ส่งบันทึกการปฏิบัติงานประจำสัปดาห์</p>
              </div>
            </Link>
            <Link href="/teacher" className="group flex min-h-44 flex-col justify-between rounded-xl border border-surface-border bg-surface p-6 transition hover:border-primary/40 hover:shadow-md focus-visible:outline-offset-4">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft text-success">
                  <ClipboardCheck aria-hidden="true" size={24} />
                </span>
                <ArrowRight aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" size={20} />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-foreground">พื้นที่อาจารย์นิเทศก์</h3>
                <p className="mt-1 text-sm text-muted">ตรวจบันทึกและบันทึกการนิเทศ</p>
              </div>
            </Link>
          </div>
        </section>

        <section aria-labelledby="overview-title" className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 id="overview-title" className="text-xl font-bold text-foreground">ภาพรวมระบบ</h2>
            <span className="text-xs text-muted">ตัวอย่างการแสดงผล</span>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-surface-border bg-surface-border sm:grid-cols-3">
            <div className="flex items-center gap-4 bg-surface p-5">
              <UsersRound aria-hidden="true" className="shrink-0 text-primary" size={22} />
              <div><p className="text-2xl font-bold text-primary-dark">24</p><p className="text-sm text-muted">นักศึกษาฝึกงาน</p></div>
            </div>
            <div className="flex items-center gap-4 bg-surface p-5">
              <FileText aria-hidden="true" className="shrink-0 text-primary" size={22} />
              <div><p className="text-2xl font-bold text-primary-dark">8</p><p className="text-sm text-muted">บันทึกรอตรวจ</p></div>
            </div>
            <div className="flex items-center gap-4 bg-surface p-5">
              <MapPin aria-hidden="true" className="shrink-0 text-primary" size={22} />
              <div><p className="text-2xl font-bold text-primary-dark">3</p><p className="text-sm text-muted">แผนการนิเทศ</p></div>
            </div>
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t border-surface-border pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>InternSync · มหาวิทยาลัยแม่โจ้</p>
          <p>ระบบต้นแบบเพื่อการจัดการฝึกงานสหกิจศึกษา</p>
        </footer>
      </main>
    </div>
  );
}