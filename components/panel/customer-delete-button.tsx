"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCustomer, deletePayment, deleteSale } from "@/lib/actions-customers";

type Target = "customer" | "sale" | "payment";

const COPY: Record<Target, { title: string; body: string; done: string }> = {
  customer: {
    title: "Cariyi sil?",
    body: "carisi ve ona ait tüm satış ve ödeme kayıtları silinecek.",
    done: "Cari silindi",
  },
  sale: { title: "Satışı sil?", body: "kaydı silinecek ve bakiyeden düşülecek.", done: "Satış silindi" },
  payment: { title: "Ödemeyi sil?", body: "ödeme kaydı silinecek ve bakiyeye geri eklenecek.", done: "Ödeme silindi" },
};

export function CustomerDeleteButton({
  target,
  id,
  name,
  redirectTo,
}: {
  target: Target;
  id: number;
  name: string;
  redirectTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const copy = COPY[target];

  const onConfirm = () => {
    startTransition(async () => {
      const fn = target === "customer" ? deleteCustomer : target === "sale" ? deleteSale : deletePayment;
      const res = await fn(id);
      if (res.ok) {
        toast.success(copy.done);
        setOpen(false);
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      } else {
        toast.error(res.error || "Silme başarısız");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
        aria-label="Sil"
        title="Sil"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{name}</strong> {copy.body} Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={pending} className="bg-red-600 hover:bg-red-700">
            {pending ? "Siliniyor..." : "Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
