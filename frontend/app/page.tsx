'use client';
import { CsmjuAppShell } from '@csmju2030/design-system';

export default function InternSyncPage() {
  return (
    <CsmjuAppShell>
      {/* 
        โครงสร้าง UI ด้านในนี้จะต้องใช้ Component จาก @csmju2030/design-system 
        เช่น <Button>, <Card>, <Typography> เป็นต้น 
        (ชั่วคราวเว้นว่างไว้ก่อน เพื่อให้ผ่าน CI เรื่อง Auth และโครงสร้างหลัก)
      */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>ยินดีต้อนรับสู่ InternSync</h1>
        <p>รอการพัฒนาระบบ UI ด้วย Design System ของทีม</p>
      </div>
    </CsmjuAppShell>
  );
}