"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Receipt,
  Calculator,
  ChevronLeft,
  HelpCircle,
  Info,
  ArrowRight,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { faNum, faPercent, parseMoney } from "@/lib/format";
import {
  INCOME_BRACKETS,
  INCOME_EXEMPTION,
  INCOME_YEAR_NOTE,
  VAT_RATE,
  VAT_SEASONS,
  VAT_MONTHS,
  computeIncomeTax,
  computeVAT,
  type TaxYear,
  type VATPeriod,
  type IncomeFormResult,
  type VATFormResult,
} from "@/lib/declaration";

/* -------------------------------------------------------------------------- */
/*  نوع ابزار                                                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

const faqItems = [
  {
    q: "اظهارنامه عملکرد چیست و چه زمانی باید ارسال شود؟",
    a: "اظهارنامه عملکرد، اظهارنامه مالیات بر درآمد اشخاص حقیقی و حقوقی است که سالانه برای درآمد کسب‌وکار به سازمان امور مالیاتی ارسال می‌شود. مهلت ارسال معمولاً تا پایان خرداد سال بعد (برای اشخاص حقیقی) و پایان تیر (برای اشخاص حقوقی) است.",
  },
  {
    q: "مالیات بر درآمد مشاغل چگونه محاسبه می‌شود؟",
    a: "ابتدا درآمد ناخالص منهای بهای تمام‌شده و هزینه‌های قابل قبول، سود حسابداری را می‌دهد. سپس معافیت ماده ۱۰۱ کسر می‌شود و درآمد مشمول وارد پله‌های مالیاتی ماده ۱۳۱ (۱۵٪، ۲۰٪ و ۳۰٪) می‌شود.",
  },
  {
    q: "مالیات بر ارزش افزوده چیست؟",
    a: "مالیات بر ارزش افزوده (VAT) مالیات غیرمستقیمی است که بر تفاضل ارزش فروش و خرید کالاها و خدمات وضع می‌شود. نرخ استاندارد در ایران ۹٪ است. مودی هر دوره، مالیات خروجی (فروش × ۹٪) منهای مالیات ورودی (خرید × ۹٪) را به سازمان امور مالیاتی پرداخت می‌کند.",
  },
  {
    q: "فروش معکوس (Reverse Charge) چیست؟",
    a: "خرید کالا یا خدمات از شخص غیرمودی، خرید معکوس محسوب می‌شود. در این حالت خریدار موظف است ۹٪ مالیات ارزش افزوده را به عنوان مالیات فروش معکوس محاسبه و همزمان به عنوان اعتبار مالیاتی (مالیات خرید معکوس) کسر کند؛ تأثیر خالصی صفر دارد مگر اینکه فروش معکوس وجود داشته باشد و خرید معکوس نداشته باشیم.",
  },
  {
    q: "دوره‌های ارزش افزوده چقدر است؟",
    a: "به‌طور پیش‌فرض دوره‌های ارزش افزوده فصلی است (چهار بار در سال). اشخاص خاص (با درآمد بالا یا حساسیت مالیاتی) ممکن است موظف به ارسال ماهانه شوند. این ابزار هر دو حالت را پشتیبانی می‌کند.",
  },
  {
    q: "این فرم جایگزین اظهارنامه واقعی است؟",
    a: "خیر؛ این یک شبیه‌سازی آموزشی است تا مودیان ساختار اظهارنامه و محاسبات استاندارد را درک کنند. ارقام واقعی باید با کارشناس مالیاتی و از طریق سامانه امور مالیاتی ارسال شوند.",
  },
];

/* -------------------------------------------------------------------------- */
/*  کامپوننت اصلی                                                              */
/* -------------------------------------------------------------------------- */

