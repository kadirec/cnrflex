import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/lib/db";
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_STYLES } from "@/lib/quote-status";

export function QuoteStatusBadge({
  status,
  size = "sm",
}: {
  status: QuoteStatus;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        QUOTE_STATUS_STYLES[status],
      )}
    >
      {QUOTE_STATUS_LABELS[status]}
    </span>
  );
}
