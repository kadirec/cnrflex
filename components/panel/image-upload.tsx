"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string | null;
  label?: string;
  hint?: string;
};

export function ImageUpload({ name, defaultValue, label, hint }: Props) {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPick = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(fd);
      if (res.ok) {
        setValue(res.url);
        toast.success("Görsel yüklendi");
      } else {
        toast.error(res.error);
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  const onClear = () => setValue("");

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input type="hidden" name={name} value={value} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {value ? (
        <div className="relative w-40 h-40 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 shadow flex items-center justify-center text-slate-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
            aria-label="Görseli kaldır"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          disabled={pending}
          className={cn(
            "w-40 h-40 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/40 transition",
            pending && "opacity-60 cursor-wait",
          )}
        >
          {pending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Yükleniyor...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Görsel seç</span>
            </>
          )}
        </button>
      )}
      {value && (
        <Button type="button" variant="ghost" size="sm" onClick={onPick} disabled={pending}>
          Değiştir
        </Button>
      )}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
