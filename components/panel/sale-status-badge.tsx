import { cn } from "@/lib/utils";
import type { SaleKind, SaleStatus } from "@/lib/db/schema";
import { SALE_STATUS_LABELS, SALE_STATUS_STYLES } from "@/lib/customer-calc";

export function SaleStatusBadge({ status, kind }: { status: SaleStatus; kind?: SaleKind }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
          SALE_STATUS_STYLES[status],
        )}
      >
        {SALE_STATUS_LABELS[status]}
      </span>
      {kind === "return" && (
        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
          İade
        </span>
      )}
    </span>
  );
}
