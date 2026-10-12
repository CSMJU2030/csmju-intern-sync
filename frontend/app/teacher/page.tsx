'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Check, ChevronDown, ClipboardCheck, MapPin } from 'lucide-react';
import PortalHeader from '@/src/components/PortalHeader';
import {
  approveLogbook,
  LOGBOOKS_UPDATED_EVENT,
  readLogbooks,
  type Logbook,
} from '@/src/lib/logbooks';

const SupervisionMap = dynamic(
  () => import('@/src/components/SupervisionMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[440px] items-center justify-center rounded-lg bg-background text-sm text-muted">
        กำลังโหลดแผนที่...
      </div>
    ),
  },
);

export default function TeacherDashboard() {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('all');

  useEffect(() => {
    const refreshLogbooks = () => setLogbooks(readLogbooks());
    refreshLogbooks();
    window.addEventListener(LOGBOOKS_UPDATED_EVENT, refreshLogbooks);
    window.addEventListener('storage', refreshLogbooks);

    return () => {
      window.removeEventListener(LOGBOOKS_UPDATED_EVENT, refreshLogbooks);
      window.removeEventListener('storage', refreshLogbooks);
    };
  }, []);

  const handleApprove = (id: string) => {
    setLogbooks(approveLogbook(id));
  };

  const pendingCount = logbooks.filter((logbook) => logbook.status === 'pending').length;
  const countries = Array.from(
    new Map(
      logbooks.flatMap((logbook) =>
        logbook.location?.countryCode && logbook.location.countryName
          ? [[logbook.location.countryCode, logbook.location.countryName] as const]
          : [],
      ),
    ),
  ).sort((first, second) => first[1].localeCompare(second[1], 'th'));
  const filteredLogbooks =
    selectedCountry === 'all'
      ? logbooks
      : logbooks.filter(
          (logbook) =>
            (selectedCountry === 'unknown' &&
              logbook.location &&
              !logbook.location.countryCode) ||
            logbook.location?.countryCode === selectedCountry,
        );
  const locatedLogbookCount = filteredLogbooks.filter(
    (logbook) => logbook.location,
  ).length;
  const weeks = Array.from({ length: 8 }, (_, index) => index + 1);

  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader active="teacher" />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">พื้นที่อาจารย์นิเทศก์</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-primary-dark">ติดตามความก้าวหน้านักศึกษา</h1>
            <p className="mt-2 text-base text-muted">ตรวจบันทึกการฝึกงานและบันทึกการนิเทศในสถานประกอบการ</p>
          </div>
          <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning">Logbook: โหมดตัวอย่าง</span>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-border bg-surface p-5"><p className="text-sm text-muted">นักศึกษาในความดูแล</p><p className="mt-1 text-2xl font-bold text-primary-dark">12 คน</p></div>
          <div className="rounded-xl border border-surface-border bg-surface p-5"><p className="text-sm text-muted">บันทึกรอตรวจ</p><p className="mt-1 text-2xl font-bold text-warning">{pendingCount} รายการ</p></div>
          <div className="rounded-xl border border-surface-border bg-surface p-5"><p className="text-sm text-muted">แผนการนิเทศ</p><p className="mt-1 text-2xl font-bold text-primary-dark">3 ครั้ง</p></div>
        </div>

        <section aria-labelledby="reviews-title" className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary"><ClipboardCheck aria-hidden="true" size={20} /></span>
            <div><h2 id="reviews-title" className="font-bold">บันทึกการฝึกงาน</h2><p className="text-sm text-muted">แยกตามสัปดาห์</p></div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {weeks.map((week) => {
              const weekLogbooks = logbooks.filter((logbook) => logbook.week === week);
              const weekPendingCount = weekLogbooks.filter((logbook) => logbook.status === 'pending').length;
              const hasPending = weekPendingCount > 0;

              return (
                <details
                  key={week}
                  open={hasPending}
                  className="group self-start rounded-xl border border-surface-border bg-surface"
                >
                  <summary className="flex min-h-20 cursor-pointer list-none items-center gap-3 rounded-xl p-4 hover:bg-background [&::-webkit-details-marker]:hidden">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft font-bold text-primary">{week}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">สัปดาห์ที่ {week}</span>
                      <span className="mt-1 block text-xs text-muted">{weekLogbooks.length === 0 ? 'ยังไม่มีบันทึก' : `${weekLogbooks.length} รายการ`}</span>
                    </span>
                    {hasPending && <span className="shrink-0 rounded-full bg-warning-soft px-2 py-1 text-xs font-semibold text-warning">รอตรวจ {weekPendingCount}</span>}
                    {weekLogbooks.length > 0 && !hasPending && <Check aria-label="ตรวจแล้ว" className="shrink-0 text-success" size={18} />}
                    <ChevronDown aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" size={18} />
                  </summary>

                  <div className="space-y-4 border-t border-surface-border px-4 py-4">
                    {weekLogbooks.length === 0 ? (
                      <p className="text-sm text-muted">ยังไม่มีบันทึกส่งเข้ามา</p>
                    ) : (
                      weekLogbooks.map((logbook) => (
                        <article key={logbook.id} className="border-b border-surface-border pb-4 last:border-0 last:pb-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold">{logbook.studentName}</p>
                              {logbook.studentId && (
                                <p className="mt-1 text-xs text-muted">รหัสนักศึกษา {logbook.studentId}</p>
                              )}
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${logbook.status === 'approved' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                              {logbook.status === 'approved' ? 'อนุมัติแล้ว' : 'รอตรวจ'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted">ส่งเมื่อ {new Date(logbook.submittedAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{logbook.details}</p>
                          {logbook.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(logbook.id)}
                              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            >
                              <Check aria-hidden="true" size={16} />อนุมัติบันทึก
                            </button>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="visit-title" className="rounded-xl border border-surface-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-surface-border pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-soft text-success"><MapPin aria-hidden="true" size={20} /></span>
              <div><h2 id="visit-title" className="font-bold">แผนที่โลก — ตำแหน่งขณะส่งบันทึก</h2><p className="text-sm text-muted">เลือกประเทศเพื่อกรองตำแหน่งที่นักศึกษาแนบมา</p></div>
            </div>

            <div className="mb-4 max-w-sm">
              <label htmlFor="country-filter" className="mb-2 block text-sm font-semibold">ประเทศ</label>
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">ทุกประเทศ</option>
                {countries.map(([countryCode, countryName]) => (
                  <option key={countryCode} value={countryCode}>{countryName}</option>
                ))}
                {logbooks.some(
                  (logbook) =>
                    logbook.location && !logbook.location.countryCode,
                ) && <option value="unknown">ไม่ทราบประเทศ</option>}
              </select>
            </div>
            <SupervisionMap logbooks={filteredLogbooks} />
            <p className="mt-3 text-xs text-muted">
              แสดง {locatedLogbookCount} จาก {filteredLogbooks.length} บันทึกในตัวกรองที่มีพิกัด · พิกัดเป็นตำแหน่งอุปกรณ์ ไม่ใช่การยืนยันสถานที่ฝึกงาน
            </p>
        </section>
        <p className="mt-8 text-center text-xs text-muted">InternSync · มหาวิทยาลัยแม่โจ้</p>
      </main>
    </div>
  );
}