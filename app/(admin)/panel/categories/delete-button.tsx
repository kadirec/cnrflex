"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { deleteCategory } from "@/lib/actions-categories";

export function DeleteCategoryButton({
  id,
  name,
  productCount,
}: {
  id: number;
  name: string;
  productCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onConfirm = () => {
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.ok) {
        toast.success("Kategori silindi");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Silme başarısız");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-3.5 h-3.5" />
        Sil
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kategoriyi sil?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{name}</strong> kategorisi silinecek.
            {productCount > 0 && (
              <span className="block mt-2 text-red-700">
                ⚠ Bu kategoriye bağlı <strong>{productCount} ürün</strong> de birlikte silinecek. Bu işlem geri
                alınamaz.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={pending}
            className="bg-red-600 hover:bg-red-700"
          >
            {pending ? "Siliniyor..." : "Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
