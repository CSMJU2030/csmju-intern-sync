'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function TeacherDashboard() {
  const [gpsStatus, setGpsStatus] = useState('ยังไม่ได้เช็คอิน');

  const handleCheckIn = () => {
    setGpsStatus('📍 เช็คอินสำเร็จ: ละติจูด 18.89... ลองจิจูด 99.01...');
    alert('บันทึกพิกัด GPS เพื่อการนิเทศงานสำเร็จ!');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* แถบหัวเว็บ */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-emerald-600">👨‍‍🏫 แดชบอร์ดอาจารย์นิเทศก์</h1>
          <Link href="/" className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition">
            กลับหน้าแรก
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ส่วนที่ 1: ตรวจ Logbook */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">📋 รอตรวจ Logbook</h2>
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <p className="font-bold">นายณัฐพงษ์ บุญสถิตย์</p>
                <p className="text-sm text-slate-600 mb-3">สัปดาห์ที่ 1 - จัดทำหน้า UI ระบบ InternSync (Frontend)</p>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm transition">
                  ✅ อนุมัติ Logbook
                </button>
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2: จำลอง GPS Check-in */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">📍 พิกัดนิเทศงาน (GPS Check-in)</h2>
            
            {/* พื้นที่จำลองแผนที่ */}
            <div className="h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-slate-300">
              <span className="text-slate-400 text-sm text-center px-4">
                (พื้นที่เตรียมเชื่อมต่อแผนที่ Leaflet ตามมาตรฐาน v1.7.0)
              </span>
            </div>
            
            <p className="text-sm font-semibold text-slate-600 mb-4">สถานะปัจจุบัน: <span className="text-blue-600">{gpsStatus}</span></p>
            
            <button onClick={handleCheckIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
              กดเพื่อ Check-in ยืนยันสถานที่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}