'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [week, setWeek] = useState('1');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`ส่ง Logbook สัปดาห์ที่ ${week} เรียบร้อยแล้ว! (จำลองการบันทึก)`);
    setDetails('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-600">📝 ส่ง Weekly Logbook</h1>
          <Link href="/" className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg transition">
            กลับหน้าแรก
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">สัปดาห์ที่:</label>
            <select 
              value={week} 
              onChange={(e) => setWeek(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
                <option key={w} value={w}>สัปดาห์ที่ {w}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">รายละเอียดงานที่ปฏิบัติ:</label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="อธิบายงานที่คุณทำในสัปดาห์นี้..."
              required
            ></textarea>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition mt-4">
            ส่ง Logbook
          </button>
        </form>
      </div>
    </div>
  );
}