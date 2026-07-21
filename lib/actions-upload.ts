"use server";

import { put, del } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Dosya bulunamadı" };
  if (file.size === 0) return { ok: false, error: "Boş dosya" };
  if (file.size > MAX_SIZE) return { ok: false, error: "Dosya 5MB'dan büyük" };
  if (!ALLOWED.includes(file.type)) return { ok: false, error: "Desteklenmeyen dosya tipi" };

  const ext = file.name.split(".").pop() || "bin";
  const key = `content/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, { access: "public", addRandomSuffix: false });
  return { ok: true, url: blob.url };
}

export async function deleteBlob(url: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session.userId) return { ok: false };
  try {
    await del(url);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
