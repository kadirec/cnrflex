"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useQuoteCart } from "@/components/cart/QuoteCartContext";
import { RollCountDialog, buildRollQuantity } from "@/components/product/roll-count-dialog";
import { cn } from "@/lib/utils";
import { type Locale, localePrefix } from "@/lib/site";

type Props = {
  locale: Locale;
  productId: number;
  code: string;
  name: string;
  image: string | null;
  slug: string;
  categoryName: string;
  categorySlug: string;
  rollLength: number | null;
  label: string;
};

export function AddToQuoteButton({
  locale,
  productId,
  code,
  name,
  image,
  slug,
  categoryName,
  categorySlug,
  rollLength,
  label,
}: Props) {
  const router = useRouter();
  const { add, isInCart, hydrated } = useQuoteCart();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const inCart = hydrated && isInCart(productId);

  const commit = (count: number | null) => {
    const quantity =
      rollLength && count ? buildRollQuantity(count, rollLength, locale) : "";
    add({
      productId,
      code,
      name,
      image,
      slug,
      categoryName,
      categorySlug,
      quantity,
      note: "",
      rollLength: rollLength ?? null,
      rollCount: count ?? null,
    });
    toast.success(locale === "tr" ? "Teklif listesine eklendi" : "Added to quote list");
    setOpen(false);
  };

  const onClick = () => {
    if (inCart) {
      startTransition(() => router.push(`${localePrefix(locale)}/teklif-al`));
      return;
    }
    if (rollLength) {
      setOpen(true);
    } else {
      commit(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-semibold text-white shadow-lg transition",
          inCart
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
            : "bg-accent-500 hover:bg-accent-600 shadow-accent-500/30",
        )}
      >
        {inCart ? (
          <>
            <Check className="h-4 w-4" />
            {locale === "tr" ? "Listede · Listeyi Gör" : "In List · View"}
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            {label}
          </>
        )}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </button>

      {rollLength && (
        <RollCountDialog
          open={open}
          onOpenChange={setOpen}
          locale={locale}
          product={{ code, name, image, categoryName, rollLength }}
          onConfirm={commit}
        />
      )}
    </>
  );
}
