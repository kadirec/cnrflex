"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { StickyNote, Trash2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addQuoteNote, deleteQuoteNote } from "@/lib/actions-quotes";
import type { QuoteNote } from "@/lib/db";

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function NotesSection({ id, notes }: { id: number; notes: QuoteNote[] }) {
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const res = await addQuoteNote(id, trimmed);
      if (res.ok) {
        setText("");
        toast.success("Not eklendi");
      } else {
        toast.error(res.error);
      }
    });
  };

  const remove = (index: number) => {
    setDeletingIndex(index);
    startTransition(async () => {
      const res = await deleteQuoteNote(id, index);
      if (res.ok) toast.success("Not silindi");
      else toast.error(res.error);
      setDeletingIndex(null);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-amber-500" />
          Dahili notlar
          <span className="text-xs font-normal text-slate-500">
            ({notes.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">Henüz not eklenmedi.</p>
        ) : (
          <ol className="space-y-3">
            {notes.map((n, i) => (
              <li
                key={`${n.createdAt}-${i}`}
                className="rounded-lg border border-slate-200 bg-amber-50/40 px-3.5 py-2.5 group"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-700">{n.author}</span>
                    {" · "}
                    {formatDate(n.createdAt)}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={pending}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition disabled:opacity-30"
                    aria-label="Notu sil"
                  >
                    {deletingIndex === i && pending ? (
                      <span className="text-[10px]">…</span>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-sm text-slate-800 whitespace-pre-wrap">{n.text}</p>
              </li>
            ))}
          </ol>
        )}

        <div className="space-y-2 border-t border-slate-200 pt-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bir not ekle… (yalnızca admin görür)"
            rows={3}
            disabled={pending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">Cmd/Ctrl + Enter ile gönder</p>
            <Button
              type="button"
              size="sm"
              onClick={submit}
              disabled={pending || !text.trim()}
              className="gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Not ekle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
