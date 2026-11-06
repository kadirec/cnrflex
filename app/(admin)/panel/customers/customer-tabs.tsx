"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, ShoppingCart, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerKind } from "@/lib/db/schema";
import { customersHref, sideLabels, type CustomerView } from "@/lib/customer-calc";

export type { CustomerView };

export function CustomerTabs({
  kind,
  view,
  counts,
  sideCounts,
  defaultQuery,
  extraParams,
}: {
  kind: CustomerKind;
  view: CustomerView;
  counts: Record<CustomerView, number>;
  sideCounts: Record<CustomerKind, number>;
  defaultQuery?: string;
  extraParams?: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery ?? "");
  const L = sideLabels(kind);

  const tabs: { view: CustomerView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { view: "list", label: "Cariler", icon: Users },
    { view: "sales", label: L.docs, icon: ShoppingCart },
    { view: "payments", label: L.paymentsTab, icon: Wallet },
  ];
  const placeholder: Record<CustomerView, string> = {
    list: "Firma adı, cari kodu, şehir, yetkili veya telefonda ara…",
    sales: "Cari adı, ürün kodu veya açıklamada ara…",
    payments: "Cari adı, belge no veya açıklamada ara…",
  };
  const search = () => router.push(customersHref(kind, view, { ...extraParams, q: q.trim() || undefined }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {(["customer", "supplier"] as const).map((k) => {
            const active = k === kind;
            const Icon = k === "customer" ? ArrowUpRight : ArrowDownLeft;
            return (
              <Link
                key={k}
                href={customersHref(k, view)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                  active
                    ? k === "customer"
                      ? "bg-brand-950 text-white"
                      : "bg-accent-600 text-white"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {sideLabels(k).customers}
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700",
                  )}
                >
                  {sideCounts[k]}
                </span>
              </Link>
            );
          })}
        </div>

        <div role="tablist" className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
          {tabs.map(({ view: v, label, icon: Icon }) => {
            const active = v === view;
            return (
              <Link
                key={v}
                href={customersHref(kind, v)}
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
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder[view]}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
        </div>
        <Button onClick={search}>Ara</Button>
      </div>
    </div>
  );
}
