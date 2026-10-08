'use client';
import { useState } from 'react';
import { Check, ClipboardCheck, MapPin, Navigation } from 'lucide-react';
import PortalHeader from '@/src/components/PortalHeader';

export default function TeacherDashboard() {
  const [gpsStatus, setGpsStatus] = useState('ยังไม่ได้บันทึกพิกัด');
  const [approved, setApproved] = useState(false);

  const handleCheckIn = () => {
    setGpsStatus('บันทึกพิกัดตัวอย่างแล้ว · 18.89, 99.01');
  };

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
          <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning">ข้อมูลตัวอย่าง</span>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-border bg-surface p-5"><p className="text-sm text-muted">นักศึกษาในความดูแล</p><p className="mt-1 text-2xl font-bold text-primary-dark">12 คน</p></div>
          <div className="rounded-xl border border-surface-border bg-surface p-5"><p className="text-sm text-muted">บันทึกรอตรวจ</p><p className="mt-1 text-2xl font-bold text-warning">{approved ? '0 รายการ' : '1 รายการ'}</p></div>
          <div className="rounded-xl border border-surface-border bg-surface p-5"><p className="text-sm text-muted">แผนการนิเทศ</p><p className="mt-1 text-2xl font-bold text-primary-dark">3 ครั้ง</p></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <section aria-labelledby="reviews-title" className="rounded-xl border border-surface-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-surface-border pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary"><ClipboardCheck aria-hidden="true" size={20} /></span>
              <div><h2 id="reviews-title" className="font-bold">บันทึกการฝึกงาน</h2><p className="text-sm text-muted">รายการล่าสุดที่ส่งเข้ามา</p></div>
            </div>

            <article className="rounded-lg border border-surface-border bg-background p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">นายณัฐพงษ์ บุญสถิตย์</p>
                  <p className="mt-1 text-sm text-muted">สัปดาห์ที่ 1 · Frontend</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${approved ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>{approved ? 'อนุมัติแล้ว' : 'รอตรวจ'}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">จัดทำส่วนติดต่อผู้ใช้ระบบ InternSync และปรับรูปแบบหน้าบันทึกการปฏิบัติงาน</p>
              {approved && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-success"><Check aria-hidden="true" size={17} />อนุมัติบันทึกตัวอย่างแล้ว</p>}
              <button
                type="button"
                onClick={() => setApproved(true)}
                disabled={approved}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-default disabled:bg-success"
              >
                <Check aria-hidden="true" size={17} />{approved ? 'อนุมัติแล้ว' : 'อนุมัติบันทึก'}
              </button>
            </article>
          </section>

          <section aria-labelledby="visit-title" className="rounded-xl border border-surface-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-surface-border pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-soft text-success"><MapPin aria-hidden="true" size={20} /></span>
              <div><h2 id="visit-title" className="font-bold">บันทึกการนิเทศ</h2><p className="text-sm text-muted">สถานประกอบการ · เชียงใหม่</p></div>
            </div>

            <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-surface-border bg-background px-5 py-6 text-center">
              <MapPin aria-hidden="true" className="mb-2 text-primary" size={25} />
              <p className="text-sm font-semibold text-foreground">{gpsStatus}</p>
              <p className="mt-1 text-xs text-muted">ระบบตัวอย่าง · ยังไม่เชื่อมต่อ GPS หรือแผนที่</p>
            </div>
            <button onClick={handleCheckIn} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary-soft px-4 py-3 font-semibold text-primary transition hover:bg-primary/10">
              <Navigation aria-hidden="true" size={17} />บันทึกพิกัดตัวอย่าง
            </button>
          </section>
        </div>
        <p className="mt-8 text-center text-xs text-muted">InternSync · มหาวิทยาลัยแม่โจ้</p>
      </main>
    </div>
  );
}