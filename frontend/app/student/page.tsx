'use client';
import { useState } from 'react';
import { Check, FileText, Send } from 'lucide-react';
import PortalHeader from '@/src/components/PortalHeader';

export default function StudentDashboard() {
  const [week, setWeek] = useState('1');
  const [details, setDetails] = useState('');
  const [submittedWeek, setSubmittedWeek] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedWeek(week);
    setDetails('');
  };

  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader active="student" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold text-primary">พื้นที่นักศึกษา</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-primary-dark">บันทึกการฝึกงานประจำสัปดาห์</h1>
          <p className="mt-2 max-w-2xl text-base text-muted">สรุปงานที่ปฏิบัติและสิ่งที่ได้เรียนรู้ เพื่อให้อาจารย์นิเทศก์ติดตามความก้าวหน้า</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section aria-labelledby="logbook-title" className="rounded-xl border border-surface-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-surface-border pb-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"><FileText aria-hidden="true" size={20} /></span>
              <div>
                <h2 id="logbook-title" className="text-lg font-bold">ส่ง Weekly Logbook</h2>
                <p className="mt-1 text-sm text-muted">กรอกข้อมูลให้ครบก่อนส่งบันทึก</p>
              </div>
            </div>

            {submittedWeek && (
              <div role="status" className="mb-5 flex items-start gap-3 rounded-lg border border-success/20 bg-success-soft p-4 text-sm text-success">
                <Check aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
                <p>บันทึกตัวอย่างสัปดาห์ที่ {submittedWeek} เรียบร้อยแล้ว ข้อมูลยังไม่ได้ส่งไปยังระบบจริง</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="week" className="mb-2 block text-sm font-semibold">สัปดาห์ที่</label>
                <select
                  id="week"
                  value={week}
                  onChange={(event) => setWeek(event.target.value)}
                  className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <option key={item} value={item}>สัปดาห์ที่ {item}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="details" className="mb-2 block text-sm font-semibold">รายละเอียดงานที่ปฏิบัติ</label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  rows={7}
                  maxLength={2000}
                  className="w-full resize-y rounded-lg border border-surface-border bg-surface px-4 py-3 text-base leading-relaxed placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="เล่างานที่ทำ ผลลัพธ์ที่ได้ หรือสิ่งที่ได้เรียนรู้ในสัปดาห์นี้"
                  required
                />
                <p className="mt-2 text-right text-xs text-muted">{details.length}/2,000 ตัวอักษร</p>
              </div>

              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark sm:w-auto">
                <Send aria-hidden="true" size={17} />
                ส่งบันทึก
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-xl border border-surface-border bg-surface p-5">
            <h2 className="font-bold text-primary-dark">ก่อนส่งบันทึก</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={16} />ระบุงานที่ทำให้เห็นภาพ</li>
              <li className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={16} />สรุปสิ่งที่ได้เรียนรู้</li>
              <li className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={16} />ตรวจสอบสัปดาห์ให้ถูกต้อง</li>
            </ul>
            <p className="mt-5 border-t border-surface-border pt-4 text-xs leading-relaxed text-muted">โหมดตัวอย่าง: การส่งข้อมูลในหน้านี้ยังไม่เชื่อมต่อฐานข้อมูล</p>
          </aside>
        </div>
        <p className="mt-8 text-center text-xs text-muted">InternSync · มหาวิทยาลัยแม่โจ้</p>
      </main>
    </div>
  );
}