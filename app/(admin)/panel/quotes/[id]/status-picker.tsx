"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateQuoteStatus } from "@/lib/actions-quotes";
import {
  QUOTE_STATUSES,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
} from "@/lib/quote-status";
import type { QuoteStatus } from "@/lib/db";

export function StatusPicker({ id, current }: { id: number; current: QuoteStatus }) {
  const [pending, startTransition] = useTransition();

  const setStatus = (next: QuoteStatus) => {
    if (next === current) return;
    startTransition(async () => {
      const res = await updateQuoteStatus(id, next);
      if (res.ok) toast.success("Durum güncellendi");
      else toast.error(res.error);
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      {QUOTE_STATUSES.map((s) => {
        const active = s === current;
        return (
          <button
            key={s}
            type="button"
            disabled={pending || active}
            onClick={() => setStatus(s)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition",
              active
                ? cn(QUOTE_STATUS_STYLES[s], "ring-2 ring-current ring-offset-1")
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              pending && !active && "opacity-50",
            )}
          >
            <span>{QUOTE_STATUS_LABELS[s]}</span>
            {active && <span className="text-[11px]">Seçili</span>}
          </button>
        );
      })}
    </div>
  );
}
