"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductSpec } from "@/lib/db";

type Props = {
  name: string;
  defaultValue?: ProductSpec[] | null;
};

export function SpecsEditor({ name, defaultValue }: Props) {
  const [specs, setSpecs] = useState<ProductSpec[]>(defaultValue ?? []);

  const update = (i: number, patch: Partial<ProductSpec>) => {
    setSpecs((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch, label: { ...s.label, ...(patch.label ?? {}) }, value: { ...s.value, ...(patch.value ?? {}) } } : s)),
    );
  };

  const remove = (i: number) => setSpecs((prev) => prev.filter((_, idx) => idx !== i));
  const add = () =>
    setSpecs((prev) => [...prev, { label: { tr: "", en: "" }, value: { tr: "", en: "" } }]);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(specs.filter((s) => s.label.tr && s.value.tr))} />

      {specs.length === 0 && (
        <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-md">
          Henüz özellik yok. Aşağıdan ekleyin.
        </p>
      )}

      {specs.map((s, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-start">
          <Input
            placeholder="Etiket (TR)"
            value={s.label.tr}
            onChange={(e) => update(i, { label: { tr: e.target.value, en: s.label.en } })}
          />
          <Input
            placeholder="Label (EN)"
            value={s.label.en}
            onChange={(e) => update(i, { label: { tr: s.label.tr, en: e.target.value } })}
          />
          <Input
            placeholder="Değer (TR)"
            value={s.value.tr}
            onChange={(e) => update(i, { value: { tr: e.target.value, en: s.value.en } })}
          />
          <Input
            placeholder="Value (EN)"
            value={s.value.en}
            onChange={(e) => update(i, { value: { tr: s.value.tr, en: e.target.value } })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(i)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" />
        Özellik ekle
      </Button>
    </div>
  );
}
