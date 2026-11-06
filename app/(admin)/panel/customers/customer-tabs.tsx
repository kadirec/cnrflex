"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, ShoppingCart, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CustomerView = "list" | "sales" | "payments";

const TABS: { view: CustomerView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { view: "list", label: "Cariler", icon: Users },
  { view: "sales", label: "Satışlar", icon: ShoppingCart },
  { view: "payments", label: "Ödemeler", icon: Wallet },
];

const PLACEHOLDER: Record<CustomerView, string> = {
  list: "Firma adı, cari kodu, şehir, yetkili veya telefonda ara…",
  sales: "Cari adı, ürün kodu veya açıklamada ara…",
  payments: "Cari adı, belge no veya açıklamada ara…",
};

export function CustomerTabs({
  view,
  counts,
  defaultQuery,
  extraParams,
}: {
  view: CustomerView;
  counts: Record<CustomerView, number>;
  defaultQuery?: string;
  extraParams?: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery ?? "");

  const href = (v: CustomerView, params: Record<string, string | undefined> = {}) => {
    const sp = new URLSearchParams();
    if (v !== "list") sp.set("view", v);
    for (const [k, val] of Object.entries(params)) if (val) sp.set(k, val);
    const s = sp.toString();
    return s ? `/panel/customers?${s}` : "/panel/customers";
  };

  return (
    <div className="space-y-3">
      <div role="tablist" className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
        {TABS.map(({ view: v, label, icon: Icon }) => {
          const active = v === view;
          return (
            <Link
              key={v}
              href={href(v)}
              role="tab"
              aria-selected={active}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                active ? "bg-white text-brand-950 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
                  active ? "bg-brand-950 text-white" : "bg-slate-200 text-slate-700",
                )}
              >
                {counts[v]}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={PLACEHOLDER[view]}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(href(view, { ...extraParams, q: q.trim() || undefined }));
            }}
          />
        </div>
        <Button onClick={() => router.push(href(view, { ...extraParams, q: q.trim() || undefined }))}>Ara</Button>
      </div>
    </div>
  );
}
