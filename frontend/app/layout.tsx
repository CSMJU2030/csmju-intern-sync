import type { Metadata } from "next";
import { Noto_Sans_Thai, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "InternSync | ระบบติดตามการฝึกงานสหกิจศึกษา",
    template: "%s | InternSync",
  },
  description: "ระบบบริหารและติดตามการฝึกงานสหกิจศึกษา มหาวิทยาลัยแม่โจ้",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${jakarta.variable} ${notoThai.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
