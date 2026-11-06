import { cn } from "@/lib/utils";
import type { CustomerKind, SaleKind, SaleStatus } from "@/lib/db/schema";
import { SALE_STATUS_STYLES, sideLabels } from "@/lib/customer-calc";

export function SaleStatusBadge({
  status,
  kind,
  side = "customer",
}: {
  status: SaleStatus;
  kind?: SaleKind;
  side?: CustomerKind;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
          SALE_STATUS_STYLES[status],
        )}
      >
        {sideLabels(side).status[status]}
      </span>
      {kind === "return" && (
        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
          İade
        </span>
      )}
    </span>
  );
}
