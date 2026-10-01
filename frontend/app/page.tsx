'use client';
import { useState } from 'react';

export default function MockLogin() {
  const [role, setRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-black text-blue-600 mb-2">InternSync</h1>
        <p className="text-slate-500 mb-8">จำลองการ Login (รอ Core Hub Integration)</p>

        {!role ? (
          <div className="space-y-4">
            <button 
              onClick={() => setRole('student')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition"
            >
              👨‍🎓 เข้าสู่ระบบ: นักศึกษา
            </button>
            <button 
              onClick={() => setRole('lecturer')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition"
            >
              👨‍🏫 เข้าสู่ระบบ: อาจารย์ (Lecturer)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 rounded-xl text-slate-700">
              สถานะปัจจุบัน: <span className="font-bold">{role === 'student' ? 'นักศึกษา' : 'อาจารย์'}</span>
            </div>
            
            {role === 'student' && (
              <a href="/student" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition">
                ไปหน้าส่ง Weekly Logbook →
              </a>
            )}

            {role === 'lecturer' && (
              <a href="/teacher" className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition">
                ไปหน้าตรวจ Logbook & GPS →
              </a>
            )}

            <button onClick={() => setRole(null)} className="mt-4 text-sm text-red-500 hover:underline">
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}