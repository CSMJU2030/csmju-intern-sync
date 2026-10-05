# csmju-intern-sync

InternSync – ระบบย่อยของโครงการ CSMJU2030

มาตรฐานกลางอยู่ใน `standards/` (submodule ของ CSMJU2030/csmju2030-standards)
สร้างจาก standards v1.7.4

## เริ่มทำงาน

```bash
git submodule update --init --remote standards/
pnpm install
git checkout -b feature/intern-sync/<เรื่องที่ทำ>