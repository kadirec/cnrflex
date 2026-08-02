"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { MailOpen, Mail } from "lucide-react";
import { markQuoteUnread, markQuoteRead } from "@/lib/actions-quotes";

export function ReadToggle({ id, isRead }: { id: number; isRead: boolean }) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = isRead ? await markQuoteUnread(id) : await markQuoteRead(id);
      if (res.ok) {
        toast.success(isRead ? "Okunmadı olarak işaretlendi" : "Okundu olarak işaretlendi");
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
    >
      {isRead ? (
        <>
          <Mail className="w-4 h-4" />
          Okunmadı olarak işaretle
        </>
      ) : (
        <>
          <MailOpen className="w-4 h-4" />
          Okundu olarak işaretle
        </>
      )}
    </button>
  );
}
