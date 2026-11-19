"use client";

import { useState } from "react";
import { Header, Breadcrumb } from "@/components/site/header";
import { Footer, FloatingButtons } from "@/components/site/footer";
import { HomeView, type Tool } from "@/components/site/home";
import { CompareCalculator } from "@/components/site/compare";
import { SalaryTaxCalculator } from "@/components/site/salary-tax";
import { PayrollCalculator } from "@/components/site/payroll";
import { CheckDueCalculator } from "@/components/site/check-due";
import { IntacodeView } from "@/components/site/intacode";

type View = "home" | Tool;

const TOOL_LABEL: Record<Tool, string> = {
  compare: "مقایسه مالیات عملکرد و ماده ۱۰۰",
  "salary-tax": "محاسبه مالیات حقوق",
  payroll: "محاسبه حقوق و دستمزد",
  "check-due": "راس‌گیری چک",
  intacode: "جدول اینتاکد و ضرایب سود فعالیت",
};

export default function Page() {
  const [view, setView] = useState<View>("home");

  function goHome(section?: string) {
    setView("home");
    setTimeout(() => {
      if (section) {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0 });
      }
    }, 60);
  }

  function openTool(t: Tool) {
    setView(t);
    window.scrollTo({ top: 0 });
  }

  const crumbs =
    view === "home"
      ? [{ label: "خانه" }]
      : [
          { label: "خانه", onClick: () => goHome() },
          { label: "ابزارها", onClick: () => goHome("tools") },
          { label: TOOL_LABEL[view as Tool] },
        ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-16 md:pb-0">
      <Header onHome={goHome} />
      <Breadcrumb items={crumbs} />
      <main className="flex-1">
        {view === "home" && <HomeView onOpenTool={openTool} />}
        {view === "compare" && <CompareCalculator onGoHub={() => goHome()} />}
        {view === "salary-tax" && <SalaryTaxCalculator onGoHome={() => goHome()} />}
        {view === "payroll" && <PayrollCalculator onGoHome={() => goHome()} />}
        {view === "check-due" && <CheckDueCalculator onGoHome={() => goHome()} />}
        {view === "intacode" && <IntacodeView onGoHome={() => goHome()} />}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