export function DeclarationForm({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <button
                onClick={onGoHome}
                className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mb-4"
              >
                <ArrowRight className="h-4 w-4" /> بازگشت به خانه
              </button>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 ml-1" />
                فرم شبیه‌سازی‌شده — خروجی استاندارد
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                شبیه‌ساز <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">اظهارنامه عملکرد</mark> و <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">ارزش افزوده</mark>
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                فیلدهای استاندارد اظهارنامه عملکرد (مالیات بر درآمد) و ارزش
                افزوده را مانند اظهارنامه واقعی پر کنید تا خروجی‌های استاندارد
                مالیاتی — شامل درآمد مشمول، پله‌های مالیاتی، مالیات خروجی و
                ورودی و مبلغ نهایی قابل پرداخت — به‌صورت زنده محاسبه شود.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-5"
                >
                  شروع پر کردن فرم <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
                <Button variant="outline" onClick={onGoHome} className="rounded-full">
                  سایر ابزارها
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Tabs */}
      <section id="form" className="pb-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Tabs defaultValue="income" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-6 bg-slate-100 rounded-xl p-1">
              <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900">
                <FileText className="h-4 w-4 ml-1.5" />
                اظهارنامه عملکرد
              </TabsTrigger>
              <TabsTrigger value="vat" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900">
                <Receipt className="h-4 w-4 ml-1.5" />
                اظهارنامه ارزش افزوده
              </TabsTrigger>
            </TabsList>
            <TabsContent value="income">
              <IncomeDeclaration />
            </TabsContent>
            <TabsContent value="vat">
              <VATDeclaration />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-yellow-500" /> سوالات متداول
          </h2>
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-2xl border border-slate-200 px-4"
          >
            {faqItems.map((f, i) => (
              <AccordionItem key={i} value={`i${i}`}>
                <AccordionTrigger className="text-right text-sm font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-7">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

/* ========================================================================== */
/*  اظهارنامه عملکرد                                                          */
/* ========================================================================== */

type IncomeFormState = {
  personType: "real" | "legal";
  name: string;
  nationalId: string;
  economicCode: string;
  activityType: "production" | "commerce" | "services";
  province: string;
  year: TaxYear;
  // درآمد
  salesRevenue: string;
  exportRevenue: string;
  otherIncome: string;
  // هزینه‌ها
  costOfGoodsSold: string;
  personnelCost: string;
  operatingExpense: string;
  depreciation: string;
  otherDeductible: string;
  // مالیات پرداختی
  prepaidTax: string;
};

const INCOME_INITIAL: IncomeFormState = {
  personType: "real",
  name: "",
  nationalId: "",
  economicCode: "",
  activityType: "services",
  province: "تهران",
  year: "1405",
  salesRevenue: "",
  exportRevenue: "",
  otherIncome: "",
  costOfGoodsSold: "",
  personnelCost: "",
  operatingExpense: "",
  depreciation: "",
  otherDeductible: "",
  prepaidTax: "",
};

function IncomeDeclaration() {
  const { toast } = useToast();
  const [form, setForm] = useState<IncomeFormState>(INCOME_INITIAL);
  const [result, setResult] = useState<IncomeFormResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const yearNote = INCOME_YEAR_NOTE[form.year];

  function update<K extends keyof IncomeFormState>(key: K, value: IncomeFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setShowResult(false);
  }

  function calculate() {
    const parsed = {
      salesRevenue: parseMoney(form.salesRevenue),
      exportRevenue: parseMoney(form.exportRevenue),
      otherIncome: parseMoney(form.otherIncome),
      costOfGoodsSold: parseMoney(form.costOfGoodsSold),
      personnelCost: parseMoney(form.personnelCost),
      operatingExpense: parseMoney(form.operatingExpense),
      depreciation: parseMoney(form.depreciation),
      otherDeductible: parseMoney(form.otherDeductible),
      prepaidTax: parseMoney(form.prepaidTax),
      year: form.year,
    };
    if (parsed.salesRevenue === 0 && parsed.exportRevenue === 0 && parsed.otherIncome === 0) {
      toast({
        title: "درآمد وارد نشده",
        description: "حداقل یکی از فیلدهای درآمد را پر کنید.",
        variant: "destructive",
      });
      return;
    }
    const r = computeIncomeTax(parsed);
    setResult(r);
    setShowResult(true);
    toast({
      title: "اظهارنامه محاسبه شد",
      description: "خروجی استاندارد در پایین نمایش داده شد.",
    });
    setTimeout(() => {
      document.getElementById("income-result")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function reset() {
    setForm(INCOME_INITIAL);
    setResult(null);
    setShowResult(false);
  }

  function loadSample() {
    setForm({
      ...INCOME_INITIAL,
      name: "شرکت نمونه — بخش خدمات",
      nationalId: "۱۴۰۰۱۲۳۴۵۶۷",
      economicCode: "۴۱۱۲۲۳۳۴۴۵۵۶",
      personType: "legal",
      activityType: "services",
      salesRevenue: "12,000,000,000",
      exportRevenue: "0",
      otherIncome: "300,000,000",
      costOfGoodsSold: "0",
      personnelCost: "3,500,000,000",
      operatingExpense: "1,800,000,000",
      depreciation: "600,000,000",
      otherDeductible: "200,000,000",
      prepaidTax: "1,200,000,000",
    });
    setShowResult(false);
  }

  function printResult() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Identification card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            <h2 className="font-bold text-slate-900">اظهارنامه مالیات بر عملکرد اشخاص حقیقی/حقوقی</h2>
          </div>
          <span className="text-xs text-slate-500">سال عملکرد {form.year}</span>
        </div>
        <div className="p-6 space-y-5">
          {/* Section: مودی */}
          <FormSection
            icon={<User className="h-4 w-4" />}
            title="بخش اول — مشخصات مودی"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="نوع شخص">
                <Select value={form.personType} onValueChange={(v) => update("personType", v as "real" | "legal")}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real">شخص حقیقی</SelectItem>
                    <SelectItem value="legal">شخص حقوقی</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="نام / نام و نام خانوادگی">
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={form.personType === "legal" ? "نام شرکت" : "نام و نام خانوادگی"}
                  className="h-11"
                />
              </Field>
              <Field label={form.personType === "legal" ? "شناسه ملی" : "کد ملی"}>
                <Input
                  inputMode="numeric"
                  value={form.nationalId}
                  onChange={(e) => update("nationalId", e.target.value)}
                  placeholder={form.personType === "legal" ? "۱۴۰۰۱۲۳۴۵۶۷" : "0012345678"}
                  className="h-11"
                  dir="ltr"
                />
              </Field>
              <Field label="کد اقتصادی">
                <Input
                  inputMode="numeric"
                  value={form.economicCode}
                  onChange={(e) => update("economicCode", e.target.value)}
                  placeholder="41122334455"
                  className="h-11"
                  dir="ltr"
                />
              </Field>
              <Field label="نوع فعالیت">
                <Select value={form.activityType} onValueChange={(v) => update("activityType", v as IncomeFormState["activityType"])}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">تولیدی</SelectItem>
                    <SelectItem value="commerce">بازرگانی</SelectItem>
                    <SelectItem value="services">خدماتی</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="استان محل فعالیت">
                <Input
                  value={form.province}
                  onChange={(e) => update("province", e.target.value)}
                  placeholder="تهران"
                  className="h-11"
                />
              </Field>
              <Field label="سال مالیاتی (عملکرد)">
                <Select value={form.year} onValueChange={(v) => update("year", v as TaxYear)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1405">عملکرد ۱۴۰۵</SelectItem>
                    <SelectItem value="1404">عملکرد ۱۴۰۴</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          {/* Section: درآمد */}
          <FormSection
            icon={<TrendingUp className="h-4 w-4" />}
            title="بخش دوم — درآمد سالانه (ریال)"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <MoneyField
                label="فروش کالا و خدمات (مشمول)"
                value={form.salesRevenue}
                onChange={(v) => update("salesRevenue", v)}
                placeholder="12,000,000,000"
              />
              <MoneyField
                label="درآمد صادرات (نرخ صفر)"
                value={form.exportRevenue}
                onChange={(v) => update("exportRevenue", v)}
                placeholder="0"
              />
              <MoneyField
                label="درآمد غیرعملیاتی (سود بانکی، سود تسعیر ارز)"
                value={form.otherIncome}
                onChange={(v) => update("otherIncome", v)}
                placeholder="300,000,000"
              />
            </div>
          </FormSection>

          {/* Section: هزینه‌ها */}
          <FormSection
            icon={<TrendingDown className="h-4 w-4" />}
            title="بخش سوم — هزینه‌های قابل قبول (ریال)"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MoneyField
                label="بهای تمام‌شده کالای فروش‌رفته"
                value={form.costOfGoodsSold}
                onChange={(v) => update("costOfGoodsSold", v)}
                placeholder="0"
              />
              <MoneyField
                label="دستمزد و هزینه پرسنل"
                value={form.personnelCost}
                onChange={(v) => update("personnelCost", v)}
                placeholder="3,500,000,000"
              />
              <MoneyField
                label="هزینه‌های اداری، عمومی و فروش"
                value={form.operatingExpense}
                onChange={(v) => update("operatingExpense", v)}
                placeholder="1,800,000,000"
              />
              <MoneyField
                label="استهلاک دارایی‌ها"
                value={form.depreciation}
                onChange={(v) => update("depreciation", v)}
                placeholder="600,000,000"
              />
              <MoneyField
                label="سایر هزینه‌های قابل قبول"
                value={form.otherDeductible}
                onChange={(v) => update("otherDeductible", v)}
                placeholder="200,000,000"
              />
            </div>
          </FormSection>

          {/* Section: مالیات پرداختی */}
          <FormSection
            icon={<Receipt className="h-4 w-4" />}
            title="بخش چهارم — مالیات پرداختی/سپرده علی‌الحساب"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <MoneyField
                label="مالیات تسویه‌شده یا علی‌الحساب پرداختی در طول سال"
                value={form.prepaidTax}
                onChange={(v) => update("prepaidTax", v)}
                placeholder="1,200,000,000"
              />
            </div>
          </FormSection>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs text-slate-600 leading-6 flex items-start gap-1">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-yellow-600" /> {yearNote}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={calculate}
              className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6"
            >
              <Calculator className="h-4 w-4 ml-1" /> محاسبه و صدور خروجی
            </Button>
            <Button variant="outline" onClick={loadSample} className="rounded-full">
              بارگذاری نمونه
            </Button>
            <Button variant="outline" onClick={reset} className="rounded-full">
              <RotateCcw className="h-4 w-4 ml-1" /> پاک کردن
            </Button>
          </div>
        </div>
      </div>

      {showResult && result && (
        <IncomeResultPanel
          result={result}
          form={form}
          onPrint={printResult}
        />
      )}
    </div>
  );
}

function IncomeResultPanel({
  result,
  form,
  onPrint,
}: {
  result: IncomeFormResult;
  form: IncomeFormState;
  onPrint: () => void;
}) {
  const brackets = INCOME_BRACKETS[form.year];
  const isPayable = result.finalTax >= 0;
  return (
    <div id="income-result" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-0">
      <div className="px-6 py-4 border-b border-slate-100 bg-yellow-50/60 flex items-center justify-between print:bg-transparent">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-yellow-600" />
          <h2 className="font-bold text-slate-900">خروجی استاندارد اظهارنامه عملکرد</h2>
        </div>
        <Button onClick={onPrint} variant="outline" size="sm" className="rounded-full print:hidden">
          <Printer className="h-4 w-4 ml-1" /> چاپ خروجی
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* خلاصه‌ی اعداد کلیدی */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResultStat label="درآمد ناخالص" value={faNum(result.grossIncome)} unit="ریال" />
          <ResultStat label="هزینه‌های قابل قبول" value={faNum(result.totalDeductible)} unit="ریال" />
          <ResultStat label="سود حسابداری" value={faNum(result.accountingProfit)} unit="ریال" />
          <ResultStat label="معافیت ماده ۱۰۱" value={faNum(result.exemptionAmount)} unit="ریال" />
        </div>

        {/* جدول خروجی استاندارد */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="text-right px-4 py-3 font-medium">ردیف</th>
                <th className="text-right px-4 py-3 font-medium">شرح</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">مبلغ (ریال)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <OutputRow no={1} label="فروش کالا و خدمات مشمول" value={parseMoney(form.salesRevenue)} />
              <OutputRow no={2} label="درآمد صادرات (نرخ صفر)" value={parseMoney(form.exportRevenue)} />
              <OutputRow no={3} label="درآمد غیرعملیاتی" value={parseMoney(form.otherIncome)} />
              <OutputRow total label="جمع درآمد ناخالص (۴+۵+۶)" value={result.grossIncome} />
              <OutputRow no={7} label="بهای تمام‌شده کالای فروش‌رفته" value={parseMoney(form.costOfGoodsSold)} />
              <OutputRow no={8} label="دستمزد و هزینه پرسنل" value={parseMoney(form.personnelCost)} />
              <OutputRow no={9} label="هزینه‌های اداری، عمومی و فروش" value={parseMoney(form.operatingExpense)} />
              <OutputRow no={10} label="استهلاک" value={parseMoney(form.depreciation)} />
              <OutputRow no={11} label="سایر هزینه‌های قابل قبول" value={parseMoney(form.otherDeductible)} />
              <OutputRow total label="جمع هزینه‌های قابل قبول" value={result.totalDeductible} />
              <OutputRow total highlight label="سود حسابداری (درآمد منهای هزینه)" value={result.accountingProfit} />
              <OutputRow no={15} label="معافیت مالیاتی (ماده ۱۰۱)" value={result.exemptionAmount} />
              <OutputRow total highlight label="درآمد مشمول مالیات" value={result.taxableIncome} />
            </tbody>
          </table>
        </div>

        {/* محاسبه پله‌ای مالیات */}
        {result.taxableIncome > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">محاسبه پله‌ای مالیات (ماده ۱۳۱)</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="text-right px-4 py-3 font-medium">پله</th>
                  <th className="text-right px-4 py-3 font-medium">نرخ</th>
                  <th className="text-left px-4 py-3 font-medium">مبلغ مشمول (ریال)</th>
                  <th className="text-left px-4 py-3 font-medium">مالیات پله (ریال)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.perBracket.map((b, i) => {
                  const prev = i === 0 ? 0 : brackets[i - 1].upTo;
                  const cur = brackets[i].upTo;
                  const isInf = !isFinite(cur);
                  return (
                    <tr key={i}>
                      <td className="px-4 py-3 text-slate-700">
                        {isInf ? `مازاد بر ${faNum(prev)}` : `${faNum(prev)} تا ${faNum(cur)}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                          {faPercent(b.rate, 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left tabular-nums">{faNum(b.amount)}</td>
                      <td className="px-4 py-3 text-left tabular-nums font-medium">{faNum(b.tax)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-yellow-50">
                  <td className="px-4 py-3 font-bold text-slate-900" colSpan={3}>
                    جمع مالیات متعلقه
                  </td>
                  <td className="px-4 py-3 text-left tabular-nums font-extrabold text-slate-900">
                    {faNum(result.taxDue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600 flex items-center gap-2">
            <Info className="h-4 w-4 text-yellow-600" />
            درآمد مشمول صفر است؛ به دلیل معافیت ماده ۱۰۱ یا کاهش سود حسابداری. مالیات متعلقه صفر است.
          </div>
        )}

        {/* خلاصه نهایی */}
        <div className="grid sm:grid-cols-3 gap-4">
          <FinalStat label="مالیات متعلقه (محاسبه‌شده)" value={faNum(result.taxDue)} unit="ریال" />
          <FinalStat label="مالیات پرداختی/سپرده" value={faNum(result.prepaidTax)} unit="ریال" />
          <FinalStat
            label={isPayable ? "مالیات قابل پرداخت" : "مالیات قابل استرداد"}
            value={faNum(Math.abs(result.finalTax))}
            unit="ریال"
            tone={isPayable ? "danger" : "success"}
          />
        </div>

        <div className="rounded-xl border border-slate-200 p-4 text-xs text-slate-600 leading-6">
          <div className="font-bold text-slate-900 mb-2">یادداشت محاسباتی</div>
          <ul className="space-y-1 list-disc pr-4">
            <li>نرخ مؤثر مالیات نسبت به سود حسابداری: <span className="font-bold tabular-nums">{faPercent(result.effectiveRate)}</span></li>
            <li>محاسبه بر اساس پله‌های ماده ۱۳۱ قانون مالیات‌های مستقیم و تبصره‌های بودجه سال {form.year} است.</li>
            <li>این خروجی یک شبیه‌سازی آموزشی است و در پرونده واقعی باید با کارشناس مالیاتی بررسی شود.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  اظهارنامه ارزش افزوده                                                     */
/* ========================================================================== */

type VATFormState = {
  personType: "real" | "legal";
  name: string;
  nationalId: string;
  economicCode: string;
  year: TaxYear;
  period: VATPeriod;
  periodIndex: number;
  // فروش
  taxableSales: string;
  exemptSales: string;
  exportSales: string;
  reverseChargeSales: string;
  // خرید
  taxablePurchases: string;
  exemptPurchases: string;
  reverseChargePurchases: string;
  // انتقالی
  carriedForwardCredit: string;
};

const VAT_INITIAL: VATFormState = {
  personType: "legal",
  name: "",
  nationalId: "",
  economicCode: "",
  year: "1405",
  period: "seasonal",
  periodIndex: 1,
  taxableSales: "",
  exemptSales: "",
  exportSales: "",
  reverseChargeSales: "",
  taxablePurchases: "",
  exemptPurchases: "",
  reverseChargePurchases: "",
  carriedForwardCredit: "",
};

function VATDeclaration() {
  const { toast } = useToast();
  const [form, setForm] = useState<VATFormState>(VAT_INITIAL);
  const [result, setResult] = useState<VATFormResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  function update<K extends keyof VATFormState>(key: K, value: VATFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setShowResult(false);
  }

  function calculate() {
    const parsed = {
      taxableSales: parseMoney(form.taxableSales),
      exemptSales: parseMoney(form.exemptSales),
      exportSales: parseMoney(form.exportSales),
      reverseChargeSales: parseMoney(form.reverseChargeSales),
      taxablePurchases: parseMoney(form.taxablePurchases),
      exemptPurchases: parseMoney(form.exemptPurchases),
      reverseChargePurchases: parseMoney(form.reverseChargePurchases),
      carriedForwardCredit: parseMoney(form.carriedForwardCredit),
      year: form.year,
      period: form.period,
      periodIndex: form.periodIndex,
    };
    if (
      parsed.taxableSales === 0 &&
      parsed.exemptSales === 0 &&
      parsed.exportSales === 0 &&
      parsed.reverseChargeSales === 0
    ) {
      toast({
        title: "فروش وارد نشده",
        description: "حداقل یکی از فیلدهای فروش را پر کنید.",
        variant: "destructive",
      });
      return;
    }
    const r = computeVAT(parsed);
    setResult(r);
    setShowResult(true);
    toast({
      title: "اظهارنامه ارزش افزوده محاسبه شد",
      description: "خروجی استاندارد در پایین نمایش داده شد.",
    });
    setTimeout(() => {
      document.getElementById("vat-result")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function reset() {
    setForm(VAT_INITIAL);
    setResult(null);
    setShowResult(false);
  }

  function loadSample() {
    setForm({
      ...VAT_INITIAL,
      name: "شرکت نمونه — بازرگانی",
      nationalId: "۱۴۰۰۷۶۵۴۳۲۱",
      economicCode: "41122334455",
      personType: "legal",
      taxableSales: "5,000,000,000",
      exemptSales: "0",
      exportSales: "800,000,000",
      reverseChargeSales: "0",
      taxablePurchases: "3,500,000,000",
      exemptPurchases: "200,000,000",
      reverseChargePurchases: "0",
      carriedForwardCredit: "45,000,000",
    });
    setShowResult(false);
  }

  function printResult() {
    window.print();
  }

  const periodLabel =
    form.period === "seasonal"
      ? VAT_SEASONS[form.periodIndex - 1]?.label ?? ""
      : VAT_MONTHS[form.periodIndex - 1] ?? "";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-yellow-600" />
            <h2 className="font-bold text-slate-900">اظهارنامه مالیات بر ارزش افزوده</h2>
          </div>
          <span className="text-xs text-slate-500">
            سال {form.year} — {periodLabel}
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* مشخصات */}
          <FormSection
            icon={<Building2 className="h-4 w-4" />}
            title="بخش اول — مشخصات مودی"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="نوع شخص">
                <Select value={form.personType} onValueChange={(v) => update("personType", v as "real" | "legal")}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real">شخص حقیقی</SelectItem>
                    <SelectItem value="legal">شخص حقوقی</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="نام / نام شرکت">
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={form.personType === "legal" ? "نام شرکت" : "نام و نام خانوادگی"}
                  className="h-11"
                />
              </Field>
              <Field label={form.personType === "legal" ? "شناسه ملی" : "کد ملی"}>
                <Input
                  inputMode="numeric"
                  value={form.nationalId}
                  onChange={(e) => update("nationalId", e.target.value)}
                  placeholder="14007654321"
                  className="h-11"
                  dir="ltr"
                />
              </Field>
              <Field label="کد اقتصادی">
                <Input
                  inputMode="numeric"
                  value={form.economicCode}
                  onChange={(e) => update("economicCode", e.target.value)}
                  placeholder="41122334455"
                  className="h-11"
                  dir="ltr"
                />
              </Field>
              <Field label="سال">
                <Select value={form.year} onValueChange={(v) => update("year", v as TaxYear)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1405">۱۴۰۵</SelectItem>
                    <SelectItem value="1404">۱۴۰۴</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="نوع دوره">
                <Select value={form.period} onValueChange={(v) => update("period", v as VATPeriod)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seasonal">فصلی</SelectItem>
                    <SelectItem value="monthly">ماهانه</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={form.period === "seasonal" ? "فصل" : "ماه"}>
                <Select
                  value={String(form.periodIndex)}
                  onValueChange={(v) => update("periodIndex", Number(v))}
                >
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {form.period === "seasonal"
                      ? VAT_SEASONS.map((s, i) => (
                          <SelectItem key={s.id} value={String(i + 1)}>{s.label}</SelectItem>
                        ))
                      : VAT_MONTHS.map((m, i) => (
                          <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          {/* فروش */}
          <FormSection
            icon={<TrendingUp className="h-4 w-4" />}
            title={`بخش دوم — فروش و خدمات ارائه‌شده (ریال) — نرخ استاندارد ${faPercent(VAT_RATE, 0)}`}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MoneyField
                label="فروش کالا و خدمات مشمول"
                value={form.taxableSales}
                onChange={(v) => update("taxableSales", v)}
                placeholder="5,000,000,000"
              />
              <MoneyField
                label="فروش معاف (موضوع ماده ۱۲)"
                value={form.exemptSales}
                onChange={(v) => update("exemptSales", v)}
                placeholder="0"
              />
              <MoneyField
                label="صادرات (نرخ صفر)"
                value={form.exportSales}
                onChange={(v) => update("exportSales", v)}
                placeholder="800,000,000"
              />
              <MoneyField
                label="فروش معکوس (خرید از غیرمودی)"
                value={form.reverseChargeSales}
                onChange={(v) => update("reverseChargeSales", v)}
                placeholder="0"
              />
            </div>
          </FormSection>

          {/* خرید */}
          <FormSection
            icon={<TrendingDown className="h-4 w-4" />}
            title="بخش سوم — خریدها و هزینه‌ها (ریال)"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <MoneyField
                label="خریدهای مشمول (با فاکتور رسمی)"
                value={form.taxablePurchases}
                onChange={(v) => update("taxablePurchases", v)}
                placeholder="3,500,000,000"
              />
              <MoneyField
                label="خریدهای معاف"
                value={form.exemptPurchases}
                onChange={(v) => update("exemptPurchases", v)}
                placeholder="200,000,000"
              />
              <MoneyField
                label="خرید معکوس (خرید از غیرمودی)"
                value={form.reverseChargePurchases}
                onChange={(v) => update("reverseChargePurchases", v)}
                placeholder="0"
              />
            </div>
          </FormSection>

          {/* اعتبار انتقالی */}
          <FormSection
            icon={<Receipt className="h-4 w-4" />}
            title="بخش چهارم — اعتبار مالیاتی انتقالی از دوره قبل"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <MoneyField
                label="اعتبار مالیاتی قابل انتقال از دوره قبل"
                value={form.carriedForwardCredit}
                onChange={(v) => update("carriedForwardCredit", v)}
                placeholder="45,000,000"
              />
            </div>
          </FormSection>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs text-slate-600 leading-6 flex items-start gap-1">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-yellow-600" />
              نرخ استاندارد مالیات بر ارزش افزوده {faPercent(VAT_RATE, 0)} است. صادرات با نرخ صفر و
              فروش معاف (موضوع ماده ۱۲) مالیات‌بردار نیست. مالیات خروجی بر فروش مشمول،
              و مالیات ورودی بر خریدهای دارای فاکتور رسمی محاسبه می‌شود.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={calculate}
              className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6"
            >
              <Calculator className="h-4 w-4 ml-1" /> محاسبه و صدور خروجی
            </Button>
            <Button variant="outline" onClick={loadSample} className="rounded-full">
              بارگذاری نمونه
            </Button>
            <Button variant="outline" onClick={reset} className="rounded-full">
              <RotateCcw className="h-4 w-4 ml-1" /> پاک کردن
            </Button>
          </div>
        </div>
      </div>

      {showResult && result && (
        <VATResultPanel result={result} form={form} onPrint={printResult} />
      )}
    </div>
  );
}

function VATResultPanel({
  result,
  form,
  onPrint,
}: {
  result: VATFormResult;
  form: VATFormState;
  onPrint: () => void;
}) {
  const periodLabel =
    form.period === "seasonal"
      ? VAT_SEASONS[form.periodIndex - 1]?.label ?? ""
      : VAT_MONTHS[form.periodIndex - 1] ?? "";
  const isPayable = result.payableVAT > 0;

  return (
    <div id="vat-result" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-0">
      <div className="px-6 py-4 border-b border-slate-100 bg-yellow-50/60 flex items-center justify-between print:bg-transparent">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-yellow-600" />
          <h2 className="font-bold text-slate-900">
            خروجی استاندارد اظهارنامه ارزش افزوده — {periodLabel} {form.year}
          </h2>
        </div>
        <Button onClick={onPrint} variant="outline" size="sm" className="rounded-full print:hidden">
          <Printer className="h-4 w-4 ml-1" /> چاپ خروجی
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* خلاصه‌ی کلیدی */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResultStat label="کل فروش و خدمات" value={faNum(result.totalSales)} unit="ریال" />
          <ResultStat label="مالیات خروجی (فروش)" value={faNum(result.outputVAT + result.reverseChargeOutputVAT)} unit="ریال" />
          <ResultStat label="مالیات ورودی (خرید + انتقالی)" value={faNum(result.totalCredit)} unit="ریال" />
          <ResultStat
            label={isPayable ? "مالیات قابل پرداخت" : "مالیات قابل استرداد/انتقال"}
            value={faNum(Math.abs(result.netVAT))}
            unit="ریال"
            accent
            tone={isPayable ? "danger" : "success"}
          />
        </div>

        {/* جدول خروجی استاندارد */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="text-right px-4 py-3 font-medium">ردیف</th>
                <th className="text-right px-4 py-3 font-medium">شرح</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">مبلغ (ریال)</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">مالیات (ریال)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <OutputRowVAT no={1} label="فروش کالا و خدمات مشمول" value={parseMoney(form.taxableSales)} vat={result.outputVAT} />
              <OutputRowVAT no={2} label="فروش معاف (موضوع ماده ۱۲)" value={parseMoney(form.exemptSales)} vat={0} />
              <OutputRowVAT no={3} label="صادرات (نرخ صفر)" value={parseMoney(form.exportSales)} vat={0} />
              <OutputRowVAT no={4} label="فروش معکوس" value={parseMoney(form.reverseChargeSales)} vat={result.reverseChargeOutputVAT} />
              <OutputRowVAT total label="جمع فروش و خدمات" value={result.totalSales} vat={result.outputVAT + result.reverseChargeOutputVAT} />
              <OutputRowVAT no={6} label="خریدهای مشمول (با فاکتور رسمی)" value={parseMoney(form.taxablePurchases)} vat={result.inputVAT} />
              <OutputRowVAT no={7} label="خریدهای معاف" value={parseMoney(form.exemptPurchases)} vat={0} />
              <OutputRowVAT no={8} label="خرید معکوس" value={parseMoney(form.reverseChargePurchases)} vat={result.reverseChargeInputVAT} />
              <OutputRowVAT no={9} label="اعتبار مالیاتی انتقالی از دوره قبل" value={parseMoney(form.carriedForwardCredit)} vat={0} />
              <OutputRowVAT total label="جمع اعتبار مالیاتی (مالیات ورودی)" value={parseMoney(form.taxablePurchases) + parseMoney(form.reverseChargePurchases) + parseMoney(form.carriedForwardCredit)} vat={result.totalCredit} />
            </tbody>
          </table>
        </div>

        {/* جمع‌بندی نهایی */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900">محاسبه نهایی مالیات قابل پرداخت</h3>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 text-slate-600">مالیات خروجی (مشمول + معکوس)</td>
                <td className="px-4 py-3 text-left tabular-nums font-medium">
                  {faNum(result.outputVAT + result.reverseChargeOutputVAT)} ریال
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-600">(−) جمع اعتبار مالیاتی (ورودی + انتقالی)</td>
                <td className="px-4 py-3 text-left tabular-nums font-medium">
                  {faNum(result.totalCredit)} ریال
                </td>
              </tr>
              <tr className={isPayable ? "bg-red-50" : "bg-green-50"}>
                <td className="px-4 py-3 font-bold text-slate-900">
                  {isPayable ? "مالیات خالص قابل پرداخت" : "اعتبار مالیاتی قابل استرداد/انتقال به دوره بعد"}
                </td>
                <td className="px-4 py-3 text-left tabular-nums font-extrabold text-slate-900">
                  {faNum(Math.abs(result.netVAT))} ریال
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {isPayable ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            در این دوره، مالیات خروجی از اعتبار ورودی بیشتر است؛ مبلغ {faNum(result.payableVAT)} ریال
            باید تا پایان مهلت قانونی (معمولاً ۱۵ روز پس از پایان فصل/ماه) به سازمان امور مالیاتی پرداخت شود.
          </div>
        ) : (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            در این دوره، اعتبار مالیاتی ورودی از مالیات خروجی بیشتر است؛ مبلغ {faNum(result.refundableVAT)} ریال
            قابل استرداد است یا به عنوان اعتبار به دوره بعد منتقل می‌شود.
          </div>
        )}

        <div className="rounded-xl border border-slate-200 p-4 text-xs text-slate-600 leading-6">
          <div className="font-bold text-slate-900 mb-2">یادداشت محاسباتی</div>
          <ul className="space-y-1 list-disc pr-4">
            <li>نرخ استاندارد مالیات بر ارزش افزوده: {faPercent(VAT_RATE, 0)}</li>
            <li>صادرات با نرخ صفر و فروش معاف (موضوع ماده ۱۲) در مالیات‌برداری لحاظ نمی‌شوند.</li>
            <li>فروش معکوس و خرید معکوس هر دو با نرخ ۹٪ محاسبه می‌شوند؛ تأثیر خالصی آن‌ها در صورت تعادل صفر است.</li>
            <li>این خروجی یک شبیه‌سازی آموزشی است و در پرونده واقعی باید با کارشناس مالیاتی بررسی شود.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  اجزای کمکی                                                                */
/* ========================================================================== */

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="grid place-items-center h-7 w-7 rounded-lg bg-yellow-100 text-yellow-700">
          {icon}
        </span>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      <Input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 text-sm tabular-nums"
        dir="ltr"
      />
    </div>
  );
}

function ResultStat({
  label,
  value,
  unit,
  accent,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
  tone?: "danger" | "success";
}) {
  const cls =
    tone === "danger"
      ? "bg-red-50 border-red-200"
      : tone === "success"
      ? "bg-green-50 border-green-200"
      : accent
      ? "bg-yellow-50 border-yellow-200"
      : "bg-white border-slate-200";
  const txt =
    tone === "danger"
      ? "text-red-800"
      : tone === "success"
      ? "text-green-800"
      : accent
      ? "text-yellow-800"
      : "text-slate-900";
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-lg md:text-xl font-extrabold tabular-nums ${txt}`}>{value}</div>
      {unit && <div className="text-[10px] text-slate-400 mt-0.5">{unit}</div>}
    </div>
  );
}

function FinalStat({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "danger" | "success";
}) {
  const cls =
    tone === "danger"
      ? "bg-red-50 border-red-200"
      : tone === "success"
      ? "bg-green-50 border-green-200"
      : "bg-white border-slate-200";
  const txt =
    tone === "danger"
      ? "text-red-800"
      : tone === "success"
      ? "text-green-800"
      : "text-slate-900";
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-extrabold tabular-nums ${txt}`}>{value}</div>
      {unit && <div className="text-[10px] text-slate-400 mt-0.5">{unit}</div>}
    </div>
  );
}

function OutputRow({
  no,
  label,
  value,
  total,
  highlight,
}: {
  no?: number;
  label: string;
  value: number;
  total?: boolean;
  highlight?: boolean;
}) {
  return (
    <tr className={highlight ? "bg-yellow-50" : total ? "bg-slate-50" : ""}>
      <td className="px-4 py-2.5 text-slate-500 text-xs tabular-nums">{no ?? ""}</td>
      <td className={`px-4 py-2.5 ${total ? "font-bold text-slate-900" : "text-slate-700"} text-sm`}>{label}</td>
      <td className={`px-4 py-2.5 text-left tabular-nums ${total ? "font-extrabold text-slate-900" : "text-slate-800"} text-sm`}>
        {faNum(value)}
      </td>
    </tr>
  );
}

function OutputRowVAT({
  no,
  label,
  value,
  vat,
  total,
}: {
  no?: number;
  label: string;
  value: number;
  vat: number;
  total?: boolean;
}) {
  return (
    <tr className={total ? "bg-slate-50" : ""}>
      <td className="px-4 py-2.5 text-slate-500 text-xs tabular-nums">{no ?? ""}</td>
      <td className={`px-4 py-2.5 ${total ? "font-bold text-slate-900" : "text-slate-700"} text-sm`}>{label}</td>
      <td className={`px-4 py-2.5 text-left tabular-nums ${total ? "font-extrabold" : ""} text-sm text-slate-800`}>
        {faNum(value)}
      </td>
      <td className={`px-4 py-2.5 text-left tabular-nums ${total ? "font-extrabold text-slate-900" : "text-slate-700"} text-sm`}>
        {faNum(vat)}
      </td>
    </tr>
  );
}
