"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Inbox } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  QUOTE_STATUSES,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
} from "@/lib/quote-status";
import type { QuoteStatus } from "@/lib/db";

type Props = {
  defaultStatus?: QuoteStatus;
  defaultUnread?: boolean;
  defaultQuery?: string;
  counts: Record<QuoteStatus, number>;
};

export function QuoteFilters({ defaultStatus, defaultUnread, defaultQuery, counts }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(defaultQuery ?? "");

  const applySearch = () => {
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.push(`/panel/quotes?${params.toString()}`);
  };

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) params.delete(k);
      else params.set(k, v);
    }
    const s = params.toString();
    return s ? `/panel/quotes?${s}` : "/panel/quotes";
  };

  const totalActive = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref({ status: undefined, unread: undefined })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
            !defaultStatus && !defaultUnread
              ? "border-brand-900 bg-brand-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
          )}
        >
          Tümü
          <span className="text-[10px] opacity-80">{totalActive}</span>
        </Link>
        <Link
          href={buildHref({ unread: defaultUnread ? undefined : "1", status: undefined })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
            defaultUnread
              ? "border-sky-600 bg-sky-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
          )}
        >
          <Inbox className="w-3.5 h-3.5" />
          Okunmadı
        </Link>
        {QUOTE_STATUSES.map((s) => (
          <Link
            key={s}
            href={buildHref({ status: defaultStatus === s ? undefined : s })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
              defaultStatus === s
                ? cn(QUOTE_STATUS_STYLES[s], "ring-2 ring-offset-1 ring-current")
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
            )}
          >
            {QUOTE_STATUS_LABELS[s]}
            <span className="text-[10px] opacity-70">{counts[s] ?? 0}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="İsim, e-posta, firma veya mesajda ara…"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") applySearch();
            }}
          />
        </div>
        <Button onClick={applySearch}>Ara</Button>
      </div>
    </div>
  );
}
