"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CustomerKind, SaleStatus } from "@/lib/db/schema";
import { setSaleStatus } from "@/lib/actions-customers";
import { SALE_STATUSES, SALE_STATUS_STYLES, sideLabels } from "@/lib/customer-calc";

/** Listeden sipariş durumunu hızlıca değiştir (Sipariş → Teslim edildi vb.) */
export function SaleStatusSelect({ id, status, side }: { id: number; status: SaleStatus; side: CustomerKind }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const L = sideLabels(side);

  return (
    <select
      value={status}
      disabled={pending}
      aria-label="Durum"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const next = e.target.value as SaleStatus;
        startTransition(async () => {
          const res = await setSaleStatus(id, next);
          if (!res.ok) return void toast.error(res.error);
          toast.success(`Durum: ${L.status[next]}`);
          router.refresh();
        });
      }}
      className={cn(
        "h-7 max-w-full rounded-full border px-2 text-[11px] font-medium cursor-pointer disabled:opacity-60",
        SALE_STATUS_STYLES[status],
      )}
    >
      {SALE_STATUSES.map((s) => (
        <option key={s} value={s}>
          {L.status[s]}
        </option>
      ))}
    </select>
  );
}
