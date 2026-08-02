"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, Loader2, ArrowLeft, ArrowRight, Star } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions-upload";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string[] | null;
  max?: number;
  hint?: string;
};

export function MultiImageUpload({ name, defaultValue, max = 8, hint }: Props) {
  const [urls, setUrls] = useState<string[]>(() =>
    Array.isArray(defaultValue) ? defaultValue.filter(Boolean) : [],
  );
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const remaining = max - urls.length;
  const canAdd = remaining > 0 && !pending;

  const onPick = () => fileRef.current?.click();

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileRef.current) fileRef.current.value = "";
    if (files.length === 0) return;

    const slots = max - urls.length;
    if (files.length > slots) {
      toast.warning(`En fazla ${max} görsel — ${slots} tanesi yüklenecek`);
    }
    const toUpload = files.slice(0, slots);
    if (toUpload.length === 0) return;

    startTransition(async () => {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadImage(fd);
        if (res.ok) {
          uploaded.push(res.url);
        } else {
          toast.error(`${file.name}: ${res.error}`);
        }
      }
      if (uploaded.length > 0) {
        setUrls((prev) => [...prev, ...uploaded].slice(0, max));
        toast.success(`${uploaded.length} görsel yüklendi`);
      }
    });
  };

  const removeAt = (i: number) => setUrls((prev) => prev.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    setUrls((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFiles}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {urls.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />

            {i === 0 && (
              <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 shadow">
                <Star className="w-3 h-3 fill-white" />
                Kapak
              </div>
            )}

            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 shadow flex items-center justify-center text-slate-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
              aria-label="Görseli kaldır"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-1.5 py-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="w-6 h-6 rounded bg-white/90 flex items-center justify-center text-slate-700 disabled:opacity-40"
                aria-label="Sola taşı"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-semibold text-white/90">{i + 1}</span>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === urls.length - 1}
                className="w-6 h-6 rounded bg-white/90 flex items-center justify-center text-slate-700 disabled:opacity-40"
                aria-label="Sağa taşı"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={onPick}
            disabled={!canAdd}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/40 transition",
              pending && "opacity-60 cursor-wait",
            )}
          >
            {pending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Yükleniyor…</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Görsel ekle</span>
                <span className="text-[10px] text-slate-400">
                  {urls.length}/{max}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>{hint ?? "Sürükle-bırak yok — sıralamayı ok tuşlarıyla değiştirin. İlk görsel kapak olur."}</p>
        <span className="font-medium">
          {urls.length}/{max}
        </span>
      </div>
    </div>
  );
}
