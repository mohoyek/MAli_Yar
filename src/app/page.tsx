"use client";

import { useState } from "react";
import { Header, Breadcrumb } from "@/components/site/header";
import { Footer, FloatingButtons } from "@/components/site/footer";
import { HubView } from "@/components/site/hub";
import { CompareCalculator } from "@/components/site/compare";

type View = "hub" | "compare";

export default function Page() {
  const [view, setView] = useState<View>("hub");

  const goHub = () => {
    setView("hub");
    window.scrollTo({ top: 0 });
  };
  const goCompare = () => {
    setView("compare");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-16 md:pb-0">
      <Header />
      <Breadcrumb
        items={
          view === "hub"
            ? [
                { label: "صفحه اصلی", onClick: goHub },
                { label: "محاسبه‌گرها" },
              ]
            : [
                { label: "صفحه اصلی", onClick: goHub },
                { label: "ابزارها", onClick: goHub },
                { label: "محاسبه مالیات", onClick: goHub },
                { label: "مقایسه اظهارنامه و تبصره ۱۰۰" },
              ]
        }
      />
      <main className="flex-1">
        {view === "hub" ? (
          <HubView onOpenCompare={goCompare} />
        ) : (
          <CompareCalculator onGoHub={goHub} />
        )}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
