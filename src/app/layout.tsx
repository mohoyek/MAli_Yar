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
  title: "مالی‌یار | شرکت حسابداری و مالیاتی",
  description:
    "شرکت حسابداری و مالیاتی مالی‌یار؛ خدمات حسابداری، مالیاتی، بیمه و مشاوره همراه با ابزارهای رایگان محاسبه مالیات حقوق، حقوق و دستمزد، مقایسه مالیات عملکرد و ماده ۱۰۰ و راس‌گیری چک.",
  keywords: [
    "شرکت حسابداری",
    "خدمات مالیاتی",
    "مشاوره مالیاتی",
    "محاسبه مالیات حقوق",
    "حقوق و دستمزد",
    "مقایسه اظهارنامه و تبصره ۱۰۰",
    "راس‌گیری چک",
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
