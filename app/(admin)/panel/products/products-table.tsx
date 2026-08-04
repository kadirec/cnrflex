"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { deleteProduct, deleteProducts } from "@/lib/actions-products";

export type ProductRow = {
  id: number;
  code: string;
  slug: string;
  nameTr: string;
  imageUrl: string | null;
  sortOrder: number;
  categoryNameTr: string;
};

const GRID = "grid grid-cols-[36px_64px_1fr_180px_100px_120px_140px] gap-4";

export function ProductsTable({ rows }: { rows: ProductRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);
  const [singleTarget, setSingleTarget] = useState<ProductRow | null>(null);
  const [pending, startTransition] = useTransition();

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && selected.size < rows.length;

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const toggleOne = (id: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(rows.map((r) => r.id)) : new Set());
  };

  const runBulkDelete = () => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      const res = await deleteProducts(selectedIds);
      if (res.ok) {
        toast.success(`${res.count} ürün silindi`);
        setSelected(new Set());
        setBulkOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Silme başarısız");
      }
    });
  };

  const runSingleDelete = () => {
    if (!singleTarget) return;
    const id = singleTarget.id;
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.ok) {
        toast.success("Ürün silindi");
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setSingleTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || "Silme başarısız");
      }
    });
  };

  return (
    <>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
          <div className="text-sm text-slate-700">
            <strong>{selected.size}</strong> ürün seçildi
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(new Set())}
              disabled={pending}
            >
              Seçimi temizle
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-red-600 hover:bg-red-700"
              onClick={() => setBulkOpen(true)}
              disabled={pending}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Seçilenleri sil
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          className={`${GRID} border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500`}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              aria-label="Tümünü seç"
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
              checked={allChecked}
              ref={(el) => {
                if (el) el.indeterminate = someChecked;
              }}
              onChange={(e) => toggleAll(e.target.checked)}
            />
          </div>
          <div></div>
          <div>Ürün</div>
          <div>Kategori</div>
          <div>Kod</div>
          <div>Sıra</div>
          <div className="text-right">İşlem</div>
        </div>

        {rows.map((p) => {
          const isSelected = selected.has(p.id);
          return (
            <div
              key={p.id}
              className={`${GRID} items-center border-b border-slate-100 px-5 py-3 transition last:border-b-0 ${
                isSelected ? "bg-slate-50" : "hover:bg-slate-50/60"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  aria-label={`${p.nameTr} seç`}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
                  checked={isSelected}
                  onChange={(e) => toggleOne(p.id, e.target.checked)}
                />
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-slate-900">{p.nameTr}</div>
                <div className="truncate text-xs text-slate-500">/{p.slug}</div>
              </div>
              <div className="truncate text-sm text-slate-700">{p.categoryNameTr}</div>
              <div className="text-sm text-slate-500">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {p.code}
                </Badge>
              </div>
              <div className="text-sm text-slate-600">{p.sortOrder}</div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/panel/products/${p.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" />
                    Düzenle
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setSingleTarget(p)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={bulkOpen} onOpenChange={(o) => !pending && setBulkOpen(o)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seçili ürünler silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selected.size}</strong> ürün silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={runBulkDelete}
              disabled={pending}
              className="bg-red-600 hover:bg-red-700"
            >
              {pending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={singleTarget !== null}
        onOpenChange={(o) => !pending && !o && setSingleTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ürünü sil?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{singleTarget?.nameTr}</strong> ürünü silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={runSingleDelete}
              disabled={pending}
              className="bg-red-600 hover:bg-red-700"
            >
              {pending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
