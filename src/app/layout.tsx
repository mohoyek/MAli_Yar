import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مقایسه مالیات اظهارنامه و تبصره ۱۰۰ | مالی‌یار",
  description:
    "با یک بار وارد کردن فروش، هزینه و عنوان شغل، مالیات عملکرد را هم با روش اظهارنامه و هم با روش تبصره ۱۰۰ پله‌به‌پله محاسبه کنید و کدام روش ارزان‌تر است را ببینید.",
  keywords: [
    "مقایسه اظهارنامه و تبصره ۱۰۰",
    "محاسبه مالیات مشاغل",
    "مالیات مقطوع تبصره ۱۰۰",
    "معافیت ماده ۱۰۱",
    "نرخ پلکانی ماده ۱۳۱",
    "ضریب اینتاکد",
    "ابزار مالیاتی",
  ],
  authors: [{ name: "مالی‌یار" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-[#F8FAFC] text-[#0F172A]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
