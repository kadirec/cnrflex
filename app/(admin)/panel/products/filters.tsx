"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Category = { id: number; nameTr: string; slug: string; depth?: number };

export function ProductFilters({
  categories,
  defaultCategory,
  defaultQuery,
}: {
  categories: Category[];
  defaultCategory?: string;
  defaultQuery?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(defaultQuery ?? "");
  const [cat, setCat] = useState(defaultCategory ?? "all");

  const apply = () => {
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    if (cat && cat !== "all") params.set("category", cat);
    else params.delete("category");
    router.push(`/panel/products?${params.toString()}`);
  };

  const reset = () => {
    setQ("");
    setCat("all");
    router.push("/panel/products");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ürün adı veya kodu ara..."
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") apply();
          }}
        />
      </div>
      <Select value={cat} onValueChange={(v) => setCat(v ?? "all")}>
        <SelectTrigger className="md:w-64">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm kategoriler</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {"— ".repeat(c.depth ?? 0)}
              {c.nameTr}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button onClick={apply}>Filtrele</Button>
        {(defaultCategory || defaultQuery) && (
          <Button variant="ghost" onClick={reset}>
            Temizle
          </Button>
        )}
      </div>
    </div>
  );
}
